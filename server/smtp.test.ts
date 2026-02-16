import { describe, it, expect } from "vitest";
import { verifySmtpConnection, sendEmail } from "./smtp";

describe("SMTP Email Service", () => {
  it("should verify SMTP connection successfully", async () => {
    const result = await verifySmtpConnection();
    expect(result).toBe(true);
  }, 15000); // 15秒超时,因为SMTP连接可能较慢

  it("should send test email successfully", async () => {
    const result = await sendEmail({
      to: process.env.SMTP_USER || "test@example.com",
      subject: "SMTP Test - 源·华渡",
      html: `
        <h1>SMTP配置测试</h1>
        <p>这是一封测试邮件,用于验证SMTP配置是否正确。</p>
        <p>如果您收到这封邮件,说明SMTP配置成功!</p>
        <p>发送时间: ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</p>
      `,
    });
    
    expect(result).toBe(true);
  }, 15000);
});
