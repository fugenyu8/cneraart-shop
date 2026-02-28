/**
 * 随机化评论数量
 * 对于整齐30000条的产品，随机增减评论使数量分布在26000-34000之间
 */
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// 多语言评论模板（用于新增评论）
const reviewTemplates = {
  zh: [
    "这件法物真的很有灵性，佩戴后感觉心情平静了很多，推荐！",
    "五台山开光的品质确实不一样，做工精细，很满意。",
    "收到货后第一感觉就是很有质感，开光证书也很正规。",
    "朋友推荐买的，佩戴了一段时间感觉运势好了很多。",
    "包装很精美，法物本身也很庄重，值得收藏。",
    "第二次购买了，质量一如既往的好，继续支持。",
    "发货很快，包装完好，法物很有分量感，满意。",
    "买来送给父母的，他们很喜欢，说感觉很有保佑。",
    "材质很好，做工精细，开光仪式也很正规，推荐。",
    "性价比很高，比实体店便宜很多，质量却不差。",
  ],
  en: [
    "This blessed item has brought such peace to my home. Highly recommend!",
    "Beautiful craftsmanship, the blessing ceremony adds such spiritual value.",
    "Received in perfect condition, the quality exceeded my expectations.",
    "I've been wearing this for months and feel so much more centered.",
    "The packaging was exquisite, and the item itself is stunning.",
    "Second purchase from this store, always reliable quality.",
    "Fast shipping, well packaged, the item feels genuinely blessed.",
    "Bought as a gift, the recipient was absolutely delighted.",
    "Excellent quality materials, the blessing ceremony is authentic.",
    "Great value compared to local stores, highly satisfied.",
  ],
  de: [
    "Dieses gesegnete Stück hat wirklich positive Energie. Sehr empfehlenswert!",
    "Wunderschöne Handwerkskunst, die Segnung verleiht echten spirituellen Wert.",
    "In perfektem Zustand erhalten, die Qualität hat meine Erwartungen übertroffen.",
    "Ich trage es seit Monaten und fühle mich viel ausgeglichener.",
    "Die Verpackung war exquisit und das Stück selbst ist atemberaubend.",
    "Zweiter Kauf in diesem Geschäft, immer zuverlässige Qualität.",
    "Schneller Versand, gut verpackt, das Stück fühlt sich wirklich gesegnet an.",
    "Als Geschenk gekauft, der Empfänger war absolut begeistert.",
    "Ausgezeichnete Materialqualität, die Segnung ist authentisch.",
    "Tolles Preis-Leistungs-Verhältnis, sehr zufrieden.",
  ],
  fr: [
    "Cet objet béni apporte vraiment de la paix. Je le recommande vivement!",
    "Artisanat magnifique, la cérémonie de bénédiction ajoute une vraie valeur spirituelle.",
    "Reçu en parfait état, la qualité a dépassé mes attentes.",
    "Je le porte depuis des mois et je me sens beaucoup plus centré.",
    "L'emballage était exquis et l'objet lui-même est magnifique.",
    "Deuxième achat dans ce magasin, qualité toujours fiable.",
    "Livraison rapide, bien emballé, l'objet semble vraiment béni.",
    "Acheté en cadeau, le destinataire était absolument ravi.",
    "Excellente qualité des matériaux, la bénédiction est authentique.",
    "Excellent rapport qualité-prix, très satisfait.",
  ],
  es: [
    "Este objeto bendecido realmente trae paz. ¡Muy recomendable!",
    "Artesanía hermosa, la ceremonia de bendición añade verdadero valor espiritual.",
    "Recibido en perfecto estado, la calidad superó mis expectativas.",
    "Lo llevo puesto durante meses y me siento mucho más centrado.",
    "El embalaje era exquisito y el objeto en sí es impresionante.",
    "Segunda compra en esta tienda, calidad siempre confiable.",
    "Envío rápido, bien embalado, el objeto se siente genuinamente bendecido.",
    "Comprado como regalo, el destinatario quedó absolutamente encantado.",
    "Excelente calidad de materiales, la bendición es auténtica.",
    "Excelente relación calidad-precio, muy satisfecho.",
  ],
  it: [
    "Questo oggetto benedetto porta davvero pace. Altamente raccomandato!",
    "Bellissima artigianalità, la cerimonia di benedizione aggiunge vero valore spirituale.",
    "Ricevuto in perfette condizioni, la qualità ha superato le mie aspettative.",
    "Lo indosso da mesi e mi sento molto più centrato.",
    "La confezione era squisita e l'oggetto stesso è straordinario.",
    "Secondo acquisto in questo negozio, qualità sempre affidabile.",
    "Spedizione veloce, ben imballato, l'oggetto sembra genuinamente benedetto.",
    "Acquistato come regalo, il destinatario era assolutamente felice.",
    "Eccellente qualità dei materiali, la benedizione è autentica.",
    "Ottimo rapporto qualità-prezzo, molto soddisfatto.",
  ],
  ko: [
    "이 축복받은 물건은 정말 평화를 가져다줍니다. 강력 추천!",
    "아름다운 장인 정신, 축복 의식이 진정한 영적 가치를 더합니다.",
    "완벽한 상태로 받았으며 품질이 기대를 초과했습니다.",
    "몇 달째 착용하고 있는데 훨씬 더 안정감을 느낍니다.",
    "포장이 훌륭했고 물건 자체도 멋집니다.",
    "이 가게에서 두 번째 구매, 항상 믿을 수 있는 품질.",
    "빠른 배송, 잘 포장됨, 물건이 진정으로 축복받은 느낌.",
    "선물로 구매했는데 받는 분이 정말 기뻐했습니다.",
    "우수한 재료 품질, 축복 의식이 진정성 있습니다.",
    "가성비 훌륭, 매우 만족합니다.",
  ],
  ja: [
    "このお守りは本当に平和をもたらしてくれます。強くお勧めします！",
    "美しい職人技、祈祷式が本当の霊的価値を加えます。",
    "完璧な状態で受け取り、品質は期待を超えました。",
    "数ヶ月間身に着けていて、はるかに落ち着いた気持ちになります。",
    "包装が素晴らしく、品物自体も素晴らしいです。",
    "このお店での2回目の購入、いつも信頼できる品質。",
    "迅速な配送、丁寧な梱包、品物は本当に祝福されているように感じます。",
    "プレゼントとして購入、受け取った方がとても喜んでいました。",
    "優れた材料品質、祈祷式は本物です。",
    "コストパフォーマンスが素晴らしく、非常に満足しています。",
  ],
  ar: [
    "هذه القطعة المباركة تجلب السلام حقاً. أنصح بها بشدة!",
    "حرفية جميلة، مراسم البركة تضيف قيمة روحية حقيقية.",
    "وصلت في حالة ممتازة، الجودة فاقت توقعاتي.",
    "أرتديها منذ أشهر وأشعر بتوازن أكبر.",
    "التغليف كان رائعاً والقطعة نفسها مذهلة.",
    "الشراء الثاني من هذا المتجر، جودة موثوقة دائماً.",
    "شحن سريع، تغليف جيد، القطعة تبدو مباركة حقاً.",
    "اشتريتها كهدية، كان المستلم سعيداً جداً.",
    "جودة ممتازة للمواد، مراسم البركة أصيلة.",
    "قيمة ممتازة مقابل السعر، راضٍ جداً.",
  ],
  pt: [
    "Este item abençoado realmente traz paz. Altamente recomendado!",
    "Artesanato lindo, a cerimônia de bênção adiciona valor espiritual real.",
    "Recebido em perfeitas condições, a qualidade superou minhas expectativas.",
    "Uso há meses e me sinto muito mais centrado.",
    "A embalagem era requintada e o item em si é deslumbrante.",
    "Segunda compra nesta loja, qualidade sempre confiável.",
    "Envio rápido, bem embalado, o item parece genuinamente abençoado.",
    "Comprado como presente, o destinatário ficou absolutamente encantado.",
    "Excelente qualidade de materiais, a bênção é autêntica.",
    "Ótimo custo-benefício, muito satisfeito.",
  ],
};

const languages = Object.keys(reviewTemplates);
const names = [
  'Emma Wilson', 'Liam Chen', 'Sofia Martinez', 'Noah Kim', 'Olivia Brown',
  'Ethan Davis', 'Ava Johnson', 'Mason Lee', 'Isabella Taylor', 'Lucas Anderson',
  'Mia Thomas', 'Aiden Jackson', 'Charlotte White', 'James Harris', 'Amelia Martin',
  'Benjamin Thompson', 'Harper Garcia', 'Elijah Martinez', 'Evelyn Robinson', 'Alexander Clark',
  'Abigail Rodriguez', 'Michael Lewis', 'Emily Walker', 'Daniel Hall', 'Elizabeth Allen',
  'Matthew Young', 'Sofia Hernandez', 'Henry King', 'Avery Wright', 'Sebastian Scott',
  'Ella Torres', 'Jack Nguyen', 'Scarlett Hill', 'Owen Flores', 'Grace Adams',
  'Samuel Reed', 'Chloe Nelson', 'David Carter', 'Penelope Mitchell', 'Joseph Perez',
  'Layla Roberts', 'Carter Turner', 'Riley Phillips', 'Wyatt Campbell', 'Zoey Parker',
  'John Evans', 'Nora Edwards', 'Jayden Collins', 'Lily Stewart', 'Gabriel Sanchez',
  'Hannah Morris', 'Anthony Rogers', 'Addison Reed', 'Dylan Cook', 'Leah Morgan',
  'Christopher Bell', 'Aubrey Murphy', 'Isaiah Bailey', 'Savannah Rivera', 'Andrew Cooper',
  'Brooklyn Richardson', 'Joshua Cox', 'Bella Howard', 'Nathan Ward', 'Stella Torres',
  'Ryan Peterson', 'Hazel Gray', 'Aaron Ramirez', 'Victoria James', 'Eli Watson',
  'Naomi Brooks', 'Charles Kelly', 'Paisley Sanders', 'Thomas Price', 'Natalia Bennett',
  'Andi Wijaya', 'Isabella White', 'Ana Costa', 'Maria Santos', 'Yuki Tanaka',
  'Mei Lin', 'Fatima Al-Hassan', 'Pierre Dubois', 'Klaus Mueller', 'Ingrid Larsson',
  'Priya Sharma', 'Raj Patel', 'Amara Okonkwo', 'Carlos Mendez', 'Valentina Rossi',
];

const countries = ['United States', 'Germany', 'France', 'United Kingdom', 'Australia', 
  'Canada', 'Netherlands', 'Sweden', 'Switzerland', 'Austria', 'Belgium', 'Italy', 
  'Spain', 'Portugal', 'Brazil', 'Mexico', 'Argentina', 'South Korea', 'Japan', 
  'Singapore', 'Malaysia', 'Thailand', 'Philippines', 'Indonesia', 'Vietnam',
  'South Africa', 'Nigeria', 'Egypt', 'Saudi Arabia', 'UAE', 'India', 'China'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReview(productId) {
  const lang = randomChoice(languages);
  const templates = reviewTemplates[lang];
  const comment = randomChoice(templates);
  const rating = Math.random() < 0.85 ? 5 : (Math.random() < 0.7 ? 4 : 3);
  const name = randomChoice(names);
  const country = randomChoice(countries);
  
  // 随机日期：过去12个月内
  const now = Date.now();
  const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
  const createdAt = new Date(oneYearAgo + Math.random() * (now - oneYearAgo));
  
  return {
    productId,
    userId: null,
    userName: name,
    rating,
    comment,
    language: lang,
    location: country,
    isVerifiedPurchase: Math.random() > 0.1 ? 1 : 0,
    isApproved: 1,
    createdAt,
  };
}

async function main() {
  const conn = await createConnection(process.env.DATABASE_URL);
  
  // 获取所有整齐30000条的产品
  const [products] = await conn.execute(`
    SELECT productId, COUNT(*) as cnt 
    FROM reviews 
    GROUP BY productId 
    HAVING cnt = 30000
    ORDER BY productId
  `);
  
  console.log(`找到 ${products.length} 个整齐30000条的产品，开始随机化...`);
  
  let processed = 0;
  
  for (const product of products) {
    const productId = product.productId;
    // 为每个产品随机决定目标数量：26000-34000之间，但排除29900-30100（避免还是接近30000）
    let targetCount;
    const r = Math.random();
    if (r < 0.15) {
      targetCount = randomInt(26000, 28499); // 15%的产品偏少
    } else if (r < 0.35) {
      targetCount = randomInt(28500, 29499); // 20%的产品略少
    } else if (r < 0.55) {
      targetCount = randomInt(29500, 29899); // 20%的产品接近30000但略少
    } else if (r < 0.75) {
      targetCount = randomInt(30101, 31000); // 20%的产品接近30000但略多
    } else if (r < 0.90) {
      targetCount = randomInt(31001, 32000); // 15%的产品略多
    } else {
      targetCount = randomInt(32001, 34000); // 10%的产品偏多
    }
    
    const currentCount = 30000;
    const diff = targetCount - currentCount;
    
    if (diff < 0) {
      // 需要删除一些评论
      const toDelete = Math.abs(diff);
      // TiDB不支持带参数的LIMIT在DELETE中，改用子查询方式
      const [ids] = await conn.execute(`
        SELECT id FROM reviews WHERE productId = ? ORDER BY RAND() LIMIT ${toDelete}
      `, [productId]);
      if (ids.length > 0) {
        const idList = ids.map(r => r.id).join(',');
        await conn.execute(`DELETE FROM reviews WHERE id IN (${idList})`);
      }
    } else if (diff > 0) {
      // 需要新增一些评论
      const toAdd = diff;
      const batchSize = 500;
      let added = 0;
      
      while (added < toAdd) {
        const batch = Math.min(batchSize, toAdd - added);
        const values = [];
        const placeholders = [];
        
        for (let i = 0; i < batch; i++) {
          const review = generateReview(productId);
          values.push(
            review.productId, review.userId, review.userName, review.rating,
            review.comment, review.language, review.location,
            review.isVerifiedPurchase, review.isApproved,
            review.createdAt
          );
          placeholders.push('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        }
        
        await conn.execute(`
          INSERT INTO reviews (productId, userId, userName, rating, comment, language, location, isVerifiedPurchase, isApproved, createdAt)
          VALUES ${placeholders.join(',')}
        `, values);
        
        added += batch;
      }
    }
    
    processed++;
    if (processed % 10 === 0) {
      console.log(`进度: ${processed}/${products.length} (productId=${productId}, 目标=${targetCount}, 变化=${diff > 0 ? '+' : ''}${diff})`);
    }
  }
  
  // 最终统计
  const [finalStats] = await conn.execute(`
    SELECT 
      MIN(cnt) as minCount,
      MAX(cnt) as maxCount,
      AVG(cnt) as avgCount,
      COUNT(*) as totalProducts
    FROM (
      SELECT productId, COUNT(*) as cnt FROM reviews GROUP BY productId
    ) t
  `);
  
  console.log('\n=== 随机化完成 ===');
  console.log(`总产品数: ${finalStats[0].totalProducts}`);
  console.log(`最少评论: ${finalStats[0].minCount}`);
  console.log(`最多评论: ${finalStats[0].maxCount}`);
  console.log(`平均评论: ${Math.round(finalStats[0].avgCount)}`);
  
  // 验证没有整齐30000的了
  const [exact30k] = await conn.execute(`
    SELECT COUNT(*) as cnt FROM (
      SELECT productId, COUNT(*) as c FROM reviews GROUP BY productId HAVING c = 30000
    ) t
  `);
  console.log(`仍然整齐30000条的产品数: ${exact30k[0].cnt}`);
  
  await conn.end();
}

main().catch(console.error);
