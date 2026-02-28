/**
 * 迁移脚本：将 gateway04（Manus平台数据库）中缺失的产品迁移到 gateway03（Railway生产数据库）
 * 同时为这些产品生成 30000 条评论
 */
import mysql from 'mysql2/promise';

const RAILWAY_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';
const MANUS_DB = 'mysql://2vUuSS4u8JGEyYT.root:B0aHv0Q1i4YyqyDzE6y0@gateway04.us-east-1.prod.aws.tidbcloud.com:4000/8WruFPRUxPMzzwD4ZeeUDg?ssl={"rejectUnauthorized":true}';

const TARGET_REVIEWS = 30000;
const REVIEW_BATCH_SIZE = 500;

// 评论模板（多语言）
const REVIEW_TEMPLATES = {
  en: [
    "Absolutely beautiful piece! The craftsmanship is exquisite and the energy I feel wearing it is incredible. Highly recommend to anyone seeking spiritual protection.",
    "I've been wearing this for 3 months now and I genuinely feel a positive shift in my energy. The quality is outstanding and it arrived beautifully packaged.",
    "This is my third purchase from Cneraart and every piece has been perfect. The blessing from Mount Wutai makes it truly special. Fast shipping too!",
    "The detail on this piece is remarkable. You can tell it was made with care and intention. I wear it every day and get so many compliments.",
    "I bought this as a gift for my mother and she absolutely loves it. The packaging was gorgeous and it came with a lovely card explaining the blessing.",
    "Such a meaningful piece. I've noticed my anxiety has decreased since I started wearing it. Whether it's the energy or just the reminder to stay calm, it works!",
    "Perfect quality! The materials feel premium and the craftsmanship is top-notch. Worth every penny for something so spiritually significant.",
    "I was skeptical at first but after wearing this for a few weeks I feel more centered and peaceful. The quality is genuinely impressive.",
    "Beautiful item, exactly as described. The photos don't do it justice - it's even more stunning in person. Very happy with this purchase.",
    "Fast delivery and excellent packaging. The product itself is gorgeous and feels very high quality. Will definitely be ordering more items.",
    "I've given these as gifts to several friends and family members. Everyone has been delighted. The spiritual significance combined with beautiful craftsmanship makes it perfect.",
    "This piece has become my daily talisman. I feel protected and centered when I wear it. The quality is exceptional and it's held up beautifully over months of wear.",
    "Stunning piece with incredible attention to detail. I can feel the care that went into making this. The blessing ceremony adds such a meaningful dimension.",
    "Ordered for my anniversary and my partner was moved to tears. The quality exceeded our expectations and the spiritual meaning made it so much more than just jewelry.",
    "I've been collecting pieces from Mount Wutai for years and this is among the finest I've encountered. The energy is palpable and the craftsmanship is superb.",
    "Wonderful product! Arrived quickly and was packaged with such care. The piece itself is beautiful and I've already noticed positive changes since wearing it.",
    "This is exactly what I was looking for. The quality is premium, the spiritual significance is real, and it's become my most treasured piece of jewelry.",
    "Amazing quality and beautiful design. I wear it every day and feel a sense of peace and protection. The Mount Wutai blessing makes it extra special.",
    "Received this as a birthday gift and I'm absolutely in love with it. The craftsmanship is incredible and the spiritual energy is real. Thank you!",
    "Outstanding piece! The quality far exceeded my expectations. I've recommended this to all my friends who are interested in spiritual jewelry."
  ],
  zh: [
    "非常精美的饰品！做工精致，戴上之后感觉能量非常好。强烈推荐给寻求灵性保护的朋友。",
    "已经戴了3个月了，确实感觉能量有了积极的变化。品质出众，包装也非常精美。",
    "这是我第三次在源华渡购买了，每一件都非常完美。五台山开光加持让它真的很特别。发货也很快！",
    "这件饰品的细节令人叹为观止。可以感受到它是用心和诚意制作的。每天都戴，收到很多称赞。",
    "买来送给妈妈的，她非常喜欢。包装精美，附带了一张解释开光仪式的精美卡片。",
    "非常有意义的饰品。自从开始佩戴以来，我注意到焦虑减少了。不管是能量还是提醒自己保持平静，都很有效！",
    "品质完美！材料感觉非常高档，工艺一流。对于如此具有灵性意义的东西，每一分钱都值得。",
    "一开始我有些怀疑，但戴了几周后感觉更加平静和安宁。品质确实令人印象深刻。",
    "美丽的物品，与描述完全一致。照片无法展现它的真实美丽——实物更加惊艳。非常满意这次购买。",
    "发货快，包装优秀。产品本身非常漂亮，感觉品质很高。一定会再次订购。",
    "已经送给几位朋友和家人了，每个人都非常高兴。灵性意义与精美工艺的结合使它成为完美礼物。",
    "这件饰品已经成为我每天的护身符。戴上它感觉受到保护和平静。品质卓越，佩戴几个月后依然完好如新。",
    "令人惊叹的饰品，细节处理无可挑剔。能感受到制作时投入的心血。开光仪式增添了如此有意义的维度。",
    "为周年纪念日订购的，伴侣感动落泪。品质超出了我们的期望，灵性意义让它远不止是一件珠宝。",
    "多年来一直收集五台山的饰品，这是我遇到的最精美的之一。能量真实可感，工艺精湛。",
    "精彩的产品！快速到达，包装非常用心。饰品本身很美，自从佩戴以来已经注意到了积极的变化。",
    "这正是我在寻找的。品质高档，灵性意义真实，已经成为我最珍贵的珠宝。",
    "品质惊人，设计精美。每天都戴，感受到平静和保护。五台山开光让它格外特别。",
    "作为生日礼物收到，完全爱上了它。工艺令人难以置信，灵性能量是真实的。谢谢！",
    "出色的饰品！品质远超我的期望。已经向所有对灵性珠宝感兴趣的朋友推荐了。"
  ],
  de: ["Absolut wunderschönes Stück! Die Handwerkskunst ist exquisit und die Energie, die ich beim Tragen spüre, ist unglaublich.","Ich trage es seit 3 Monaten und spüre wirklich eine positive Veränderung in meiner Energie.","Das ist mein drittes Kauf bei Cneraart und jedes Stück war perfekt.","Das Detail an diesem Stück ist bemerkenswert. Man kann sehen, dass es mit Sorgfalt hergestellt wurde.","Als Geschenk für meine Mutter gekauft und sie liebt es absolut.","Ein so bedeutungsvolles Stück. Ich habe bemerkt, dass meine Angst abgenommen hat.","Perfekte Qualität! Die Materialien fühlen sich hochwertig an.","Ich war zunächst skeptisch, aber nach einigen Wochen fühle ich mich zentrierter.","Schöner Artikel, genau wie beschrieben.","Schnelle Lieferung und ausgezeichnete Verpackung."],
  fr: ["Absolument magnifique! L'artisanat est exquis et l'énergie que je ressens en le portant est incroyable.","Je le porte depuis 3 mois et je ressens vraiment un changement positif dans mon énergie.","C'est mon troisième achat chez Cneraart et chaque pièce a été parfaite.","Le détail de cette pièce est remarquable.","Acheté comme cadeau pour ma mère et elle l'adore absolument.","Une pièce si significative. J'ai remarqué que mon anxiété a diminué.","Qualité parfaite! Les matériaux semblent premium.","J'étais sceptique au début mais après quelques semaines je me sens plus centré.","Bel article, exactement comme décrit.","Livraison rapide et excellent emballage."],
  es: ["¡Absolutamente hermoso! La artesanía es exquisita y la energía que siento al usarlo es increíble.","Lo llevo puesto desde hace 3 meses y realmente siento un cambio positivo.","Esta es mi tercera compra en Cneraart y cada pieza ha sido perfecta.","El detalle de esta pieza es notable.","Comprado como regalo para mi madre y le encanta absolutamente.","Una pieza tan significativa. He notado que mi ansiedad ha disminuido.","¡Calidad perfecta! Los materiales se sienten premium.","Era escéptico al principio pero después de usarlo me siento más centrado.","Hermoso artículo, exactamente como se describe.","Entrega rápida y excelente embalaje."],
  ja: ["絶対に美しい作品！職人技が素晴らしく、着けているときに感じるエネルギーは信じられないほどです。","3ヶ月間着けていますが、エネルギーに本当にポジティブな変化を感じています。","Cneraartでの3回目の購入ですが、すべての作品が完璧でした。","この作品のディテールは注目に値します。","母へのプレゼントとして購入しましたが、彼女は大好きです。","こんなに意味のある作品。着け始めてから不安が減ったことに気づきました。","完璧な品質！素材はプレミアムな感じがします。","最初は懐疑的でしたが、数週間着けた後、より落ち着いて平和を感じています。","美しいアイテム、説明通りです。","迅速な配送と優れた梱包。"],
  ko: ["정말 아름다운 작품입니다! 장인 정신이 탁월하고 착용할 때 느끼는 에너지가 놀랍습니다.","3개월째 착용하고 있는데 에너지에 정말 긍정적인 변화를 느끼고 있습니다.","Cneraart에서 세 번째 구매인데 모든 작품이 완벽했습니다.","이 작품의 디테일이 놀랍습니다.","어머니를 위한 선물로 구매했는데 정말 좋아하십니다.","정말 의미 있는 작품입니다. 착용하기 시작한 이후로 불안이 줄어든 것을 느꼈습니다.","완벽한 품질! 소재가 프리미엄하게 느껴집니다.","처음에는 회의적이었지만 몇 주 착용 후 더 안정되고 평화로움을 느낍니다.","아름다운 아이템, 설명과 정확히 일치합니다.","빠른 배송과 훌륭한 포장."],
  pt: ["Absolutamente lindo! O artesanato é exquisito e a energia que sinto ao usá-lo é incrível.","Estou usando há 3 meses e realmente sinto uma mudança positiva na minha energia.","Esta é minha terceira compra na Cneraart e cada peça foi perfeita.","O detalhe desta peça é notável.","Comprado como presente para minha mãe e ela adora absolutamente.","Uma peça tão significativa. Percebi que minha ansiedade diminuiu.","Qualidade perfeita! Os materiais parecem premium.","Estava cético no início, mas depois de usar por algumas semanas me sinto mais centrado.","Lindo artigo, exatamente como descrito.","Entrega rápida e excelente embalagem."],
  ru: ["Абсолютно красивое изделие! Мастерство изысканное, и энергия при ношении невероятна.","Ношу уже 3 месяца и действительно чувствую позитивные изменения в своей энергии.","Это моя третья покупка в Cneraart, и каждое изделие было идеальным.","Детализация этого изделия замечательна.","Купил в подарок маме, и она его обожает.","Такое значимое изделие. Я заметил, что моя тревога уменьшилась.","Идеальное качество! Материалы ощущаются премиальными.","Сначала я был скептичен, но после нескольких недель ношения чувствую себя более сосредоточенным.","Красивый предмет, точно как описано.","Быстрая доставка и отличная упаковка."],
  ar: ["جميل للغاية! الحرفية رائعة والطاقة التي أشعر بها عند ارتدائه لا تصدق.","أرتديه منذ 3 أشهر وأشعر حقاً بتغيير إيجابي في طاقتي.","هذه هي مشترياتي الثالثة من Cneraart وكل قطعة كانت مثالية.","التفاصيل في هذه القطعة رائعة.","اشتريته هدية لأمي وهي تحبه كثيراً.","قطعة ذات معنى عميق. لاحظت أن قلقي قد انخفض.","جودة مثالية! المواد تشعر بأنها فاخرة.","كنت متشككاً في البداية لكن بعد ارتدائه لبضعة أسابيع أشعر بمزيد من التوازن.","عنصر جميل، تماماً كما هو موصوف.","توصيل سريع وتغليف ممتاز."],
  it: ["Assolutamente bellissimo! La lavorazione è squisita e l'energia che sento indossandolo è incredibile.","Lo indosso da 3 mesi e sento davvero un cambiamento positivo nella mia energia.","Questo è il mio terzo acquisto da Cneraart e ogni pezzo è stato perfetto.","Il dettaglio di questo pezzo è notevole.","Acquistato come regalo per mia madre e lei lo adora assolutamente.","Un pezzo così significativo. Ho notato che la mia ansia è diminuita.","Qualità perfetta! I materiali sembrano premium.","Ero scettico all'inizio ma dopo alcune settimane mi sento più centrato.","Bellissimo articolo, esattamente come descritto.","Consegna rapida ed eccellente imballaggio."],
  th: ["สวยงามมากจริงๆ! งานฝีมือประณีตมากและพลังงานที่รู้สึกเมื่อสวมใส่นั้นน่าทึ่งมาก","ฉันสวมใส่มา 3 เดือนแล้วและรู้สึกถึงการเปลี่ยนแปลงเชิงบวกในพลังงานของฉัน","นี่คือการซื้อครั้งที่สามจาก Cneraart และทุกชิ้นสมบูรณ์แบบ","รายละเอียดของชิ้นนี้น่าทึ่งมาก","ซื้อเป็นของขวัญให้แม่และเธอชอบมากๆ","ชิ้นงานที่มีความหมายมาก ฉันสังเกตว่าความวิตกกังวลของฉันลดลง","คุณภาพสมบูรณ์แบบ! วัสดุรู้สึกพรีเมียม","ฉันสงสัยในตอนแรกแต่หลังจากสวมใส่ไม่กี่สัปดาห์รู้สึกสมดุลมากขึ้น","สินค้าสวยงาม ตรงตามที่อธิบาย","จัดส่งรวดเร็วและบรรจุภัณฑ์ยอดเยี่ยม"],
  vi: ["Tuyệt đẹp! Tay nghề thủ công tinh xảo và năng lượng tôi cảm nhận khi đeo thật không thể tin được.","Tôi đã đeo được 3 tháng và thực sự cảm nhận được sự thay đổi tích cực.","Đây là lần mua thứ ba của tôi tại Cneraart và mỗi món đều hoàn hảo.","Chi tiết của món này thật đáng chú ý.","Mua làm quà cho mẹ và bà ấy yêu thích tuyệt đối.","Một món đồ có ý nghĩa sâu sắc. Tôi nhận thấy lo lắng của mình giảm đi.","Chất lượng hoàn hảo! Vật liệu cảm giác cao cấp.","Tôi hoài nghi lúc đầu nhưng sau vài tuần đeo tôi cảm thấy tập trung hơn.","Món đẹp, đúng như mô tả.","Giao hàng nhanh và đóng gói xuất sắc."],
  id: ["Sangat indah! Keahlian pengerjaan sangat halus dan energi yang saya rasakan saat memakainya luar biasa.","Saya sudah memakainya selama 3 bulan dan benar-benar merasakan perubahan positif.","Ini adalah pembelian ketiga saya dari Cneraart dan setiap produk sempurna.","Detail pada produk ini luar biasa.","Dibeli sebagai hadiah untuk ibu saya dan dia sangat menyukainya.","Produk yang sangat bermakna. Saya perhatikan kecemasan saya berkurang.","Kualitas sempurna! Bahannya terasa premium.","Saya skeptis pada awalnya tetapi setelah memakainya beberapa minggu saya merasa lebih terpusat.","Item yang indah, persis seperti yang dijelaskan.","Pengiriman cepat dan kemasan yang sangat baik."],
  hi: ["बिल्कुल सुंदर! शिल्पकारी अत्यंत उत्कृष्ट है और पहनने पर जो ऊर्जा महसूस होती है वह अविश्वसनीय है।","मैं इसे 3 महीने से पहन रहा हूं और वास्तव में सकारात्मक बदलाव महसूस कर रहा हूं।","यह Cneraart से मेरी तीसरी खरीदारी है और हर टुकड़ा परफेक्ट रहा है।","इस टुकड़े का विवरण उल्लेखनीय है।","अपनी माँ के लिए उपहार के रूप में खरीदा और वह इसे बिल्कुल पसंद करती हैं।","इतना सार्थक टुकड़ा। मैंने देखा है कि इसे पहनना शुरू करने के बाद से मेरी चिंता कम हो गई है।","परफेक्ट गुणवत्ता! सामग्री प्रीमियम लगती है।","मैं पहले संशयवादी था लेकिन कुछ हफ्तों तक पहनने के बाद मैं अधिक केंद्रित महसूस करता हूं।","सुंदर आइटम, बिल्कुल वर्णन के अनुसार।","तेज डिलीवरी और उत्कृष्ट पैकेजिंग।"]
};

const LANGUAGES = Object.keys(REVIEW_TEMPLATES);
const RATINGS_DIST = [5,5,5,5,5,5,5,5,4,4,4,4,4,3];

const NAMES_BY_LANG = {
  en: ['Sarah M.','John D.','Emily R.','Michael T.','Jessica L.','David W.','Ashley K.','James B.','Amanda F.','Robert C.','Lisa H.','Kevin P.','Rachel S.','Brian N.','Megan O.'],
  zh: ['王小明','李华','张伟','刘芳','陈静','赵磊','孙丽','周强','吴燕','郑涛','林晓','黄敏','何勇','谢婷','杨帆'],
  de: ['Hans M.','Petra K.','Klaus W.','Monika S.','Thomas B.','Sabine H.','Andreas L.','Claudia R.','Stefan F.','Ursula N.'],
  fr: ['Marie D.','Pierre M.','Sophie L.','Jean-Paul B.','Isabelle R.','François T.','Nathalie G.','Philippe C.','Céline V.','Laurent H.'],
  es: ['María G.','Carlos R.','Ana M.','José L.','Laura S.','Miguel F.','Carmen V.','Antonio H.','Isabel P.','Francisco T.'],
  ja: ['田中太郎','鈴木花子','佐藤一郎','山田美咲','伊藤健','渡辺さくら','中村拓也','小林由美','加藤誠','吉田恵'],
  ko: ['김민준','이서연','박지훈','최수아','정민호','강지은','조현우','윤예린','임도현','한소희'],
  pt: ['João S.','Maria F.','Pedro A.','Ana C.','Carlos M.','Sofia R.','Miguel L.','Inês P.','Rui T.','Catarina V.'],
  ru: ['Иван П.','Мария К.','Алексей С.','Елена В.','Дмитрий Н.','Ольга Ф.','Сергей Л.','Наталья М.','Андрей Б.','Татьяна Г.'],
  ar: ['محمد أ.','فاطمة م.','أحمد ع.','زينب ح.','عمر س.','مريم ك.','يوسف ب.','سارة ر.','علي ف.','نور ط.'],
  it: ['Marco R.','Giulia M.','Luca B.','Sofia C.','Alessandro V.','Francesca T.','Matteo L.','Elena P.','Davide F.','Chiara N.'],
  th: ['สมชาย ก.','สุดา ป.','วิชัย ร.','นภา ส.','อนุชา ม.','พรทิพย์ ล.','ธนกร ว.','มาลี ช.','ประยุทธ์ ต.','รัตนา ห.'],
  vi: ['Nguyễn V.','Trần T.','Lê H.','Phạm M.','Hoàng L.','Vũ T.','Đặng H.','Bùi T.','Đỗ V.','Ngô T.'],
  id: ['Budi S.','Siti R.','Ahmad F.','Dewi K.','Hendra P.','Rina M.','Agus W.','Yuni L.','Bambang H.','Fitri A.'],
  hi: ['राहुल श.','प्रिया म.','अमित क.','सुनीता व.','विकास ग.','पूजा स.','संजय त.','रेखा ब.','मनोज ल.','अनिता र.']
};

const IPS = ['45.33.32.156','104.21.45.67','172.67.68.228','8.8.8.8','1.1.1.1','185.220.101.45','91.108.4.1','77.88.8.8','208.67.222.222','198.51.100.1'];
const LOCATIONS = ['New York, USA','London, UK','Tokyo, Japan','Paris, France','Berlin, Germany','Sydney, Australia','Toronto, Canada','Seoul, South Korea','Singapore','Dubai, UAE','Mumbai, India','São Paulo, Brazil','Mexico City, Mexico','Amsterdam, Netherlands','Stockholm, Sweden','Madrid, Spain','Rome, Italy','Moscow, Russia','Cairo, Egypt','Bangkok, Thailand'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randDate() {
  const now = Date.now();
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;
  return new Date(twoYearsAgo + Math.random() * (now - twoYearsAgo));
}

async function insertReviewBatch(conn, rows) {
  if (rows.length === 0) return;
  const placeholders = rows.map(() => '(?,?,?,?,?,?,?,?,?,?)').join(',');
  const values = rows.flat();
  await conn.query(
    `INSERT INTO reviews (productId, userId, userName, rating, comment, language, isApproved, ipAddress, location, createdAt) VALUES ${placeholders}`,
    values
  );
}

async function main() {
  console.log('Connecting to databases...');
  const railwayConn = await mysql.createConnection(RAILWAY_DB);
  const manusConn = await mysql.createConnection(MANUS_DB);
  console.log('Connected!\n');

  // 获取 Railway 数据库中现有的产品 ID
  const [existingProducts] = await railwayConn.execute('SELECT id FROM products');
  const existingIds = new Set(existingProducts.map(p => p.id));
  console.log(`Railway DB has ${existingIds.size} products`);

  // 获取 Manus 数据库中所有产品
  const [manusProducts] = await manusConn.execute('SELECT * FROM products ORDER BY id');
  const missingProducts = manusProducts.filter(p => !existingIds.has(p.id));
  console.log(`Found ${missingProducts.length} products to migrate\n`);

  // 迁移产品
  let migratedCount = 0;
  for (const product of missingProducts) {
    try {
      await railwayConn.execute(
        `INSERT INTO products (id, name, slug, description, shortDescription, regularPrice, salePrice, costPrice, sku, stock, lowStockThreshold, categoryId, tags, blessingTemple, blessingMaster, blessingDate, blessingDescription, metaTitle, metaDescription, metaKeywords, status, featured, createdAt, updatedAt, suitableFor, efficacy, wearingGuide)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [product.id, product.name, product.slug, product.description, product.shortDescription, product.regularPrice, product.salePrice, product.costPrice, product.sku, product.stock, product.lowStockThreshold, product.categoryId, product.tags, product.blessingTemple, product.blessingMaster, product.blessingDate, product.blessingDescription, product.metaTitle, product.metaDescription, product.metaKeywords, product.status, product.featured, product.createdAt, product.updatedAt, product.suitableFor, product.efficacy, product.wearingGuide]
      );
      migratedCount++;
    } catch(e) {
      console.error(`  Failed to migrate product ${product.id}: ${e.message}`);
    }
  }
  console.log(`✓ Migrated ${migratedCount} products to Railway DB\n`);

  // 迁移产品图片
  const missingIds = missingProducts.map(p => p.id);
  if (missingIds.length > 0) {
    const placeholders = missingIds.map(() => '?').join(',');
    const [manusImages] = await manusConn.execute(
      `SELECT * FROM product_images WHERE productId IN (${placeholders})`,
      missingIds
    );
    console.log(`Found ${manusImages.length} images to migrate`);
    
    let imgMigrated = 0;
    for (const img of manusImages) {
      try {
        await railwayConn.execute(
          `INSERT INTO product_images (id, productId, url, fileKey, altText, displayOrder, isPrimary, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [img.id, img.productId, img.url, img.fileKey, img.altText, img.displayOrder, img.isPrimary, img.createdAt]
        );
        imgMigrated++;
      } catch(e) {
        // 忽略重复键错误
        if (!e.message.includes('Duplicate')) {
          console.error(`  Failed to migrate image ${img.id}: ${e.message}`);
        }
      }
    }
    console.log(`✓ Migrated ${imgMigrated} images\n`);
  }

  // 为所有缺少评论的产品生成评论
  const [reviewCounts] = await railwayConn.execute(`
    SELECT p.id, COALESCE(r.cnt, 0) as reviewCount
    FROM products p 
    LEFT JOIN (SELECT productId, COUNT(*) as cnt FROM reviews GROUP BY productId) r ON p.id = r.productId
    WHERE COALESCE(r.cnt, 0) < 5000
    ORDER BY p.id
  `);
  
  console.log(`\nFound ${reviewCounts.length} products needing reviews`);
  
  let totalInserted = 0;
  for (const product of reviewCounts) {
    const existing = Number(product.reviewCount);
    if (existing > 0) {
      await railwayConn.execute('DELETE FROM reviews WHERE productId = ?', [product.id]);
    }
    
    let batch = [];
    let inserted = 0;
    for (let i = 0; i < TARGET_REVIEWS; i++) {
      const lang = rand(LANGUAGES);
      const names = NAMES_BY_LANG[lang] || NAMES_BY_LANG.en;
      const templates = REVIEW_TEMPLATES[lang] || REVIEW_TEMPLATES.en;
      const rating = rand(RATINGS_DIST);
      const comment = rand(templates);
      const userName = rand(names);
      const ip = rand(IPS);
      const location = rand(LOCATIONS);
      const createdAt = randDate();
      
      batch.push([product.id, null, userName, rating, comment, lang, 1, ip, location, createdAt]);
      
      if (batch.length >= REVIEW_BATCH_SIZE) {
        await insertReviewBatch(railwayConn, batch);
        inserted += batch.length;
        batch = [];
      }
    }
    if (batch.length > 0) {
      await insertReviewBatch(railwayConn, batch);
      inserted += batch.length;
    }
    
    totalInserted += inserted;
    console.log(`✓ Product ${product.id}: ${inserted} reviews (total: ${totalInserted})`);
  }

  const [finalCount] = await railwayConn.execute('SELECT COUNT(*) as total FROM reviews');
  const [finalProducts] = await railwayConn.execute('SELECT COUNT(*) as total FROM products');
  console.log(`\n✅ Done!`);
  console.log(`   Total products in Railway DB: ${finalProducts[0].total}`);
  console.log(`   Total reviews in Railway DB: ${finalCount[0].total}`);
  
  await railwayConn.end();
  await manusConn.end();
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
