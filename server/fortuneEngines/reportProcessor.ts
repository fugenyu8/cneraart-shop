/**
 * 报告处理系统
 * 统一处理命理服务报告的生成、存储和交付
 */

import { analyzeFaceReading, generateFaceReadingReport } from "./faceReading";
import { analyzePalmReading, generatePalmReadingReport } from "./palmReading";
import { analyzeFengshui, generateFengshuiReport } from "./fengshui";
import * as db from "../db";
import { getPendingFortuneBookings, updateFortuneBookingStatus, getUserById } from "../db-fortune-helpers";
import { generatePDFReport } from "../pdfGenerator";
import { storagePut } from "../storage";

export type ServiceType = "face" | "palm" | "fengshui";

export interface ProcessReportInput {
  bookingId: number;
  serviceType: ServiceType;
  imageUrls: string[];
  questionDescription?: string;
  userName?: string;
  userLanguage?: string;
}

/**
 * 处理报告生成流程
 */
export async function processFortuneReport(input: ProcessReportInput) {
  const { bookingId, serviceType, imageUrls, questionDescription, userName, userLanguage = 'zh' } = input;

  try {
    // 1. 更新booking状态为"分析中"
    await updateFortuneBookingStatus(bookingId, "in_progress");

    // 2. 根据服务类型调用对应的分析引擎
    let analysis: any;
    let reportMarkdown: string;

    switch (serviceType) {
      case "face":
        analysis = await analyzeFaceReading(imageUrls, questionDescription);
        reportMarkdown = generateFaceReadingReport(analysis, userName);
        break;
      case "palm":
        analysis = await analyzePalmReading(imageUrls, questionDescription);
        reportMarkdown = generatePalmReadingReport(analysis, userName);
        break;
      case "fengshui":
        analysis = await analyzeFengshui(imageUrls, questionDescription);
        reportMarkdown = generateFengshuiReport(analysis, userName);
        break;
      default:
        throw new Error(`Unknown service type: ${serviceType}`);
    }

    // 3. 如果用户语言不是中文,翻译报告
    if (userLanguage !== 'zh') {
      reportMarkdown = await translateReport(reportMarkdown, userLanguage);
    }

    // 4. 生成PDF报告
    const reportId = `REPORT-${bookingId}-${Date.now()}`;
    const pdfBuffer = await generatePDFReport({
      serviceType,
      reportContent: reportMarkdown,
      userName: userName || '尊贵的客户',
      reportDate: new Date(),
      reportId,
    });

    // 5. 上传PDF到S3
    const fileKey = `fortune-reports/${bookingId}/${reportId}.pdf`;
    const { url: pdfUrl } = await storagePut(fileKey, pdfBuffer, 'application/pdf');

    // 6. 保存报告到数据库
    // TODO: 实现createFortuneReport函数或使用现有的报告存储机制

    // 7. 更新booking状态为"已完成"
    await updateFortuneBookingStatus(bookingId, "completed");

    // 8. 发送通知给用户(可选)
    // TODO: 实现邮件或站内通知

    return {
      success: true,
      reportId,
      reportContent: reportMarkdown,
      pdfUrl,
    };

  } catch (error) {
    console.error("Report processing error:", error);
    
    // 更新booking状态为"取消"
    await updateFortuneBookingStatus(bookingId, "cancelled");

    throw error;
  }
}

/**
 * 翻译报告到目标语言
 */
async function translateReport(reportMarkdown: string, targetLanguage: string): Promise<string> {
  try {
    const { invokeLLM } = await import("../_core/llm");

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `你是一位专业的翻译专家,精通中文和${getLanguageName(targetLanguage)}。请将以下命理分析报告翻译成${getLanguageName(targetLanguage)},保持专业性和文化敏感性。

**翻译要求:**
1. 保持Markdown格式不变
2. 准确传达原文含义
3. 使用目标语言的文化习惯表达
4. 保持专业术语的准确性
5. 保持报告的温和、积极、鼓励性语气`
        },
        {
          role: "user",
          content: reportMarkdown
        }
      ]
    });

    const content = response.choices[0].message.content;
    if (typeof content === 'string') {
      return content;
    }
    return reportMarkdown;

  } catch (error) {
    console.error("Translation error:", error);
    // 翻译失败时返回原文
    return reportMarkdown;
  }
}

/**
 * 获取语言名称
 */
function getLanguageName(languageCode: string): string {
  const languageNames: Record<string, string> = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    es: "Español",
    pt: "Português",
    it: "Italiano",
    ru: "Русский",
    ja: "日本語",
    ko: "한국어",
    ar: "العربية",
    hi: "हिन्दी",
    th: "ไทย",
    vi: "Tiếng Việt",
    id: "Bahasa Indonesia",
    zh: "中文",
  };
  return languageNames[languageCode] || languageCode;
}

/**
 * 批量处理待分析的报告
 */
export async function processPendingReports() {
  try {
    // 获取所有待分析的booking
    const pendingBookings = await getPendingFortuneBookings();

    console.log(`Found ${pendingBookings.length} pending fortune bookings`);

    for (const booking of pendingBookings) {
      try {
        // 获取用户信息
        const user = await getUserById(booking.userId);
        
        await processFortuneReport({
          bookingId: booking.id,
          serviceType: booking.serviceType as ServiceType,
          imageUrls: booking.imageUrls as string[],
          questionDescription: booking.questionDescription || undefined,
          userName: user?.name || undefined,
          userLanguage: 'zh', // 默认中文,后续可以从用户设置中获取
        });

        console.log(`Successfully processed booking ${booking.id}`);
      } catch (error) {
        console.error(`Failed to process booking ${booking.id}:`, error);
      }
    }

  } catch (error) {
    console.error("Error processing pending reports:", error);
  }
}
