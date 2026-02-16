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
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Ancient Eastern Blessings</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">订单确认</h2>
    
    <p>尊敬的 ${order.customerName}，</p>
    
    <p>感谢您在源·华渡下单!我们已收到您的订单,正在为您准备开光法物。</p>
    
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
      <p style="margin: 0; color: #8B1A1A;"><strong>📿 开光加持</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">您的法物将在五台山由高僧进行七日开光仪式,注入文殊菩萨的智慧与五爷的财运加持。</p>
    </div>
    
    <p style="margin-top: 30px;">我们会在发货时通知您物流信息。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意!</p>
    
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
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Ancient Eastern Blessings</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">🚚 您的订单已发货</h2>
    
    <p>尊敬的 ${order.customerName}，</p>
    
    <p>好消息!您的开光法物已完成七日加持仪式,现已发货。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0 0 10px 0;"><strong>订单号:</strong> ${order.orderNumber}</p>
      <p style="margin: 0 0 10px 0;"><strong>快递公司:</strong> ${order.shippingCarrier}</p>
      <p style="margin: 0;"><strong>运单号:</strong> <span style="color: #8B1A1A; font-weight: bold;">${order.trackingNumber}</span></p>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>✨ 使用提示</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">收到法物后,请先用清水净手,诚心供奉或随身佩戴。开光法物已注入灵性能量,请珍惜使用。</p>
    </div>
    
    <p style="margin-top: 30px;">您可以使用运单号在快递公司官网查询物流进度。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意!</p>
    
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
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Ancient Eastern Blessings</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">🎉 您的订单已送达</h2>
    
    <p>尊敬的 ${order.customerName}，</p>
    
    <p>您的开光法物已成功送达!感谢您对源·华渡的信任。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0;"><strong>订单号:</strong> ${order.orderNumber}</p>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>🙏 使用建议</strong></p>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px;">
        <li>开光法物请保持清洁,避免污秽</li>
        <li>随身佩戴或供奉于清净之处</li>
        <li>诚心供养,定期上香礼拜</li>
        <li>如需转赠他人,请告知对方法物来历</li>
      </ul>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 15px 0; color: #8B1A1A; font-weight: bold;">愿法物护佑您</p>
      <p style="margin: 0; font-size: 14px; color: #666;">平安喜乐 · 事业顺遂 · 家宅兴旺</p>
    </div>
    
    <p style="margin-top: 30px;">如果您对我们的服务满意,欢迎推荐给亲朋好友。如有任何问题,请随时联系我们。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意!</p>
    
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
 * 服务报告发送邮件模板
 */
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
    <p style="color: #FAF8F3; margin: 10px 0 0 0;">Ancient Eastern Blessings</p>
  </div>
  
  <div style="background: #FAF8F3; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #8B1A1A; margin-top: 0;">📜 您的${service.serviceName}报告已完成</h2>
    
    <p>尊敬的 ${service.customerName}，</p>
    
    <p>五台山大师已完成您的${service.serviceName}分析,报告已准备就绪。</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #D4AF37;">
      <p style="margin: 0 0 10px 0;"><strong>订单号:</strong> ${service.orderNumber}</p>
      <p style="margin: 0;"><strong>服务类型:</strong> ${service.serviceName}</p>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37; margin: 20px 0;">
      <p style="margin: 0; color: #8B1A1A;"><strong>✨ 报告内容</strong></p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">大师基于易经、五行、紫微斗数等千年东方智慧,为您深度解析运势走向,明示机遇、警示险阻,助您趋利避害、拓宽人生格局。</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${service.reportUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B1A1A 0%, #D4AF37 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">📥 下载报告</a>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
      <p style="margin: 0 0 10px 0; color: #8B1A1A; font-weight: bold;">💡 温馨提示</p>
      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666;">
        <li>报告链接长期有效,请妥善保存</li>
        <li>建议在安静环境下细读报告,领悟其中智慧</li>
        <li>如有疑问,欢迎随时联系我们</li>
        <li>报告内容仅供参考,人生掌握在您手中</li>
      </ul>
    </div>
    
    <div style="background: #FFF8DC; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; color: #8B1A1A; font-weight: bold;">🙏 感谢您的信任</p>
      <p style="margin: 0; font-size: 14px;">愿东方智慧照亮您的人生旅程</p>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #666;">如需更多服务,欢迎访问我们的网站或联系客服。</p>
    
    <p style="margin-top: 20px;">祝您吉祥如意!</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
      <p>源·华渡 Yuan·Huadu</p>
      <p>传承东方智慧 · 守护人生旅程</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
