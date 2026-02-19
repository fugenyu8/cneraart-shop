import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PDFReportOptions {
  serviceType: 'face' | 'palm' | 'fengshui';
  reportContent: string; // Markdown格式的报告内容
  userName: string;
  reportDate: Date;
  reportId: string;
}

interface ReportSection {
  title: string;
  content: string;
  score?: number;
}

/**
 * 解析Markdown格式的报告内容
 */
function parseMarkdownReport(markdown: string): ReportSection[] {
  const sections: ReportSection[] = [];
  const lines = markdown.split('\n');
  let currentSection: ReportSection | null = null;

  for (const line of lines) {
    // 匹配标题 (## 标题)
    const titleMatch = line.match(/^##\s+(.+)$/);
    if (titleMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: titleMatch[1],
        content: ''
      };
      continue;
    }

    // 匹配评分 (**评分:** 85/100)
    const scoreMatch = line.match(/\*\*评分:\*\*\s+(\d+)\/100/);
    if (scoreMatch && currentSection) {
      currentSection.score = parseInt(scoreMatch[1]);
      continue;
    }

    // 累积内容
    if (currentSection && line.trim()) {
      currentSection.content += line.trim() + '\n';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * 获取服务类型的配色方案
 */
function getColorScheme(serviceType: 'face' | 'palm' | 'fengshui') {
  const schemes = {
    face: {
      primary: '#D4AF37',    // 金黄色
      secondary: '#8B0000',  // 深红色
      background: '#FAF9F6', // 米白色
      text: '#333333'        // 深灰色
    },
    palm: {
      primary: '#D4AF37',    // 金黄色
      secondary: '#00008B',  // 深蓝色
      background: '#FAF9F6', // 米白色
      text: '#333333'        // 深灰色
    },
    fengshui: {
      primary: '#D4AF37',    // 金黄色
      secondary: '#006400',  // 深绿色
      background: '#FAF9F6', // 米白色
      text: '#333333'        // 深灰色
    }
  };
  return schemes[serviceType];
}

/**
 * 获取服务类型的中文名称
 */
function getServiceName(serviceType: 'face' | 'palm' | 'fengshui'): string {
  const names = {
    face: '面相分析报告',
    palm: '手相分析报告',
    fengshui: '家居风水分析报告'
  };
  return names[serviceType];
}

/**
 * 获取服务类型的英文名称
 */
function getServiceNameEn(serviceType: 'face' | 'palm' | 'fengshui'): string {
  const names = {
    face: 'Face Reading Analysis Report',
    palm: 'Palm Reading Analysis Report',
    fengshui: 'Feng Shui Analysis Report'
  };
  return names[serviceType];
}

/**
 * 生成PDF报告
 */
export async function generatePDFReport(options: PDFReportOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // 注册中文字体
      const fontPath = path.join(__dirname, 'fonts');
      doc.registerFont('SourceHanSans', path.join(fontPath, 'SourceHanSansSC-Regular.otf'));
      doc.registerFont('SourceHanSerif', path.join(fontPath, 'SourceHanSerifSC-Regular.otf'));

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      const colors = getColorScheme(options.serviceType);
      const serviceName = getServiceName(options.serviceType);
      const serviceNameEn = getServiceNameEn(options.serviceType);
      const sections = parseMarkdownReport(options.reportContent);

      // ==================== 封面页 ====================
      doc.fillColor(colors.secondary);
      doc.rect(0, 0, doc.page.width, doc.page.height).fill();

      // 标题
      doc.fillColor(colors.primary);
      doc.fontSize(36);
      doc.font('SourceHanSerif');
      doc.text(serviceName, 50, 250, {
        align: 'center',
        width: doc.page.width - 100
      });

      doc.fontSize(20);
      doc.font('SourceHanSans');
      doc.text(serviceNameEn, 50, 310, {
        align: 'center',
        width: doc.page.width - 100
      });

      // 副标题
      doc.fillColor('#FFFFFF');
      doc.fontSize(14);
      doc.font('SourceHanSans');
      doc.text('五台山善途团队 · 传承千年智慧', 50, 380, {
        align: 'center',
        width: doc.page.width - 100
      });

      // 报告信息
      doc.fontSize(12);
      doc.font('SourceHanSans');
      doc.text(`报告编号: ${options.reportId}`, 50, 500, {
        align: 'center',
        width: doc.page.width - 100
      });
      doc.text(`生成日期: ${options.reportDate.toLocaleDateString('zh-CN')}`, 50, 520, {
        align: 'center',
        width: doc.page.width - 100
      });

      // ==================== 内容页 ====================
      doc.addPage();
      doc.fillColor(colors.background);
      doc.rect(0, 0, doc.page.width, doc.page.height).fill();

      let yPosition = 80;

      // 遍历所有章节
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        // 检查是否需要新页面
        if (yPosition > doc.page.height - 200) {
          doc.addPage();
          doc.fillColor(colors.background);
          doc.rect(0, 0, doc.page.width, doc.page.height).fill();
          yPosition = 80;
        }

        // 章节标题
        doc.fillColor(colors.primary);
        doc.fontSize(18);
        doc.font('SourceHanSerif');
        doc.text(section.title, 70, yPosition);
        yPosition += 30;

        // 金色装饰线
        doc.strokeColor(colors.primary);
        doc.lineWidth(2);
        doc.moveTo(70, yPosition);
        doc.lineTo(doc.page.width - 70, yPosition);
        doc.stroke();
        yPosition += 20;

        // 评分条(如果有)
        if (section.score !== undefined) {
          doc.fillColor(colors.text);
          doc.fontSize(12);
          doc.font('SourceHanSans');
          doc.text(`评分: ${section.score}/100`, 70, yPosition);
          yPosition += 5;

          // 进度条背景
          doc.fillColor('#E0E0E0');
          doc.rect(70, yPosition, 300, 10).fill();

          // 进度条填充
          const barWidth = (section.score / 100) * 300;
          doc.fillColor(colors.primary);
          doc.rect(70, yPosition, barWidth, 10).fill();
          yPosition += 25;
        }

        // 章节内容
        doc.fillColor(colors.text);
        doc.fontSize(11);
        doc.font('SourceHanSans');
        
        const contentLines = section.content.split('\n').filter(line => line.trim());
        for (const line of contentLines) {
          // 检查是否需要新页面
          if (yPosition > doc.page.height - 100) {
            doc.addPage();
            doc.fillColor(colors.background);
            doc.rect(0, 0, doc.page.width, doc.page.height).fill();
            yPosition = 80;
          }

          // 处理加粗文本 (**文本**)
          const boldMatch = line.match(/\*\*(.+?)\*\*/);
          if (boldMatch) {
            const parts = line.split(/\*\*(.+?)\*\*/);
            let xPosition = 70;
            for (let j = 0; j < parts.length; j++) {
              if (j % 2 === 0) {
                doc.font('SourceHanSans');
              } else {
                doc.font('SourceHanSerif');
              }
              doc.text(parts[j], xPosition, yPosition, {
                continued: j < parts.length - 1,
                width: doc.page.width - 140
              });
            }
            yPosition += 20;
          } else {
            doc.font('SourceHanSans');
            doc.text(line, 70, yPosition, {
              width: doc.page.width - 140,
              align: 'left'
            });
            yPosition += 20;
          }
        }

        yPosition += 10; // 章节间距
      }

      // ==================== 结尾页 ====================
      doc.addPage();
      doc.fillColor(colors.background);
      doc.rect(0, 0, doc.page.width, doc.page.height).fill();

      // 回向祝福
      doc.fillColor(colors.primary);
      doc.fontSize(20);
      doc.font('SourceHanSerif');
      doc.text('回向祝福', 50, 150, {
        align: 'center',
        width: doc.page.width - 100
      });

      doc.fillColor(colors.text);
      doc.fontSize(12);
      doc.font('SourceHanSans');
      doc.text('愿以此功德,庄严佛净土。上报四重恩,下济三途苦。', 50, 200, {
        align: 'center',
        width: doc.page.width - 100,
        lineGap: 8
      });
      doc.text('若有见闻者,悉发菩提心。尽此一报身,同生极乐国。', 50, 250, {
        align: 'center',
        width: doc.page.width - 100,
        lineGap: 8
      });

      // 法律声明
      doc.fontSize(10);
      doc.fillColor('#666666');
      doc.font('SourceHanSerif');
      doc.text('法律声明', 50, 350, {
        align: 'center',
        width: doc.page.width - 100
      });
      doc.fontSize(9);
      doc.text(
        '本报告内容仅供参考,不构成任何法律、医疗、投资或其他专业建议。' +
        '报告基于传统相学和风水理论进行分析,结果因人而异。' +
        '我们不对报告内容的准确性、完整性或适用性作出任何明示或暗示的保证。' +
        '使用本报告所产生的任何后果,由使用者自行承担。',
        50,
        380,
        {
          align: 'center',
          width: doc.page.width - 100,
          lineGap: 5
        }
      );

      // 联系方式
      doc.fontSize(10);
      doc.fillColor(colors.text);
      doc.font('SourceHanSans');
      doc.text('五台山善途团队', 50, 480, {
        align: 'center',
        width: doc.page.width - 100
      });
      doc.text('www.cneraart.com', 50, 500, {
        align: 'center',
        width: doc.page.width - 100
      });

      // 完成PDF生成
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
