/**
 * 迁移脚本：将 Manus 数据库中 55 个新产品（无 slug 冲突）迁移到 Railway 生产数据库
 * 包括：510056-510061, 570001-570003, 600003, 700043-700088
 * 并为这些产品生成 30000 条多语言评论
 */
import mysql from 'mysql2/promise';

const RAILWAY_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';
const MANUS_DB = 'mysql://2vUuSS4u8JGEyYT.root:B0aHv0Q1i4YyqyDzE6y0@gateway04.us-east-1.prod.aws.tidbcloud.com:4000/8WruFPRUxPMzzwD4ZeeUDg?ssl={"rejectUnauthorized":true}';

const TARGET_REVIEWS = 30000;
const REVIEW_BATCH_SIZE = 500;

const REVIEW_TEMPLATES = {
  en: ["Absolutely beautiful piece! The craftsmanship is exquisite and the energy I feel wearing it is incredible. Highly recommend to anyone seeking spiritual protection.","I've been wearing this for 3 months now and I genuinely feel a positive shift in my energy. The quality is outstanding and it arrived beautifully packaged.","This is my third purchase from Cneraart and every piece has been perfect. The blessing from Mount Wutai makes it truly special. Fast shipping too!","The detail on this piece is remarkable. You can tell it was made with care and intention. I wear it every day and get so many compliments.","I bought this as a gift for my mother and she absolutely loves it. The packaging was gorgeous and it came with a lovely card explaining the blessing.","Such a meaningful piece. I've noticed my anxiety has decreased since I started wearing it. Whether it's the energy or just the reminder to stay calm, it works!","Perfect quality! The materials feel premium and the craftsmanship is top-notch. Worth every penny for something so spiritually significant.","I was skeptical at first but after wearing this for a few weeks I feel more centered and peaceful. The quality is genuinely impressive.","Beautiful item, exactly as described. The photos don't do it justice - it's even more stunning in person. Very happy with this purchase.","Fast delivery and excellent packaging. The product itself is gorgeous and feels very high quality. Will definitely be ordering more items.","I've given these as gifts to several friends and family members. Everyone has been delighted.","This piece has become my daily talisman. I feel protected and centered when I wear it.","Stunning piece with incredible attention to detail. I can feel the care that went into making this.","Ordered for my anniversary and my partner was moved to tears. The quality exceeded our expectations.","I've been collecting pieces from Mount Wutai for years and this is among the finest I've encountered.","Wonderful product! Arrived quickly and was packaged with such care.","This is exactly what I was looking for. The quality is premium, the spiritual significance is real.","Amazing quality and beautiful design. I wear it every day and feel a sense of peace and protection.","Received this as a birthday gift and I'm absolutely in love with it.","Outstanding piece! The quality far exceeded my expectations."],
  zh: ["非常精美的饰品！做工精致，戴上之后感觉能量非常好。强烈推荐给寻求灵性保护的朋友。","已经戴了3个月了，确实感觉能量有了积极的变化。品质出众，包装也非常精美。","这是我第三次在源华渡购买了，每一件都非常完美。五台山开光加持让它真的很特别。","这件饰品的细节令人叹为观止。可以感受到它是用心和诚意制作的。","买来送给妈妈的，她非常喜欢。包装精美，附带了一张解释开光仪式的精美卡片。","非常有意义的饰品。自从开始佩戴以来，我注意到焦虑减少了。","品质完美！材料感觉非常高档，工艺一流。","一开始我有些怀疑，但戴了几周后感觉更加平静和安宁。","美丽的物品，与描述完全一致。照片无法展现它的真实美丽——实物更加惊艳。","发货快，包装优秀。产品本身非常漂亮，感觉品质很高。","已经送给几位朋友和家人了，每个人都非常高兴。","这件饰品已经成为我每天的护身符。戴上它感觉受到保护和平静。","令人惊叹的饰品，细节处理无可挑剔。","为周年纪念日订购的，伴侣感动落泪。","多年来一直收集五台山的饰品，这是我遇到的最精美的之一。","精彩的产品！快速到达，包装非常用心。","这正是我在寻找的。品质高档，灵性意义真实。","品质惊人，设计精美。每天都戴，感受到平静和保护。","作为生日礼物收到，完全爱上了它。","出色的饰品！品质远超我的期望。"],
  de: ["Absolut wunderschönes Stück! Die Handwerkskunst ist exquisit.","Ich trage es seit 3 Monaten und spüre wirklich eine positive Veränderung.","Das ist mein drittes Kauf bei Cneraart und jedes Stück war perfekt.","Das Detail an diesem Stück ist bemerkenswert.","Als Geschenk für meine Mutter gekauft und sie liebt es absolut.","Ein so bedeutungsvolles Stück.","Perfekte Qualität! Die Materialien fühlen sich hochwertig an.","Ich war zunächst skeptisch, aber nach einigen Wochen fühle ich mich zentrierter.","Schöner Artikel, genau wie beschrieben.","Schnelle Lieferung und ausgezeichnete Verpackung."],
  fr: ["Absolument magnifique! L'artisanat est exquis.","Je le porte depuis 3 mois et je ressens vraiment un changement positif.","C'est mon troisième achat chez Cneraart et chaque pièce a été parfaite.","Le détail de cette pièce est remarquable.","Acheté comme cadeau pour ma mère et elle l'adore absolument.","Une pièce si significative.","Qualité parfaite! Les matériaux semblent premium.","J'étais sceptique au début mais après quelques semaines je me sens plus centré.","Bel article, exactement comme décrit.","Livraison rapide et excellent emballage."],
  es: ["¡Absolutamente hermoso! La artesanía es exquisita.","Lo llevo puesto desde hace 3 meses y realmente siento un cambio positivo.","Esta es mi tercera compra en Cneraart y cada pieza ha sido perfecta.","El detalle de esta pieza es notable.","Comprado como regalo para mi madre y le encanta absolutamente.","Una pieza tan significativa.","¡Calidad perfecta! Los materiales se sienten premium.","Era escéptico al principio pero después de usarlo me siento más centrado.","Hermoso artículo, exactamente como se describe.","Entrega rápida y excelente embalaje."],
  ja: ["絶対に美しい作品！職人技が素晴らしい。","3ヶ月間着けていますが、エネルギーに本当にポジティブな変化を感じています。","Cneraartでの3回目の購入ですが、すべての作品が完璧でした。","この作品のディテールは注目に値します。","母へのプレゼントとして購入しましたが、彼女は大好きです。","こんなに意味のある作品。","完璧な品質！素材はプレミアムな感じがします。","最初は懐疑的でしたが、数週間着けた後、より落ち着いて平和を感じています。","美しいアイテム、説明通りです。","迅速な配送と優れた梱包。"],
  ko: ["정말 아름다운 작품입니다!","3개월째 착용하고 있는데 에너지에 정말 긍정적인 변화를 느끼고 있습니다.","Cneraart에서 세 번째 구매인데 모든 작품이 완벽했습니다.","이 작품의 디테일이 놀랍습니다.","어머니를 위한 선물로 구매했는데 정말 좋아하십니다.","정말 의미 있는 작품입니다.","완벽한 품질!","처음에는 회의적이었지만 몇 주 착용 후 더 안정되고 평화로움을 느낍니다.","아름다운 아이템, 설명과 정확히 일치합니다.","빠른 배송과 훌륭한 포장."],
  pt: ["Absolutamente lindo!","Estou usando há 3 meses e realmente sinto uma mudança positiva.","Esta é minha terceira compra na Cneraart e cada peça foi perfeita.","O detalhe desta peça é notável.","Comprado como presente para minha mãe e ela adora absolutamente.","Uma peça tão significativa.","Qualidade perfeita!","Estava cético no início, mas depois de usar por algumas semanas me sinto mais centrado.","Lindo artigo, exatamente como descrito.","Entrega rápida e excelente embalagem."],
  ru: ["Абсолютно красивое изделие!","Ношу уже 3 месяца и действительно чувствую позитивные изменения.","Это моя третья покупка в Cneraart, и каждое изделие было идеальным.","Детализация этого изделия замечательна.","Купил в подарок маме, и она его обожает.","Такое значимое изделие.","Идеальное качество!","Сначала я был скептичен, но после нескольких недель ношения чувствую себя более сосредоточенным.","Красивый предмет, точно как описано.","Быстрая доставка и отличная упаковка."],
  ar: ["جميل للغاية!","أرتديه منذ 3 أشهر وأشعر حقاً بتغيير إيجابي.","هذه هي مشترياتي الثالثة من Cneraart وكل قطعة كانت مثالية.","التفاصيل في هذه القطعة رائعة.","اشتريته هدية لأمي وهي تحبه كثيراً.","قطعة ذات معنى عميق.","جودة مثالية!","كنت متشككاً في البداية لكن بعد ارتدائه لبضعة أسابيع أشعر بمزيد من التوازن.","عنصر جميل، تماماً كما هو موصوف.","توصيل سريع وتغليف ممتاز."],
  th: ["สวยงามมากจริงๆ!","ฉันสวมใส่มา 3 เดือนแล้วและรู้สึกถึงการเปลี่ยนแปลงเชิงบวก","นี่คือการซื้อครั้งที่สามจาก Cneraart และทุกชิ้นสมบูรณ์แบบ","รายละเอียดของชิ้นนี้น่าทึ่งมาก","ซื้อเป็นของขวัญให้แม่และเธอชอบมากๆ","ชิ้นงานที่มีความหมายมาก","คุณภาพสมบูรณ์แบบ!","ฉันสงสัยในตอนแรกแต่หลังจากสวมใส่ไม่กี่สัปดาห์รู้สึกสมดุลมากขึ้น","สินค้าสวยงาม ตรงตามที่อธิบาย","จัดส่งรวดเร็วและบรรจุภัณฑ์ยอดเยี่ยม"],
  vi: ["Tuyệt đẹp!","Tôi đã đeo được 3 tháng và thực sự cảm nhận được sự thay đổi tích cực.","Đây là lần mua thứ ba của tôi tại Cneraart và mỗi món đều hoàn hảo.","Chi tiết của món này thật đáng chú ý.","Mua làm quà cho mẹ và bà ấy yêu thích tuyệt đối.","Một món đồ có ý nghĩa sâu sắc.","Chất lượng hoàn hảo!","Tôi hoài nghi lúc đầu nhưng sau vài tuần đeo tôi cảm thấy tập trung hơn.","Món đẹp, đúng như mô tả.","Giao hàng nhanh và đóng gói xuất sắc."],
  id: ["Sangat indah!","Saya sudah memakainya selama 3 bulan dan benar-benar merasakan perubahan positif.","Ini adalah pembelian ketiga saya dari Cneraart dan setiap produk sempurna.","Detail pada produk ini luar biasa.","Dibeli sebagai hadiah untuk ibu saya dan dia sangat menyukainya.","Produk yang sangat bermakna.","Kualitas sempurna!","Saya skeptis pada awalnya tetapi setelah memakainya beberapa minggu saya merasa lebih terpusat.","Item yang indah, persis seperti yang dijelaskan.","Pengiriman cepat dan kemasan yang sangat baik."],
  hi: ["बिल्कुल सुंदर!","मैं इसे 3 महीने से पहन रहा हूं और वास्तव में सकारात्मक बदलाव महसूस कर रहा हूं।","यह Cneraart से मेरी तीसरी खरीदारी है और हर टुकड़ा परफेक्ट रहा है।","इस टुकड़े का विवरण उल्लेखनीय है।","अपनी माँ के लिए उपहार के रूप में खरीदा और वह इसे बिल्कुल पसंद करती हैं।","इतना सार्थक टुकड़ा।","परफेक्ट गुणवत्ता!","मैं पहले संशयवादी था लेकिन कुछ हफ्तों तक पहनने के बाद मैं अधिक केंद्रित महसूस करता हूं।","सुंदर आइटम, बिल्कुल वर्णन के अनुसार।","तेज डिलीवरी और उत्कृष्ट पैकेजिंग।"]
};

const LANGUAGES = Object.keys(REVIEW_TEMPLATES);
const RATINGS_DIST = [5,5,5,5,5,5,5,5,4,4,4,4,4,3];
const NAMES_BY_LANG = {
  en: ['Sarah M.','John D.','Emily R.','Michael T.','Jessica L.','David W.','Ashley K.','James B.','Amanda F.','Robert C.'],
  zh: ['王小明','李华','张伟','刘芳','陈静','赵磊','孙丽','周强','吴燕','郑涛'],
  de: ['Hans M.','Petra K.','Klaus W.','Monika S.','Thomas B.'],
  fr: ['Marie D.','Pierre M.','Sophie L.','Jean-Paul B.','Isabelle R.'],
  es: ['María G.','Carlos R.','Ana M.','José L.','Laura S.'],
  ja: ['田中太郎','鈴木花子','佐藤一郎','山田美咲','伊藤健'],
  ko: ['김민준','이서연','박지훈','최수아','정민호'],
  pt: ['João S.','Maria F.','Pedro A.','Ana C.','Carlos M.'],
  ru: ['Иван П.','Мария К.','Алексей С.','Елена В.','Дмитрий Н.'],
  ar: ['محمد أ.','فاطمة م.','أحمد ع.','زينب ح.','عمر س.'],
  th: ['สมชาย ก.','สุดา ป.','วิชัย ร.','นภา ส.','อนุชา ม.'],
  vi: ['Nguyễn V.','Trần T.','Lê H.','Phạm M.','Hoàng L.'],
  id: ['Budi S.','Siti R.','Ahmad F.','Dewi K.','Hendra P.'],
  hi: ['राहुल श.','प्रिया म.','अमित क.','सुनीता व.','विकास ग.']
};
const IPS = ['45.33.32.156','104.21.45.67','172.67.68.228','8.8.8.8','1.1.1.1','185.220.101.45','91.108.4.1','77.88.8.8'];
const LOCATIONS = ['New York, USA','London, UK','Tokyo, Japan','Paris, France','Berlin, Germany','Sydney, Australia','Toronto, Canada','Seoul, South Korea','Singapore','Dubai, UAE','Mumbai, India','São Paulo, Brazil','Amsterdam, Netherlands','Stockholm, Sweden','Madrid, Spain'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randDate() {
  const now = Date.now();
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;
  return new Date(twoYearsAgo + Math.random() * (now - twoYearsAgo));
}

async function insertReviewBatch(conn, rows) {
  if (rows.length === 0) return;
  const placeholders = rows.map(() => '(?,?,?,?,?,?,?,?,?,?)').join(',');
  await conn.query(
    `INSERT INTO reviews (productId, userId, userName, rating, comment, language, isApproved, ipAddress, location, createdAt) VALUES ${placeholders}`,
    rows.flat()
  );
}

async function generateReviews(conn, productId) {
  let batch = [];
  let inserted = 0;
  for (let i = 0; i < TARGET_REVIEWS; i++) {
    const lang = rand(LANGUAGES);
    const names = NAMES_BY_LANG[lang] || NAMES_BY_LANG.en;
    const templates = REVIEW_TEMPLATES[lang] || REVIEW_TEMPLATES.en;
    batch.push([productId, null, rand(names), rand(RATINGS_DIST), rand(templates), lang, 1, rand(IPS), rand(LOCATIONS), randDate()]);
    if (batch.length >= REVIEW_BATCH_SIZE) {
      await insertReviewBatch(conn, batch);
      inserted += batch.length;
      batch = [];
    }
  }
  if (batch.length > 0) {
    await insertReviewBatch(conn, batch);
    inserted += batch.length;
  }
  return inserted;
}

async function main() {
  console.log('Connecting to databases...');
  const rConn = await mysql.createConnection(RAILWAY_DB);
  const mConn = await mysql.createConnection(MANUS_DB);
  console.log('Connected!\n');

  // 获取 Railway 现有产品 ID 和 slug
  const [rProducts] = await rConn.execute('SELECT id, slug FROM products');
  const rIds = new Set(rProducts.map(p => p.id));
  const rSlugs = new Set(rProducts.map(p => p.slug));

  // 获取 Manus 所有产品
  const [mProducts] = await mConn.execute('SELECT * FROM products ORDER BY id');
  
  // 只迁移：ID 不存在 AND slug 不冲突的产品
  const toMigrate = mProducts.filter(p => !rIds.has(p.id) && !rSlugs.has(p.slug));
  console.log(`Products to migrate: ${toMigrate.length}`);
  console.log('IDs:', toMigrate.map(p=>p.id).join(','));

  // 迁移产品
  let migratedProducts = 0;
  for (const product of toMigrate) {
    try {
      await rConn.execute(
        `INSERT INTO products (id, name, slug, description, shortDescription, regularPrice, salePrice, costPrice, sku, stock, lowStockThreshold, categoryId, tags, blessingTemple, blessingMaster, blessingDate, blessingDescription, metaTitle, metaDescription, metaKeywords, status, featured, createdAt, updatedAt, suitableFor, efficacy, wearingGuide)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [product.id, product.name, product.slug, product.description, product.shortDescription, product.regularPrice, product.salePrice, product.costPrice, product.sku, product.stock, product.lowStockThreshold, product.categoryId, product.tags, product.blessingTemple, product.blessingMaster, product.blessingDate, product.blessingDescription, product.metaTitle, product.metaDescription, product.metaKeywords, product.status, product.featured, product.createdAt, product.updatedAt, product.suitableFor, product.efficacy, product.wearingGuide]
      );
      migratedProducts++;
    } catch(e) {
      console.error(`  Failed to migrate product ${product.id}: ${e.message}`);
    }
  }
  console.log(`✓ Migrated ${migratedProducts} products\n`);

  // 迁移图片
  if (toMigrate.length > 0) {
    const ids = toMigrate.map(p => p.id);
    const placeholders = ids.map(() => '?').join(',');
    const [images] = await mConn.execute(`SELECT * FROM product_images WHERE productId IN (${placeholders})`, ids);
    console.log(`Migrating ${images.length} images...`);
    let imgMigrated = 0;
    for (const img of images) {
      try {
        await rConn.execute(
          `INSERT INTO product_images (id, productId, url, fileKey, altText, displayOrder, isPrimary, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [img.id, img.productId, img.url, img.fileKey, img.altText, img.displayOrder, img.isPrimary, img.createdAt]
        );
        imgMigrated++;
      } catch(e) {
        if (!e.message.includes('Duplicate')) console.error(`  Image ${img.id} error: ${e.message}`);
      }
    }
    console.log(`✓ Migrated ${imgMigrated} images\n`);
  }

  // 为所有迁移的产品生成评论
  console.log('Generating reviews...');
  let totalReviews = 0;
  for (const product of toMigrate) {
    const count = await generateReviews(rConn, product.id);
    totalReviews += count;
    console.log(`✓ Product ${product.id}: ${count} reviews (total: ${totalReviews})`);
  }

  const [finalProducts] = await rConn.execute('SELECT COUNT(*) as total FROM products');
  const [finalReviews] = await rConn.execute('SELECT COUNT(*) as total FROM reviews');
  console.log(`\n✅ Done!`);
  console.log(`   Railway DB products: ${finalProducts[0].total}`);
  console.log(`   Railway DB reviews: ${finalReviews[0].total}`);

  await rConn.end();
  await mConn.end();
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
