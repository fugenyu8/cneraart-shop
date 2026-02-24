/**
 * 报告处理系统
 * 统一处理命理服务报告的生成、存储和交付
 * 完全本地运行，不依赖任何外部API
 */

import { analyzeFaceReading, generateFaceReadingReport } from "./faceReading";
import { analyzePalmReading, generatePalmReadingReport } from "./palmReading";
import { analyzeFengshui, generateFengshuiReport } from "./fengshui";
import * as db from "../db";
import { getPendingFortuneBookings, updateFortuneBookingStatus, getUserById, createFortuneReport } from "../db-fortune-helpers";
import { generatePDFReport } from "../pdfGenerator";
import { storagePut } from "../storage";
import { getRecommendedProducts } from "../productRecommendation";
import {
  generateRadarChart,
  generateBarChart,
  generateBaguaChart,
  extractFaceScores,
  extractPalmScores,
  extractFengshuiScores
} from "../chartGenerator";
import { sendReportEmail } from "../emailService";

export type ServiceType = "face" | "palm" | "fengshui";

export interface ProcessReportInput {
  bookingId: number;
  serviceType: ServiceType;
  imageUrls: string[];
  questionDescription?: string;
  userName?: string;
  userLanguage?: string;
  userEmail?: string;
  userId?: number;
}

/**
 * 处理报告生成流程
 */
export async function processFortuneReport(input: ProcessReportInput) {
  const { bookingId, serviceType, imageUrls, questionDescription, userName, userLanguage = 'zh', userEmail, userId } = input;

  try {
    // 1. 更新booking状态为"分析中"
    await updateFortuneBookingStatus(bookingId, "in_progress");

    // 2. 根据服务类型调用对应的本地分析引擎
    console.log(`[ReportProcessor] Starting ${serviceType} analysis for booking ${bookingId}`);
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

    console.log(`[ReportProcessor] Analysis complete, score: ${analysis.score}`);

    // 3. 如果用户语言不是中文，使用本地翻译
    if (userLanguage !== 'zh') {
      reportMarkdown = translateReportLocal(reportMarkdown, userLanguage);
    }

    // 4. 获取推荐产品
    const recommendedProducts = await getRecommendedProducts(serviceType, 3);

    // 5. 生成数据可视化图表
    let chartBuffer: Buffer | undefined;
    try {
      switch (serviceType) {
        case "face": {
          const { labels, values } = extractFaceScores(reportMarkdown);
          chartBuffer = await generateRadarChart({
            labels,
            values,
            title: '面相十二宫位分析'
          });
          break;
        }
        case "palm": {
          const { labels, values } = extractPalmScores(reportMarkdown);
          chartBuffer = await generateBarChart({
            labels,
            values,
            title: '手相三大主线评分'
          });
          break;
        }
        case "fengshui": {
          const { directions, scores } = extractFengshuiScores(reportMarkdown);
          chartBuffer = await generateBaguaChart({
            directions,
            scores,
            title: '风水八卦方位分析'
          });
          break;
        }
      }
    } catch (error) {
      console.error('[ReportProcessor] 图表生成失败:', error);
    }

    // 6. 生成PDF报告
    const reportId = `REPORT-${bookingId}-${Date.now()}`;
    const pdfBuffer = await generatePDFReport({
      serviceType,
      reportContent: reportMarkdown,
      userName: userName || '尊贵的客户',
      reportDate: new Date(),
      reportId,
      recommendedProducts,
      chartBuffer,
    });

    // 7. 上传PDF到S3
    const fileKey = `fortune-reports/${bookingId}/${reportId}.pdf`;
    const { url: pdfUrl } = await storagePut(fileKey, pdfBuffer, 'application/pdf');

    // 8. 保存报告到数据库
    if (userId) {
      try {
        await createFortuneReport({
          taskId: reportId,
          userId,
          serviceType,
          overallSummary: analysis.overallSummary || '',
          sectionsJson: analysis.sections || [],
          score: analysis.score || 0,
        });
        console.log(`[ReportProcessor] Report saved to database: ${reportId}`);
      } catch (dbError) {
        console.error('[ReportProcessor] Failed to save report to database:', dbError);
      }
    }

    // 9. 更新booking状态为"已完成"
    await updateFortuneBookingStatus(bookingId, "completed");

    // 10. 发送邮件通知给用户
    if (userEmail) {
      try {
        await sendReportEmail({
          to: userEmail,
          userName: userName || '尊贵的客户',
          serviceType,
          reportId,
          pdfUrl,
          reportDate: new Date()
        });
        console.log(`[ReportProcessor] 报告邮件已发送至: ${userEmail}`);
      } catch (error) {
        console.error('[ReportProcessor] 邮件发送失败:', error);
      }
    }

    return {
      success: true,
      reportId,
      reportContent: reportMarkdown,
      pdfUrl,
    };

  } catch (error) {
    console.error("[ReportProcessor] Report processing error:", error);
    
    // 更新booking状态为"取消"
    await updateFortuneBookingStatus(bookingId, "cancelled");

    throw error;
  }
}

/**
 * 本地报告翻译 - 替换关键术语和标题
 * 不依赖外部API，使用预定义的翻译词典
 */
function translateReportLocal(reportMarkdown: string, targetLanguage: string): string {
  const translations = REPORT_TRANSLATIONS[targetLanguage];
  if (!translations) {
    // 不支持的语言，返回原文
    return reportMarkdown;
  }

  let translated = reportMarkdown;
  for (const [zhText, localText] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(escapeRegex(zhText), 'g'), localText);
  }

  return translated;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 报告翻译词典 - 覆盖报告中的关键术语和标题
 */
const REPORT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // 通用标题
    "面相分析报告": "Face Reading Analysis Report",
    "手相分析报告": "Palm Reading Analysis Report",
    "风水分析报告": "Feng Shui Analysis Report",
    "报告生成时间:": "Report Date:",
    "尊敬的缘主": "Dear Valued Client",
    "尊敬的": "Dear ",
    "综合评分": "Overall Score",
    "整体运势评分:": "Overall Fortune Score:",
    "整体风水评分:": "Overall Feng Shui Score:",
    "详细分析": "Detailed Analysis",
    "人生建议": "Life Guidance",
    "优化建议": "Optimization Suggestions",
    "回向祝福": "Blessings & Dedication",
    "法律声明": "Legal Disclaimer",
    "评分:": "Score:",
    // 面相术语
    "命宫分析": "Life Palace Analysis",
    "财帛宫分析": "Wealth Palace Analysis",
    "官禄宫分析": "Career Palace Analysis",
    "妻妾宫分析": "Marriage Palace Analysis",
    "疾厄宫分析": "Health Palace Analysis",
    "兄弟宫分析": "Siblings Palace Analysis",
    "子女宫分析": "Children Palace Analysis",
    "田宅宫分析": "Property Palace Analysis",
    "迁移宫分析": "Travel Palace Analysis",
    "奴仆宫分析": "Social Palace Analysis",
    "父母宫分析": "Parents Palace Analysis",
    "福德宫分析": "Fortune Palace Analysis",
    "面型:": "Face Type:",
    // 手相术语
    "手型分类": "Hand Type Classification",
    "手型:": "Hand Type:",
    "特征:": "Characteristics:",
    "性格:": "Personality:",
    "手型分析": "Hand Type Analysis",
    "生命线分析": "Life Line Analysis",
    "智慧线分析": "Head Line Analysis",
    "感情线分析": "Heart Line Analysis",
    "事业线分析": "Fate Line Analysis",
    "性格与天赋": "Personality & Talents",
    // 风水术语
    "五行平衡分析": "Five Elements Balance Analysis",
    "风水问题识别": "Feng Shui Issues Identified",
    "问题描述:": "Issue Description:",
    "严重程度:": "Severity:",
    "化解方法:": "Solution:",
    "优先级:": "Priority:",
    "高": "High",
    "中": "Medium",
    "低": "Low",
    "平衡": "Balanced",
    "需调整": "Needs Adjustment",
    "失衡": "Imbalanced",
    // 建议类别
    "事业": "Career",
    "财运": "Wealth",
    "感情": "Relationships",
    "健康": "Health",
    "事业发展": "Career Development",
    "财富理财": "Wealth Management",
    "感情婚姻": "Love & Marriage",
    "健康养生": "Health & Wellness",
    "特别关注": "Special Focus",
    // 流年运势
    "年流年运势": " Annual Fortune",
    "关键时间节点:": "Key Time Points:",
    // 祝福语
    "事业顺遂,步步高升": "May your career flourish and rise to new heights",
    "财源广进,富贵安康": "May wealth flow abundantly and bring prosperity",
    "感情美满,家庭和睦": "May love be fulfilling and family harmonious",
    "身体健康,福寿绵长": "May health and longevity be with you always",
    "家宅平安,风生水起": "May your home be peaceful and fortune arise",
    "家庭和睦,幸福美满": "May your family be harmonious and blessed",
    // 团队信息
    "五台山善途团队": "Wutai Mountain Shantu Team",
    "传承千年智慧,照亮人生之路": "Inheriting ancient wisdom, illuminating life's path",
    // 法律声明
    "本报告内容仅供参考,不构成任何法律、医疗或投资建议。": "This report is for reference only and does not constitute legal, medical, or investment advice.",
    "面相学是传统文化的一部分,应理性看待。": "Face reading is part of traditional culture and should be viewed rationally.",
    "手相学是传统文化的一部分,应理性看待。": "Palm reading is part of traditional culture and should be viewed rationally.",
    "风水学是传统文化的一部分,应理性看待。": "Feng Shui is part of traditional culture and should be viewed rationally.",
    "人生运势受多种因素影响,个人努力和选择才是决定命运的关键。": "Life fortune is influenced by many factors; personal effort and choices are the key to shaping destiny.",
    "居住环境的改善应结合实际情况和科学原理,避免盲目迷信。": "Home improvements should combine practical considerations with scientific principles.",
    // 服务介绍
    "感恩您选择五台山善途团队的面相分析服务。": "Thank you for choosing the Wutai Mountain Shantu Team's face reading service.",
    "感恩您选择五台山善途团队的手相分析服务。": "Thank you for choosing the Wutai Mountain Shantu Team's palm reading service.",
    "感恩您选择五台山善途团队的风水分析服务。": "Thank you for choosing the Wutai Mountain Shantu Team's Feng Shui analysis service.",
  },
  ja: {
    "面相分析报告": "人相分析レポート",
    "手相分析报告": "手相分析レポート",
    "风水分析报告": "風水分析レポート",
    "报告生成时间:": "レポート作成日:",
    "尊敬的缘主": "お客様",
    "尊敬的": "",
    "综合评分": "総合スコア",
    "详细分析": "詳細分析",
    "人生建议": "人生のアドバイス",
    "回向祝福": "祝福",
    "法律声明": "免責事項",
    "五台山善途团队": "五台山善途チーム",
    "传承千年智慧,照亮人生之路": "千年の知恵を受け継ぎ、人生の道を照らす",
  },
  ko: {
    "面相分析报告": "관상 분석 보고서",
    "手相分析报告": "수상 분석 보고서",
    "风水分析报告": "풍수 분석 보고서",
    "报告生成时间:": "보고서 생성일:",
    "尊敬的缘主": "존경하는 고객님",
    "综合评分": "종합 점수",
    "详细分析": "상세 분석",
    "人生建议": "인생 조언",
    "回向祝福": "축복",
    "法律声明": "면책 조항",
    "五台山善途团队": "오대산 선도 팀",
  },
};

/**
 * 批量处理待分析的报告
 */
export async function processPendingReports() {
  try {
    const pendingBookings = await getPendingFortuneBookings();
    console.log(`[ReportProcessor] Found ${pendingBookings.length} pending fortune bookings`);

    for (const booking of pendingBookings) {
      try {
        const user = await getUserById(booking.userId);
        
        await processFortuneReport({
          bookingId: booking.id,
          serviceType: booking.serviceType as ServiceType,
          imageUrls: booking.imageUrls as string[],
          questionDescription: booking.questionDescription || undefined,
          userName: user?.name || undefined,
          userLanguage: 'zh',
          userId: booking.userId,
        });

        console.log(`[ReportProcessor] Successfully processed booking ${booking.id}`);
      } catch (error) {
        console.error(`[ReportProcessor] Failed to process booking ${booking.id}:`, error);
      }
    }

  } catch (error) {
    console.error("[ReportProcessor] Error processing pending reports:", error);
  }
}
