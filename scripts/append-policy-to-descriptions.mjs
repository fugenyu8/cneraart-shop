/**
 * 为所有产品说明追加退换货政策和到货时间
 * 支持两种格式：
 * 1. JSON 多语言格式 → 为每种语言追加对应语言文字
 * 2. 纯英文文本格式 → 直接追加英文文字
 * 只修改 description 字段，不改任何其他字段
 */
import mysql from 'mysql2/promise';

const RAILWAY_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

// 英文版（用于纯文本格式产品）
const EN_POLICY = `\n\n📦 Estimated Delivery: 12–18 business days.\n\n⚠️ Return & Exchange Policy: Each piece has been personally imbued through a traditional Qi-Yun ceremony, making it spiritually unique to its owner. As a result, we are unable to accept returns or exchanges once an order has been fulfilled.`;

// 每种语言的追加内容（用于 JSON 多语言格式产品）
const POLICY_TEXTS = {
  en: `\n\n📦 Estimated Delivery: 12–18 business days.\n\n⚠️ Return & Exchange Policy: Each piece has been personally imbued through a traditional Qi-Yun ceremony, making it spiritually unique to its owner. As a result, we are unable to accept returns or exchanges once an order has been fulfilled.`,
  
  zh: `\n\n📦 预计到货时间：12–18个工作日。\n\n⚠️ 退换货政策：每件商品均已经过传统祈愿仪式的个人开光加持，与其主人建立了独特的灵性连结。因此，订单完成后恕不接受退货或换货。`,
  
  'zh-Hant': `\n\n📦 預計到貨時間：12–18個工作日。\n\n⚠️ 退換貨政策：每件商品均已經過傳統祈願儀式的個人開光加持，與其主人建立了獨特的靈性連結。因此，訂單完成後恕不接受退貨或換貨。`,
  
  de: `\n\n📦 Voraussichtliche Lieferzeit: 12–18 Werktage.\n\n⚠️ Rückgabe- und Umtauschrichtlinie: Jedes Stück wurde persönlich durch eine traditionelle Qi-Yun-Zeremonie geweiht und ist dadurch spirituell einzigartig für seinen Besitzer. Daher können wir nach Auftragserfüllung keine Rücksendungen oder Umtausche akzeptieren.`,
  
  fr: `\n\n📦 Délai de livraison estimé : 12 à 18 jours ouvrables.\n\n⚠️ Politique de retour et d'échange : Chaque pièce a été personnellement consacrée par une cérémonie traditionnelle Qi-Yun, la rendant spirituellement unique pour son propriétaire. Par conséquent, nous ne pouvons accepter ni retours ni échanges une fois la commande exécutée.`,
  
  es: `\n\n📦 Tiempo de entrega estimado: 12–18 días hábiles.\n\n⚠️ Política de devoluciones e intercambios: Cada pieza ha sido personalmente imbuida a través de una ceremonia tradicional Qi-Yun, haciéndola espiritualmente única para su propietario. Por lo tanto, no podemos aceptar devoluciones ni intercambios una vez que se haya completado el pedido.`,
  
  it: `\n\n📦 Tempo di consegna stimato: 12–18 giorni lavorativi.\n\n⚠️ Politica di reso e cambio: Ogni pezzo è stato personalmente consacrato attraverso una tradizionale cerimonia Qi-Yun, rendendolo spiritualmente unico per il suo proprietario. Pertanto, non possiamo accettare resi o cambi una volta evaso l'ordine.`,
  
  ja: `\n\n📦 お届け予定日数：12〜18営業日。\n\n⚠️ 返品・交換ポリシー：各商品は伝統的な気韻の儀式を通じて個別に祈願されており、所有者にとって霊的に唯一無二のものとなっています。そのため、ご注文の履行後は返品・交換をお受けすることができません。`,
  
  ko: `\n\n📦 예상 배송 기간: 12~18 영업일.\n\n⚠️ 반품 및 교환 정책: 각 제품은 전통적인 기운 의식을 통해 개인적으로 기도가 담겨 있어 소유자에게 영적으로 고유한 의미를 지닙니다. 따라서 주문이 완료된 후에는 반품이나 교환을 받을 수 없습니다.`,
  
  ar: `\n\n📦 وقت التسليم المتوقع: 12–18 يوم عمل.\n\n⚠️ سياسة الإرجاع والاستبدال: تم تخصيص كل قطعة شخصياً من خلال مراسم تقليدية للطاقة، مما يجعلها فريدة روحياً لمالكها. لذلك، لا يمكننا قبول الإرجاع أو الاستبدال بعد تنفيذ الطلب.`,
  
  hi: `\n\n📦 अनुमानित डिलीवरी समय: 12–18 कार्य दिवस।\n\n⚠️ वापसी और विनिमय नीति: प्रत्येक वस्तु को पारंपरिक क्यूई-यून समारोह के माध्यम से व्यक्तिगत रूप से आशीर्वाद दिया गया है, जिससे यह अपने मालिक के लिए आध्यात्मिक रूप से अद्वितीय बन जाती है। इसलिए, ऑर्डर पूरा होने के बाद हम वापसी या विनिमय स्वीकार नहीं कर सकते।`,
  
  id: `\n\n📦 Estimasi waktu pengiriman: 12–18 hari kerja.\n\n⚠️ Kebijakan pengembalian dan penukaran: Setiap barang telah secara pribadi diberkati melalui upacara Qi-Yun tradisional, menjadikannya unik secara spiritual bagi pemiliknya. Oleh karena itu, kami tidak dapat menerima pengembalian atau penukaran setelah pesanan terpenuhi.`,
  
  pt: `\n\n📦 Prazo de entrega estimado: 12–18 dias úteis.\n\n⚠️ Política de devoluções e trocas: Cada peça foi pessoalmente consagrada através de uma cerimônia tradicional Qi-Yun, tornando-a espiritualmente única para seu proprietário. Portanto, não podemos aceitar devoluções ou trocas após o cumprimento do pedido.`,
  
  ru: `\n\n📦 Ожидаемое время доставки: 12–18 рабочих дней.\n\n⚠️ Политика возврата и обмена: Каждое изделие было лично освящено через традиционную церемонию Ци-Юнь, что делает его духовно уникальным для своего владельца. Поэтому мы не можем принять возврат или обмен после выполнения заказа.`,
  
  th: `\n\n📦 เวลาจัดส่งโดยประมาณ: 12–18 วันทำการ\n\n⚠️ นโยบายการคืนและเปลี่ยนสินค้า: สินค้าแต่ละชิ้นได้รับการอธิษฐานส่วนตัวผ่านพิธีกรรมฉีหยุนแบบดั้งเดิม ทำให้มีความเป็นเอกลักษณ์ทางจิตวิญญาณสำหรับเจ้าของ ดังนั้นเราจึงไม่สามารถรับคืนหรือเปลี่ยนสินค้าได้หลังจากที่คำสั่งซื้อเสร็จสมบูรณ์`,
  
  tr: `\n\n📦 Tahmini teslimat süresi: 12–18 iş günü.\n\n⚠️ İade ve değişim politikası: Her parça, geleneksel bir Qi-Yun töreni aracılığıyla kişisel olarak kutsanmış olup sahibi için ruhsal açıdan benzersiz kılınmıştır. Bu nedenle, sipariş tamamlandıktan sonra iade veya değişim kabul edemiyoruz.`,
  
  vi: `\n\n📦 Thời gian giao hàng ước tính: 12–18 ngày làm việc.\n\n⚠️ Chính sách đổi trả: Mỗi sản phẩm đã được cá nhân hóa thông qua nghi lễ Qi-Yun truyền thống, tạo nên sự độc đáo về mặt tâm linh cho chủ nhân của nó. Do đó, chúng tôi không thể chấp nhận đổi trả sau khi đơn hàng đã được thực hiện.`,
};

async function main() {
  const conn = await mysql.createConnection(RAILWAY_DB);
  console.log('✅ 连接到 Railway 数据库');

  const [products] = await conn.execute('SELECT id, description FROM products');
  console.log(`共 ${products.length} 个产品需要检查`);

  let updatedJson = 0;
  let updatedText = 0;
  let skipped = 0;

  for (const p of products) {
    const rawDesc = p.description;
    
    if (!rawDesc) {
      skipped++;
      continue;
    }

    // 尝试解析为 JSON
    let isJson = false;
    let desc = null;
    try {
      const parsed = JSON.parse(rawDesc);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        isJson = true;
        desc = parsed;
      }
    } catch (e) {
      // 不是 JSON，当作纯文本处理
    }

    if (isJson && desc) {
      // JSON 多语言格式
      const enDesc = desc['en'] || '';
      if (enDesc.includes('12\u201318 business days')) {
        skipped++;
        continue;
      }

      for (const [lang, text] of Object.entries(POLICY_TEXTS)) {
        if (desc[lang] !== undefined) {
          desc[lang] = desc[lang] + text;
        }
      }

      await conn.execute('UPDATE products SET description = ? WHERE id = ?', [
        JSON.stringify(desc),
        p.id,
      ]);
      updatedJson++;

      const total = updatedJson + updatedText;
      if (total % 20 === 0 || total <= 3) {
        console.log(`[${total}/${products.length}] 产品 ${p.id} 更新完成 (JSON)`);
      }
    } else {
      // 纯文本格式（英文）
      if (rawDesc.includes('12\u201318 business days')) {
        skipped++;
        continue;
      }

      const newDesc = rawDesc + EN_POLICY;
      await conn.execute('UPDATE products SET description = ? WHERE id = ?', [
        newDesc,
        p.id,
      ]);
      updatedText++;

      const total = updatedJson + updatedText;
      if (total % 20 === 0 || total <= 3) {
        console.log(`[${total}/${products.length}] 产品 ${p.id} 更新完成 (纯文本)`);
      }
    }
  }

  console.log(`\n=== 完成 ===`);
  console.log(`更新 JSON 格式产品: ${updatedJson} 个`);
  console.log(`更新纯文本格式产品: ${updatedText} 个`);
  console.log(`跳过（已有政策或空描述）: ${skipped} 个`);
  console.log(`总计更新: ${updatedJson + updatedText} 个`);

  await conn.end();
  console.log('✅ 全部完成！');
}

main().catch(console.error);
