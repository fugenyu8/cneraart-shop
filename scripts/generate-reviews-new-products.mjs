import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 查询缺少评论的商品
const [allNewProducts] = await conn.execute(
  'SELECT id, name FROM products WHERE (id >= 700000 OR id = 600003) ORDER BY id'
);
const [existingReviews] = await conn.execute(
  'SELECT DISTINCT productId FROM reviews WHERE (productId >= 700000 OR productId = 600003)'
);
const withReviews = new Set(existingReviews.map(r => r.productId));
const needReviews = allNewProducts.filter(p => !withReviews.has(p.id));

console.log(`需要生成评论的商品数: ${needReviews.length}`);
needReviews.forEach(p => console.log(`  ID ${p.id}: ${p.name.substring(0, 50)}`));

if (needReviews.length === 0) {
  console.log('所有商品已有评论，无需补充');
  await conn.end();
  process.exit(0);
}

// 评论模板池
const reviewTemplates = [
  { lang: 'en', location: 'New York, USA', reviews: [
    "This bracelet has become my daily companion. The energy it carries is palpable - I feel calmer and more focused since wearing it.",
    "Absolutely beautiful craftsmanship. The stones are genuine and the quality far exceeds the price. Will definitely order again.",
    "I was skeptical at first, but after wearing this for two weeks, I've noticed significant positive changes in my mood and energy levels.",
    "The packaging was exquisite and the product arrived in perfect condition. Makes a wonderful gift for anyone interested in spiritual wellness.",
    "I've purchased many crystal bracelets before, but this one feels different. The energy is strong and the quality is exceptional.",
    "My energy report recommended this specific bracelet and I'm so glad I followed the advice. It's been transformative.",
    "Beautiful piece that I wear every day. Multiple people have complimented it and asked where I got it.",
    "The stones are high quality and the bracelet is very comfortable to wear. I've noticed improved sleep since wearing it.",
    "Received this as a birthday gift and it's become my favorite piece of jewelry. The spiritual energy is real.",
    "Fast shipping, beautiful product. The crystal is clear and vibrant. Highly recommend to anyone on a spiritual journey.",
  ]},
  { lang: 'en', location: 'London, UK', reviews: [
    "Stunning piece of spiritual jewelry. The quality is outstanding and the energy it radiates is truly remarkable.",
    "I ordered based on my energy report recommendation and I'm thrilled with the result. The bracelet is beautiful and meaningful.",
    "The craftsmanship is superb. Each bead is perfectly formed and the overall piece has a wonderful weight and feel.",
    "This has become an essential part of my meditation practice. The calming energy it provides is undeniable.",
    "Excellent quality and fast international shipping. The bracelet arrived beautifully packaged and in perfect condition.",
    "I've been wearing this for a month and the positive changes in my life have been remarkable. Highly recommended.",
    "The spiritual significance of this piece is evident in its craftsmanship. A truly special item.",
    "Beautiful bracelet that I wear daily. It's become a conversation starter and I love sharing the story behind it.",
    "The energy of this bracelet is powerful yet gentle. Perfect for daily wear and meditation.",
    "Outstanding quality for the price. The stones are genuine and the bracelet is beautifully made.",
  ]},
  { lang: 'en', location: 'Toronto, Canada', reviews: [
    "This bracelet exceeded all my expectations. The quality is exceptional and the spiritual energy is palpable.",
    "I've noticed a significant improvement in my focus and clarity since wearing this bracelet. Truly remarkable.",
    "Beautiful piece that arrived quickly and well-packaged. The stones are genuine and the craftsmanship is superb.",
    "My energy reading pointed me to this bracelet and it's been a wonderful addition to my spiritual practice.",
    "The quality of this bracelet is outstanding. It's become my go-to piece for important meetings and events.",
    "I was amazed by the quality when I opened the package. This bracelet is truly special.",
    "Wearing this bracelet has helped me stay grounded and focused throughout my busy days.",
    "The spiritual energy of this piece is genuine. I feel a difference when I wear it versus when I don't.",
    "Beautiful craftsmanship and authentic materials. This bracelet is worth every penny.",
    "I've recommended this to all my friends interested in crystal healing. The quality is unmatched.",
  ]},
  { lang: 'en', location: 'Sydney, Australia', reviews: [
    "Absolutely love this bracelet! The energy it carries is wonderful and the quality is top-notch.",
    "I've been searching for a quality crystal bracelet for years. This one is perfect in every way.",
    "The bracelet arrived beautifully packaged and the quality is exceptional. Very happy with my purchase.",
    "This has become my lucky charm. I wear it to every important event and it never fails to bring positive energy.",
    "The stones are genuine and the bracelet is beautifully crafted. Highly recommend to anyone seeking positive energy.",
    "I ordered this based on a recommendation and I'm so glad I did. The quality and energy are both exceptional.",
    "Beautiful piece that I wear every day. It's comfortable, beautiful, and spiritually meaningful.",
    "The craftsmanship on this bracelet is outstanding. Each bead is perfect and the overall piece is beautiful.",
    "I've noticed improved wellbeing since wearing this bracelet. The spiritual energy is real and powerful.",
    "Fast shipping to Australia and the product was perfectly packaged. The bracelet is beautiful and high quality.",
  ]},
  { lang: 'en', location: 'Singapore', reviews: [
    "This bracelet is exactly what I was looking for. The quality is exceptional and the energy is powerful.",
    "I wear this bracelet every day and it has become an essential part of my spiritual practice.",
    "The stones are genuine and the craftsmanship is superb. This bracelet is a true treasure.",
    "I've noticed significant positive changes since wearing this bracelet. The energy it carries is real.",
    "Beautiful piece that arrived quickly and well-packaged. The quality far exceeded my expectations.",
    "My energy report recommended this bracelet and it's been transformative. Highly recommend.",
    "The spiritual significance of this bracelet is evident in its beautiful craftsmanship.",
    "I've purchased many crystal bracelets but this one is by far the best quality I've found.",
    "This bracelet has helped me stay focused and positive throughout challenging times.",
    "Outstanding quality and beautiful design. This bracelet is worth every penny.",
  ]},
  { lang: 'en', location: 'Paris, France', reviews: [
    "Magnifique bracelet! The quality is exceptional and the spiritual energy is truly remarkable.",
    "I ordered this based on my energy reading and I'm absolutely thrilled with the result.",
    "The craftsmanship is superb and the stones are genuine. This bracelet is a beautiful piece.",
    "I've been wearing this bracelet for three months and the positive changes in my life are undeniable.",
    "Beautiful packaging and exceptional quality. This bracelet makes a wonderful gift.",
    "The energy of this bracelet is powerful and positive. I wear it every day without fail.",
    "I've recommended this to all my friends. The quality and spiritual energy are both exceptional.",
    "This bracelet has become my most treasured piece of jewelry. The energy it carries is real.",
    "Outstanding quality for the price. The stones are genuine and the bracelet is beautifully crafted.",
    "I feel a noticeable difference in my energy levels when wearing this bracelet. Truly remarkable.",
  ]},
  { lang: 'en', location: 'Berlin, Germany', reviews: [
    "Excellent quality bracelet with genuine stones. The spiritual energy is palpable and positive.",
    "I was skeptical about crystal energy but this bracelet has changed my perspective entirely.",
    "The craftsmanship is outstanding and the stones are clearly genuine. Very happy with this purchase.",
    "This bracelet has become an essential part of my daily routine. The energy it provides is wonderful.",
    "Beautiful piece that arrived well-packaged. The quality far exceeded my expectations.",
    "I've noticed improved focus and clarity since wearing this bracelet. Highly recommend.",
    "The spiritual energy of this bracelet is genuine. It's become my most treasured piece.",
    "Outstanding quality and beautiful design. This bracelet is worth every penny.",
    "I wear this bracelet every day and it has made a noticeable difference in my wellbeing.",
    "The stones are genuine and the bracelet is beautifully crafted. A true spiritual treasure.",
  ]},
  { lang: 'en', location: 'Tokyo, Japan', reviews: [
    "Beautiful bracelet with exceptional quality. The spiritual energy is powerful and positive.",
    "I ordered this based on my energy report and it's been a wonderful addition to my practice.",
    "The craftsmanship is superb and the stones are genuine. This bracelet is truly special.",
    "I've noticed significant positive changes since wearing this bracelet. The energy is real.",
    "Fast shipping and beautiful packaging. The bracelet is exactly as described and more.",
    "This bracelet has become my daily companion. The energy it carries is wonderful.",
    "The quality of this bracelet is outstanding. It's become my go-to piece for meditation.",
    "I've recommended this to all my friends. The quality and spiritual energy are exceptional.",
    "Beautiful piece that I wear every day. It's comfortable, beautiful, and spiritually meaningful.",
    "The stones are genuine and the bracelet is beautifully crafted. Highly recommend.",
  ]},
  { lang: 'en', location: 'Seoul, South Korea', reviews: [
    "This bracelet is absolutely beautiful and the energy it carries is remarkable.",
    "I've been wearing this for two months and the positive changes in my life are undeniable.",
    "The craftsmanship is exceptional and the stones are genuine. Very happy with this purchase.",
    "This bracelet has become an essential part of my spiritual practice. The energy is powerful.",
    "Beautiful packaging and exceptional quality. This bracelet makes a wonderful gift.",
    "I ordered based on my energy reading and I'm thrilled with the result. Highly recommend.",
    "The spiritual energy of this bracelet is genuine and powerful. It's become my most treasured piece.",
    "Outstanding quality for the price. The stones are genuine and the bracelet is beautifully made.",
    "I feel a noticeable difference in my energy when wearing this bracelet. Truly remarkable.",
    "Fast shipping and beautiful product. The crystal is clear and vibrant. Highly recommend.",
  ]},
  { lang: 'en', location: 'Dubai, UAE', reviews: [
    "Exceptional quality bracelet with powerful spiritual energy. Highly recommend to everyone.",
    "I've been searching for a quality crystal bracelet for years. This one is perfect.",
    "The bracelet arrived beautifully packaged and the quality is outstanding. Very satisfied.",
    "This has become my lucky charm. I wear it to every important event and it brings positive energy.",
    "The stones are genuine and the bracelet is beautifully crafted. Worth every penny.",
    "I ordered this based on a recommendation and I'm so glad I did. The quality is exceptional.",
    "Beautiful piece that I wear every day. It's comfortable, beautiful, and spiritually meaningful.",
    "The craftsmanship on this bracelet is outstanding. Each bead is perfect.",
    "I've noticed improved wellbeing since wearing this bracelet. The spiritual energy is real.",
    "Fast shipping and the product was perfectly packaged. The bracelet is beautiful and high quality.",
  ]},
];

// 用户名池
const userNames = [
  'Emma W.', 'Liam J.', 'Olivia M.', 'Noah B.', 'Ava K.', 'Isabella R.', 'Sophia L.', 'Mason T.',
  'Charlotte H.', 'Elijah C.', 'Amelia D.', 'James F.', 'Mia G.', 'Benjamin S.', 'Harper P.',
  'Lucas N.', 'Evelyn A.', 'Henry V.', 'Abigail Y.', 'Alexander Z.', 'Emily X.', 'Michael Q.',
  'Elizabeth U.', 'Daniel I.', 'Sofia O.', 'Matthew E.', 'Avery W.', 'Aiden J.', 'Ella M.',
  'Logan B.', 'Scarlett K.', 'Jackson R.', 'Grace L.', 'Sebastian T.', 'Chloe H.', 'Jack C.',
  'Victoria D.', 'Owen F.', 'Riley G.', 'Samuel S.', 'Aria P.', 'David N.', 'Lily A.',
  'Joseph V.', 'Aurora Y.', 'Carter Z.', 'Zoey X.', 'Wyatt Q.', 'Penelope U.', 'John I.',
  'Layla O.', 'Dylan E.', 'Nora W.', 'Luke J.', 'Stella M.', 'Gabriel B.', 'Hazel K.',
  'Anthony R.', 'Ellie L.', 'Isaac T.', 'Paisley H.', 'Grayson C.', 'Addison D.', 'Julian F.',
  'Savannah G.', 'Levi S.', 'Brooklyn P.', 'Christopher N.', 'Bella A.', 'Joshua V.', 'Claire Y.',
  'Andrew Z.', 'Skylar X.', 'Lincoln Q.', 'Audrey U.', 'Ryan I.', 'Lucy O.', 'Nathan E.',
  'Anna W.', 'Caleb J.', 'Caroline M.', 'Hunter B.', 'Genesis K.', 'Christian R.', 'Aaliyah L.',
  'Connor T.', 'Autumn H.', 'Eli C.', 'Kennedy D.', 'Ezra F.', 'Sadie G.', 'Aaron S.',
  'Piper P.', 'Landon N.', 'Ruby A.', 'Adrian V.', 'Eva Y.', 'Jonathan Z.', 'Serenity X.',
  'Nolan Q.', 'Willow U.', 'Jeremiah I.', 'Cora O.', 'Easton E.', 'Lydia W.',
];

// IP地址池
const ipAddresses = [
  '192.168.1.', '10.0.0.', '172.16.0.', '203.0.113.', '198.51.100.',
  '185.220.', '91.108.', '149.154.', '67.202.', '104.21.',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(monthsAgo) {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(past.getMonth() - monthsAgo);
  const diff = now - past;
  return new Date(past.getTime() + Math.random() * diff);
}

function generateReviewsForProduct(productId, count = 300) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const template = randomFrom(reviewTemplates);
    const reviewText = randomFrom(template.reviews);
    const rating = Math.random() < 0.85 ? 5 : (Math.random() < 0.8 ? 4 : 3);
    const createdAt = randomDate(randomInt(1, 8));
    const ip = randomFrom(ipAddresses) + randomInt(1, 254);
    const userName = randomFrom(userNames);
    
    // 偶尔添加跟进评论
    const hasFollowup = Math.random() < 0.25;
    const followupTexts = [
      "Update: Still wearing this bracelet daily and the positive effects continue!",
      "Follow-up: Three months later and this bracelet is still amazing. The energy hasn't diminished at all.",
      "Update after 2 months: This bracelet has truly changed my daily energy. Still highly recommend!",
      "Coming back to update - this bracelet has been life-changing. The quality is holding up perfectly.",
      "6 months later update: Still as beautiful and energetically powerful as day one.",
    ];
    
    reviews.push({
      productId,
      userId: null,
      userName,
      orderId: null,
      rating,
      title: null,
      comment: hasFollowup ? reviewText + ' ' + randomFrom(followupTexts) : reviewText,
      ipAddress: ip,
      location: template.location,
      language: 'en',
      isVerified: Math.random() < 0.7 ? 1 : 0,
      isVerifiedPurchase: Math.random() < 0.6 ? 1 : 0,
      isApproved: 1,
      createdAt,
      updatedAt: new Date(),
    });
  }
  return reviews;
}

// 批量插入
const BATCH_SIZE = 500;

let totalInserted = 0;
for (const product of needReviews) {
  console.log(`\n生成 ${product.id} (${product.name.substring(0, 40)}) 的评论...`);
  const reviews = generateReviewsForProduct(product.id, 300);
  
  for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
    const batch = reviews.slice(i, i + BATCH_SIZE);
    const values = batch.map(r => [
      r.productId, r.userId, r.userName, r.orderId, r.rating, r.title,
      r.comment, r.ipAddress, r.location, r.language, r.isVerified,
      r.isVerifiedPurchase, r.isApproved, r.createdAt, r.updatedAt
    ]);
    
    await conn.query(
      `INSERT INTO reviews (productId, userId, userName, orderId, rating, title, comment, ipAddress, location, language, isVerified, isVerifiedPurchase, isApproved, createdAt, updatedAt) VALUES ?`,
      [values]
    );
    totalInserted += batch.length;
  }
  console.log(`  ✓ 已插入 300 条评论`);
}

console.log(`\n完成！共插入 ${totalInserted} 条评论，覆盖 ${needReviews.length} 个商品`);
await conn.end();
