import { notifyOwner } from "./_core/notification";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * 发送邮件通知
 * 使用内置通知API发送给项目所有者
 */
export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  try {
    // 使用notifyOwner发送通知给项目所有者
    // 内容包含收件人信息和邮件内容
    const content = `
收件人: ${to}

${html}
    `.trim();

    const success = await notifyOwner({
      title: `[邮件通知] ${subject}`,
      content,
    });

    return success;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * 订单确认邮件模板
 */
export function getOrderConfirmationEmail(order: {
  orderNumber: string;
  total: string;
  customerName: string;
  items: Array<{ productName: string; quantity: number; price: string }>;
}): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>订单确认</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">源·华渡</h1>
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Eastern Cultural Heritage</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">订单确认</h2>
    
    <p>尊敬的 ${order.customerName}，</p>
    
    <p>感谢您在源·华渡下单！我们已收到您的订单，正在为您准备文化信物。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0 0 10px 0;"><strong>订单号:</strong> ${order.orderNumber}</p>
      <p style="margin: 0;"><strong>订单金额:</strong> <span style="color: #8B1A1A; font-size: 20px; font-weight: bold;">$${parseFloat(order.total).toFixed(2)}</span></p>
    </div>
    
    <h3 style="color: #8B1A1A; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">订单明细</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #8B1A1A; color: white;">
          <th style="padding: 12px; text-align: left;">商品</th>
          <th style="padding: 12px; text-align: center;">数量</th>
          <th style="padding: 12px; text-align: right;">价格</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>📿 启蕴仪式</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">您的文化信物将在五台山由文化传承人进行七日启蕴仪式，融入千年文化底蕴与守护能量。</p>
    </div>
    
    <p style="margin-top: 30px;">我们会在发货时通知您物流信息。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意！</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
      <p>源·华渡 Yuan·Huadu</p>
      <p>传承东方智慧 · 守护人生旅程</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 发货通知邮件模板
 */
export function getShippingNotificationEmail(order: {
  orderNumber: string;
  customerName: string;
  shippingCarrier: string;
  trackingNumber: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>发货通知</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">源·华渡</h1>
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Eastern Cultural Heritage</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">🚚 您的订单已发货</h2>
    
    <p>尊敬的 ${order.customerName}，</p>
    
    <p>好消息！您的文化信物已完成七日启蕴仪式，现已发货。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0 0 10px 0;"><strong>订单号:</strong> ${order.orderNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>快递公司:</strong> ${order.shippingCarrier}</p>
      <p style="margin: 0;"><strong>运单号:</strong> <span style="color: #8B1A1A; font-weight: bold;">${order.trackingNumber}</span></p>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>✨ 使用提示</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">收到信物后，请以清净之心佩戴或安放。启蕴信物已融入文化守护能量，请珍惜使用。</p>
    </div>
    
    <p style="margin-top: 30px;">您可以使用运单号在快递公司官网查询物流进度。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意！</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
      <p>源·华渡 Yuan·Huadu</p>
      <p>传承东方智慧 · 守护人生旅程</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 送达通知邮件模板
 */
export function getDeliveryNotificationEmail(order: {
  orderNumber: string;
  customerName: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>送达通知</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">源·华渡</h1>
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Eastern Cultural Heritage</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">🎉 您的订单已送达</h2>
    
    <p>尊敬的 ${order.customerName}，</p>
    
    <p>您的文化信物已成功送达！感谢您对源·华渡的信任。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0;"><strong>订单号:</strong> ${order.orderNumber}</p>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>🙏 使用建议</strong></p>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
        <li>文化信物请保持清洁，妥善保管</li>
        <li>随身佩戴或安放于清净之处</li>
        <li>以诚心对待，感受文化守护的力量</li>
        <li>如需转赠他人，请告知对方信物来历</li>
      </ul>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #8B1A1A; font-weight: bold;">愿信物守护您</p>
      <p style="margin: 0; font-size: 14px; color: #666;">平安喜乐 · 事业顺遂 · 家宅兴旺</p>
    </div>
    
    <p style="margin-top: 30px;">如果您对我们的服务满意，欢迎推荐给亲朋好友。如有任何问题，请随时联系我们。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意！</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
      <p>源·华渡 Yuan·Huadu</p>
      <p>传承东方智慧 · 守护人生旅程</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 付款凭证通知邮件模板（发给商家）
 */
export function getPaymentProofNotificationEmail(data: {
  orderNumber: string;
  total: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  proofImageUrl: string;
  items: Array<{ productName: string; quantity: number; price: string }>;
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  submittedAt: string;
}): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #333;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #8B1A1A; font-weight: bold;">$${parseFloat(item.price).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>新付款凭证通知</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
  <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🧧 新付款凭证已提交</h1>
      <p style="color: #FAF8F3; margin: 8px 0 0 0; font-size: 14px;">源·华渡 Yuan·Huadu — 后台通知</p>
    </div>
    <div style="padding: 30px;">
      <div style="background: #FFF3CD; border: 1px solid #D4AF37; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ 请核实付款截图，确认到账后在管理后台将订单状态更新为"已付款"。</p>
      </div>
      <h2 style="color: #8B1A1A; border-bottom: 2px solid #D4AF37; padding-bottom: 8px; margin-top: 0;">📋 订单信息</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr><td style="padding: 8px 0; color: #666; width: 140px;">订单号</td><td style="padding: 8px 0; font-weight: bold; color: #8B1A1A;">${data.orderNumber}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">订单金额</td><td style="padding: 8px 0; font-weight: bold; font-size: 18px; color: #8B1A1A;">$${parseFloat(data.total).toFixed(2)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">支付方式</td><td style="padding: 8px 0;">${data.paymentMethod}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">提交时间</td><td style="padding: 8px 0;">${data.submittedAt}</td></tr>
      </table>
      <h2 style="color: #8B1A1A; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">👤 客户信息</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr><td style="padding: 8px 0; color: #666; width: 140px;">姓名</td><td style="padding: 8px 0; font-weight: bold;">${data.customerName}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">邮箱</td><td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}" style="color: #8B1A1A;">${data.customerEmail}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">收货地址</td><td style="padding: 8px 0;">${data.shippingAddress}, ${data.shippingCity}, ${data.shippingCountry}</td></tr>
      </table>
      <h2 style="color: #8B1A1A; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">🛍️ 购买商品</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #eee;">
        <thead><tr style="background: #FAF8F3;"><th style="padding: 10px; text-align: left; color: #8B1A1A;">商品名称</th><th style="padding: 10px; text-align: center; color: #8B1A1A;">数量</th><th style="padding: 10px; text-align: right; color: #8B1A1A;">单价</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot><tr style="background: #FAF8F3;"><td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: bold;">订单总额</td><td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 16px; color: #8B1A1A;">$${parseFloat(data.total).toFixed(2)}</td></tr></tfoot>
      </table>
      <h2 style="color: #8B1A1A; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">📸 付款截图</h2>
      <div style="text-align: center; margin-bottom: 25px; background: #FAF8F3; padding: 20px; border-radius: 8px; border: 1px dashed #D4AF37;">
        <img src="${data.proofImageUrl}" alt="付款截图" style="max-width: 100%; max-height: 600px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
        <p style="margin: 12px 0 0 0; font-size: 12px;"><a href="${data.proofImageUrl}" target="_blank" style="color: #8B1A1A;">点击查看原图</a></p>
      </div>
      <div style="background: #E8F5E9; border: 1px solid #4CAF50; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <p style="margin: 0; color: #2E7D32; font-weight: bold;">✅ 确认到账后的操作步骤：</p>
        <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #2E7D32; font-size: 14px;">
          <li>登录管理后台 → 订单管理 → 找到订单 ${data.orderNumber}</li>
          <li>将支付状态更新为"已付款"</li>
          <li>安排发货并填写物流单号</li>
        </ol>
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
        <p>源·华渡 Yuan·Huadu — 后台自动通知</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getServiceReportEmail(service: {
  serviceName: string;
  customerName: string;
  reportUrl: string;
  orderNumber: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>您的${service.serviceName}报告已完成</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">源·华渡</h1>
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Eastern Cultural Heritage</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">📜 您的${service.serviceName}报告已完成</h2>
    
    <p>尊敬的 ${service.customerName}，</p>
    
    <p>五台山文化传承人已完成您的${service.serviceName}分析，报告已准备就绪。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0 0 10px 0;"><strong>订单号:</strong> ${service.orderNumber}</p>
      <p style="margin: 0;"><strong>服务类型:</strong> ${service.serviceName}</p>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>✨ 报告内容</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">传承人基于易经、五行、紫微斗数等千年东方文化智慧，为您深度解析运势走向，明示机遇、警示险阻，助您趋利避害、拓宽人生格局。</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${service.reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">📥 下载报告</a>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
      <p style="margin: 0 0 10px 0; color: #8B1A1A; font-weight: bold;">💡 温馨提示</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666;">
        <li>报告链接长期有效，请妥善保存</li>
        <li>建议在安静环境下细读报告，领悟其中智慧</li>
        <li>如有疑问，欢迎随时联系我们</li>
        <li>报告内容仅供参考，人生掌握在您手中</li>
      </ul>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #8B1A1A; font-weight: bold;">🙏 感谢您的信任</p>
      <p style="margin: 0; font-size: 14px;">愿东方智慧照亮您的人生旅程</p>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666;">如需更多服务，欢迎访问我们的网站或联系客服。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意！</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
      <p>源·华渡 Yuan·Huadu</p>
      <p>传承东方智慧 · 守护人生旅程</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
