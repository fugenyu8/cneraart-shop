/**
 * 邮件发送服务
 * 使用SMTP发送报告通知邮件
 */

import nodemailer from 'nodemailer';
import { ENV } from './_core/env';

export interface SendReportEmailOptions {
  to: string;
  userName: string;
  serviceType: 'face' | 'palm' | 'fengshui';
  reportId: string;
  pdfUrl: string;
  reportDate: Date;
}

/**
 * 获取服务类型的中文名称
 */
function getServiceName(serviceType: 'face' | 'palm' | 'fengshui'): string {
  const names = {
    face: '面相分析',
    palm: '手相分析',
    fengshui: '家居风水分析'
  };
  return names[serviceType];
}

/**
 * 生成报告邮件HTML模板
 */
function generateReportEmailHTML(options: SendReportEmailOptions): string {
  const serviceName = getServiceName(options.serviceType);
  const dateStr = options.reportDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>您的${serviceName}报告已生成</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Microsoft YaHei', 'Noto Sans SC', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- 头部 -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">源・华渡</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">东方灵性智慧 · 五台山开光法物</p>
            </td>
          </tr>

          <!-- 主体内容 -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #8B0000; font-size: 22px;">尊敬的${options.userName}，您好！</h2>
              
              <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                感谢您选择源・华渡的${serviceName}服务。您的专属报告已由五台山大师完成推演，现已生成完毕。
              </p>

              <div style="background-color: #FFF9E6; border-left: 4px solid #D4AF37; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                  <strong style="color: #8B0000;">报告编号：</strong>${options.reportId}
                </p>
                <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                  <strong style="color: #8B0000;">服务类型：</strong>${serviceName}
                </p>
                <p style="margin: 0; color: #666666; font-size: 14px;">
                  <strong style="color: #8B0000;">生成日期：</strong>${dateStr}
                </p>
              </div>

              <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                本报告包含：
              </p>
              <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                <li>深度${serviceName}解读</li>
                <li>数据可视化图表分析</li>
                <li>专业改运建议</li>
                <li>五台山开光法物推荐</li>
              </ul>

              <!-- 下载按钮 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${options.pdfUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #8B0000 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 25px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
                      📥 下载完整报告
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 25px 0 15px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                报告链接有效期为30天，请及时下载保存。如有任何疑问，欢迎随时联系我们。
              </p>

              <!-- 分隔线 -->
              <div style="border-top: 1px solid #e0e0e0; margin: 30px 0;"></div>

              <!-- 产品推荐区 -->
              <div style="text-align: center;">
                <h3 style="margin: 0 0 15px 0; color: #8B0000; font-size: 18px;">✨ 五台山开光法物</h3>
                <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px;">
                  根据您的报告，我们为您精选了相关的开光法物<br/>
                  助您增强运势，趋吉避凶
                </p>
                <a href="${ENV.viteAppLogo || 'https://www.cneraart.com'}/products" style="display: inline-block; color: #D4AF37; text-decoration: none; font-size: 14px; border: 1px solid #D4AF37; padding: 10px 25px; border-radius: 20px;">
                  查看推荐法物 →
                </a>
              </div>
            </td>
          </tr>

          <!-- 页脚 -->
          <tr>
            <td style="background-color: #2C1810; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #D4AF37; font-size: 16px; font-weight: bold;">源・华渡 · 五台山善途团队</p>
              <p style="margin: 0 0 15px 0; color: #999999; font-size: 13px;">传承东方智慧 · 守护心灵安宁</p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                © 2026 源・华渡 All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * 发送报告通知邮件
 */
export async function sendReportEmail(options: SendReportEmailOptions): Promise<boolean> {
  try {
    // 检查SMTP配置
    if (!ENV.smtpHost || !ENV.smtpPort || !ENV.smtpUser || !ENV.smtpPass) {
      console.error('SMTP配置不完整,无法发送邮件');
      return false;
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465, // 465端口使用SSL
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpPass
      }
    });

    const serviceName = getServiceName(options.serviceType);

    // 发送邮件
    const info = await transporter.sendMail({
      from: `"源・华渡" <${ENV.smtpUser}>`,
      to: options.to,
      subject: `您的${serviceName}报告已生成 - 源・华渡`,
      html: generateReportEmailHTML(options)
    });

    console.log('邮件发送成功:', info.messageId);
    return true;

  } catch (error) {
    console.error('邮件发送失败:', error);
    return false;
  }
}

/**
 * 发送测试邮件
 */
export async function sendTestEmail(to: string): Promise<boolean> {
  try {
    if (!ENV.smtpHost || !ENV.smtpPort || !ENV.smtpUser || !ENV.smtpPass) {
      console.error('SMTP配置不完整');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465,
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpPass
      }
    });

    await transporter.sendMail({
      from: `"源・华渡" <${ENV.smtpUser}>`,
      to,
      subject: '测试邮件 - 源・华渡',
      html: '<h1>这是一封测试邮件</h1><p>如果您收到此邮件,说明SMTP配置正确。</p>'
    });

    return true;
  } catch (error) {
    console.error('测试邮件发送失败:', error);
    return false;
  }
}
