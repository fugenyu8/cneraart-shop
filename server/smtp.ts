import nodemailer from "nodemailer";

/**
 * SMTP邮件发送配置
 * 使用网易企业邮箱发送真实邮件
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

// 创建SMTP传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtphz.qiye.163.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: parseInt(process.env.SMTP_PORT || "465") === 465, // 465端口使用SSL，587使用STARTTLS
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  // 添加调试选项
  debug: true,
  logger: true,
});

/**
 * 发送邮件
 * @param options 邮件选项
 * @returns 是否发送成功
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: options.from || `"源·华渡" <${process.env.SMTP_USER}>`,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("[SMTP] Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("[SMTP] Failed to send email:", error);
    return false;
  }
}

/**
 * 验证SMTP连接
 * 用于测试SMTP配置是否正确
 */
export async function verifySmtpConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("[SMTP] Connection verified successfully");
    return true;
  } catch (error) {
    console.error("[SMTP] Connection verification failed:", error);
    return false;
  }
}
