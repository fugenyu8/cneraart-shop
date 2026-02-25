import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using configured SMTP server
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"${process.env.OWNER_NAME}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send fortune report completion email
 */
export async function sendReportCompletionEmail(
  userEmail: string,
  userName: string,
  serviceType: 'face' | 'palm' | 'fengshui',
  bookingId: number,
  reportUrl: string
): Promise<boolean> {
  const serviceNames = {
    face: 'Face Reading Analysis',
    palm: 'Palm Reading Analysis',
    fengshui: 'Feng Shui Analysis',
  };

  const serviceName = serviceNames[serviceType];

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${serviceName} Report is Ready</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #8B4513;
      margin-bottom: 10px;
    }
    h1 {
      color: #8B4513;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #8B4513;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #6B3410;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .highlight {
      background-color: #fff9e6;
      padding: 15px;
      border-left: 4px solid #8B4513;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">源・华渡 - 东方文化商城</div>
      <p style="color: #666; margin: 0;">Wutai Mountain Cultural Heritage</p>
    </div>

    <h1>Your ${serviceName} Report is Ready!</h1>

    <div class="content">
      <p>Dear ${userName},</p>

      <p>We are pleased to inform you that your ${serviceName} report has been completed by our cultural practitioners.</p>

      <div class="highlight">
        <p style="margin: 0;"><strong>Your personalized report includes:</strong></p>
        <ul style="margin: 10px 0 0 0;">
          <li>Detailed analysis based on traditional wisdom</li>
          <li>Personalized insights and recommendations</li>
          <li>Guidance for your cultural journey</li>
        </ul>
      </div>

      <p>Click the button below to view your complete report:</p>

      <div style="text-align: center;">
        <a href="${reportUrl}" class="button">View My Report</a>
      </div>

      <p>Your report will remain accessible in your account. You can download it as a PDF for your records.</p>

      <p>If you have any questions about your report, please don't hesitate to contact us.</p>
    </div>

    <div class="footer">
      <p><strong>五台山善途团队</strong></p>
      <p>Wutai Mountain Shantu Team</p>
      <p style="margin-top: 10px; font-size: 12px;">
        This email was sent to ${userEmail}. If you did not request this service, please disregard this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Your ${serviceName} Report is Ready!

Dear ${userName},

We are pleased to inform you that your ${serviceName} report has been completed by our cultural practitioners.

View your report here: ${reportUrl}

Your report includes:
- Detailed analysis based on traditional wisdom
- Personalized insights and recommendations
- Guidance for your cultural journey

If you have any questions, please contact us.

五台山善途团队
Wutai Mountain Shantu Team
  `;

  return sendEmail({
    to: userEmail,
    subject: `Your ${serviceName} Report is Ready`,
    html,
    text,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(
  userEmail: string,
  userName: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string
): Promise<boolean> {
  const statusMessages = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
  };

  const message = statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated';

  let trackingInfo = '';
  if (trackingNumber) {
    trackingInfo = `
      <div class="highlight">
        <p style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">You can track your shipment using this number.</p>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #8B4513;
      margin-bottom: 10px;
    }
    h1 {
      color: #8B4513;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #8B4513;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .highlight {
      background-color: #fff9e6;
      padding: 15px;
      border-left: 4px solid #8B4513;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">源・华渡 - 东方文化商城</div>
      <p style="color: #666; margin: 0;">Wutai Mountain Cultural Heritage</p>
    </div>

    <h1>Order Status Update</h1>

    <div class="content">
      <p>Dear ${userName},</p>

      <p>${message}.</p>

      <div class="highlight">
        <p style="margin: 0;"><strong>Order Number:</strong> ${orderNumber}</p>
        <p style="margin: 10px 0 0 0;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
      </div>

      ${trackingInfo}

      <p>You can view your order details and track its progress in your account.</p>

      <div style="text-align: center;">
        <a href="${process.env.VITE_FRONTEND_FORGE_API_URL}/account" class="button">View My Orders</a>
      </div>

      <p>Thank you for your trust in our services.</p>
    </div>

    <div class="footer">
      <p><strong>五台山善途团队</strong></p>
      <p>Wutai Mountain Shantu Team</p>
      <p style="margin-top: 10px; font-size: 12px;">
        This email was sent to ${userEmail}.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Order Status Update

Dear ${userName},

${message}.

Order Number: ${orderNumber}
Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
${trackingNumber ? `Tracking Number: ${trackingNumber}` : ''}

You can view your order details in your account.

Thank you for your trust in our services.

五台山善途团队
Wutai Mountain Shantu Team
  `;

  return sendEmail({
    to: userEmail,
    subject: `Order ${orderNumber} - Status Update`,
    html,
    text,
  });
}
