import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// ====== GEOGRAPHIC DATA ======
const REGIONS = {
  europe: {
    weight: 0.65,
    countries: [
      { name: 'United Kingdom', lang: 'en', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol', 'Liverpool', 'Leeds', 'Glasgow', 'Cardiff', 'Oxford'], ipPrefix: ['81.', '82.', '83.', '86.', '90.', '92.', '94.', '109.', '176.', '185.', '193.', '212.', '213.'] },
      { name: 'France', lang: 'fr', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Strasbourg', 'Nantes', 'Lille', 'Montpellier'], ipPrefix: ['80.', '81.', '82.', '90.', '91.', '176.', '185.', '193.', '194.', '212.', '213.'] },
      { name: 'Germany', lang: 'de', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Dresden'], ipPrefix: ['80.', '81.', '82.', '84.', '85.', '176.', '178.', '185.', '193.', '212.', '213.'] },
      { name: 'Italy', lang: 'it', cities: ['Rome', 'Milan', 'Florence', 'Venice', 'Naples', 'Turin', 'Bologna', 'Genoa', 'Palermo', 'Verona'], ipPrefix: ['79.', '80.', '81.', '82.', '87.', '151.', '176.', '185.', '193.', '212.', '213.'] },
      { name: 'Spain', lang: 'es', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga', 'Zaragoza', 'Granada', 'Alicante', 'Palma'], ipPrefix: ['80.', '81.', '83.', '84.', '88.', '176.', '185.', '193.', '212.', '213.'] },
      { name: 'Netherlands', lang: 'en', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Leiden', 'Haarlem'], ipPrefix: ['77.', '80.', '81.', '82.', '84.', '176.', '185.', '193.', '212.', '213.'] },
      { name: 'Belgium', lang: 'fr', cities: ['Brussels', 'Antwerp', 'Ghent', 'Bruges', 'Liège', 'Leuven', 'Namur', 'Charleroi'], ipPrefix: ['78.', '79.', '80.', '81.', '82.', '176.', '185.', '193.', '212.', '213.'] },
      { name: 'Switzerland', lang: 'de', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne', 'St. Gallen', 'Lugano'], ipPrefix: ['77.', '78.', '80.', '82.', '85.', '176.', '185.', '193.', '212.', '213.'] },
      { name: 'Austria', lang: 'de', cities: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Linz'], ipPrefix: ['77.', '78.', '80.', '81.', '83.', '176.', '185.', '193.'] },
      { name: 'Portugal', lang: 'pt', cities: ['Lisbon', 'Porto', 'Faro', 'Braga', 'Coimbra'], ipPrefix: ['77.', '79.', '80.', '81.', '82.', '176.', '185.', '193.'] },
      { name: 'Sweden', lang: 'en', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala'], ipPrefix: ['77.', '78.', '80.', '81.', '83.', '176.', '185.', '193.'] },
      { name: 'Poland', lang: 'en', cities: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw', 'Poznan'], ipPrefix: ['77.', '78.', '80.', '81.', '83.', '176.', '185.', '193.'] },
    ],
  },
  asia: {
    weight: 0.20,
    countries: [
      { name: 'China', lang: 'zh', cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hong Kong', 'Chengdu', 'Hangzhou', 'Nanjing', 'Wuhan', 'Xi\'an', 'Suzhou', 'Xiamen'], ipPrefix: ['1.', '14.', '27.', '36.', '42.', '58.', '59.', '60.', '61.', '101.', '106.', '110.', '111.', '112.', '113.', '114.', '115.', '116.', '117.', '118.', '119.', '120.', '121.', '122.', '123.', '124.', '125.', '180.', '182.', '183.'] },
      { name: 'Taiwan', lang: 'zh', cities: ['Taipei', 'Kaohsiung', 'Taichung', 'Tainan'], ipPrefix: ['1.', '14.', '27.', '36.', '42.', '49.', '59.', '60.', '61.', '101.', '106.', '110.', '111.', '114.', '118.', '175.', '180.', '203.'] },
      { name: 'Singapore', lang: 'en', cities: ['Singapore'], ipPrefix: ['1.', '8.', '27.', '42.', '43.', '49.', '103.', '116.', '118.', '119.', '175.', '180.', '202.', '203.'] },
      { name: 'Malaysia', lang: 'en', cities: ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Malacca', 'Kota Kinabalu'], ipPrefix: ['1.', '14.', '27.', '42.', '43.', '49.', '58.', '60.', '103.', '115.', '116.', '175.', '180.', '202.', '203.'] },
      { name: 'Thailand', lang: 'en', cities: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Krabi'], ipPrefix: ['1.', '14.', '27.', '42.', '49.', '58.', '61.', '101.', '103.', '110.', '171.', '175.', '180.', '202.', '203.'] },
      { name: 'Japan', lang: 'ja', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Fukuoka', 'Sapporo'], ipPrefix: ['1.', '14.', '27.', '36.', '42.', '49.', '59.', '60.', '61.', '101.', '106.', '110.', '111.', '114.', '118.', '126.', '133.', '150.', '153.', '157.', '160.', '163.', '175.', '180.', '202.', '203.', '210.', '211.', '218.', '219.', '220.', '221.'] },
      { name: 'South Korea', lang: 'ko', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Jeju'], ipPrefix: ['1.', '14.', '27.', '36.', '42.', '49.', '59.', '61.', '101.', '106.', '110.', '111.', '114.', '118.', '121.', '175.', '180.', '202.', '203.', '210.', '211.', '218.', '219.', '220.', '221.'] },
      { name: 'Vietnam', lang: 'en', cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hue', 'Nha Trang'], ipPrefix: ['1.', '14.', '27.', '42.', '49.', '58.', '113.', '115.', '116.', '117.', '118.', '119.', '120.', '121.', '122.', '123.', '124.', '125.', '171.', '175.', '180.', '202.', '203.'] },
    ],
  },
  usa: {
    weight: 0.15,
    countries: [
      { name: 'United States', lang: 'en', cities: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Seattle', 'Boston', 'Miami', 'Austin', 'Denver', 'Portland', 'Phoenix', 'Dallas', 'Atlanta', 'Philadelphia', 'San Diego', 'Houston', 'Washington DC', 'Minneapolis', 'Nashville', 'Charlotte'], ipPrefix: ['3.', '4.', '12.', '13.', '15.', '16.', '17.', '18.', '20.', '23.', '24.', '32.', '34.', '35.', '38.', '40.', '44.', '45.', '47.', '50.', '52.', '54.', '63.', '64.', '65.', '66.', '67.', '68.', '69.', '70.', '71.', '72.', '73.', '74.', '75.', '76.', '96.', '97.', '98.', '99.', '100.', '104.', '107.', '108.', '128.', '129.', '130.', '131.', '132.', '134.', '135.', '136.', '137.', '138.', '139.', '140.', '141.', '142.', '143.', '144.', '146.', '147.', '148.', '149.', '152.', '155.', '156.', '158.', '159.', '161.', '162.', '164.', '165.', '166.', '167.', '168.', '169.', '170.', '172.', '173.', '174.'] },
      { name: 'Canada', lang: 'en', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'], ipPrefix: ['24.', '64.', '65.', '66.', '67.', '68.', '69.', '70.', '72.', '74.', '76.', '96.', '97.', '99.', '104.', '107.', '108.', '128.', '129.', '130.', '131.', '132.', '134.', '135.', '136.', '137.', '138.', '139.', '140.', '141.', '142.', '143.', '144.', '146.', '147.', '148.', '149.', '152.', '155.', '156.', '158.', '159.', '161.', '162.', '164.', '165.', '166.', '167.', '168.', '169.', '170.', '172.', '173.', '174.', '184.', '192.', '198.', '199.', '204.', '205.', '206.', '207.', '208.', '209.'] },
    ],
  },
};

// ====== USERNAME POOLS ======
const NAMES = {
  en: [
    'John M.', 'Sophie L.', 'Marco R.', 'Emma K.', 'Lucas B.', 'Isabella F.', 'Oliver W.', 'Mia D.',
    'James H.', 'Charlotte P.', 'William S.', 'Amelia T.', 'Benjamin C.', 'Harper V.', 'Elijah N.',
    'Evelyn G.', 'Alexander J.', 'Abigail M.', 'Michael R.', 'Emily W.', 'Daniel K.', 'Elizabeth L.',
    'Henry B.', 'Sofia A.', 'Sebastian F.', 'Avery H.', 'Jack D.', 'Ella S.', 'Owen T.', 'Scarlett C.',
    'Sarah K.', 'David R.', 'Jennifer W.', 'Jessica M.', 'Christopher L.', 'Ashley B.', 'Matthew H.',
    'Amanda T.', 'Joshua S.', 'Melissa C.', 'Andrew F.', 'Stephanie G.', 'Ryan J.', 'Lauren V.',
    'Justin K.', 'Rachel M.', 'Brandon W.', 'Heather L.', 'Nicole P.', 'Thomas E.',
    'Grace N.', 'Lily R.', 'Chloe S.', 'Hannah M.', 'Zoe K.', 'Nora B.', 'Riley T.', 'Aria W.',
    'Penelope D.', 'Layla F.', 'Camila G.', 'Aubrey H.', 'Savannah J.', 'Brooklyn L.', 'Stella M.',
    'Natalie N.', 'Leah P.', 'Hazel R.', 'Violet S.', 'Aurora T.', 'Eleanor V.', 'Anna W.',
    'Liam A.', 'Noah B.', 'Ethan C.', 'Mason D.', 'Logan E.', 'Aiden F.', 'Jackson G.', 'Carter H.',
  ],
  fr: [
    'Marie L.', 'Pierre D.', 'Camille B.', 'Antoine R.', 'Léa M.', 'Hugo T.', 'Chloé P.', 'Louis S.',
    'Manon F.', 'Gabriel V.', 'Emma G.', 'Raphaël N.', 'Inès H.', 'Arthur K.', 'Jade C.', 'Jules A.',
    'Louise D.', 'Luca B.', 'Alice R.', 'Théo M.', 'Zoé T.', 'Nathan P.', 'Léna S.', 'Maxime F.',
    'Clara V.', 'Enzo G.', 'Anna N.', 'Lucas H.', 'Sarah K.', 'Mathis C.', 'Juliette A.', 'Adrien D.',
  ],
  de: [
    'Anna M.', 'Max S.', 'Sophie K.', 'Felix B.', 'Lena W.', 'Paul H.', 'Marie D.', 'Leon T.',
    'Hannah F.', 'Jonas R.', 'Emma G.', 'Tim N.', 'Laura P.', 'Lukas S.', 'Mia K.', 'David B.',
    'Lisa W.', 'Jan H.', 'Julia D.', 'Moritz T.', 'Sarah F.', 'Niklas R.', 'Lea G.', 'Simon N.',
    'Katharina P.', 'Tobias S.', 'Nina K.', 'Alexander B.', 'Elena W.', 'Sebastian H.', 'Johanna D.', 'Florian T.',
  ],
  it: [
    'Marco R.', 'Giulia B.', 'Alessandro M.', 'Francesca L.', 'Lorenzo S.', 'Chiara D.', 'Andrea T.', 'Sara P.',
    'Matteo F.', 'Elena G.', 'Luca N.', 'Valentina H.', 'Davide K.', 'Martina C.', 'Simone A.', 'Alessia D.',
    'Federico B.', 'Giorgia R.', 'Riccardo M.', 'Sofia L.', 'Gabriele S.', 'Anna D.', 'Nicola T.', 'Elisa P.',
  ],
  es: [
    'María G.', 'Carlos R.', 'Ana L.', 'Javier M.', 'Laura S.', 'Pablo D.', 'Carmen T.', 'Diego P.',
    'Lucía F.', 'Alejandro V.', 'Sofía N.', 'Daniel H.', 'Paula K.', 'Adrián C.', 'Elena A.', 'Sergio B.',
    'Marta R.', 'Hugo M.', 'Irene L.', 'Álvaro S.', 'Claudia D.', 'Marcos T.', 'Sara P.', 'Raúl F.',
  ],
  zh: [
    '张**', '李**', '王**', '刘**', '陈**', '杨**', '黄**', '赵**', '吴**', '周**',
    '徐**', '孙**', '马**', '朱**', '胡**', '郭**', '何**', '高**', '林**', '罗**',
    '郑**', '梁**', '谢**', '宋**', '唐**', '韩**', '冯**', '于**', '董**', '萧**',
    '程**', '曹**', '袁**', '邓**', '许**', '傅**', '沈**', '曾**', '彭**', '吕**',
  ],
  ja: [
    '田中 S.', '鈴木 K.', '佐藤 M.', '高橋 Y.', '伊藤 T.', '渡辺 H.', '山本 A.', '中村 R.',
    '小林 N.', '加藤 S.', '吉田 K.', '山田 M.', '松本 Y.', '井上 T.', '木村 H.', '林 A.',
  ],
  ko: [
    '김** ', '이** ', '박** ', '최** ', '정** ', '강** ', '조** ', '윤** ',
    '장** ', '임** ', '한** ', '오** ', '서** ', '신** ', '권** ', '황** ',
  ],
  pt: [
    'João S.', 'Maria L.', 'Pedro R.', 'Ana M.', 'Carlos D.', 'Sofia T.', 'Miguel P.', 'Beatriz F.',
    'Tiago V.', 'Inês G.', 'Diogo N.', 'Mariana H.', 'Rafael K.', 'Leonor C.', 'André A.', 'Catarina B.',
  ],
};

// ====== IP GENERATION ======
function generateIP(country) {
  const prefix = country.ipPrefix[Math.floor(Math.random() * country.ipPrefix.length)];
  const parts = prefix.split('.').filter(p => p !== '');
  while (parts.length < 4) {
    parts.push(String(Math.floor(Math.random() * 256)));
  }
  return parts.join('.');
}

// ====== USERNAME GENERATION ======
function generateUsername(lang) {
  const pool = NAMES[lang] || NAMES['en'];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ====== DATE GENERATION ======
function generateRandomDate() {
  const start = new Date('2025-06-01');
  const end = new Date('2026-02-19');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  return date;
}

// ====== MULTILINGUAL REVIEW TEMPLATES ======
const TEMPLATES = {
  zodiac: {
    en: {
      initial: [
        "I ordered the {product} after reading about Wutai Mountain's blessing traditions. The craftsmanship is remarkable — every detail on the pendant is beautifully carved. I've been wearing it daily and feel a genuine sense of calm and protection.",
        "This {product} exceeded my expectations. The quality is outstanding, and knowing it was blessed at Wutai Mountain gives it special meaning. I've noticed positive changes since I started wearing it.",
        "Beautiful piece! The {product} arrived well-packaged and the pendant itself is stunning. The weight feels substantial and the carving is intricate. Very happy with this purchase.",
        "Purchased the {product} as a gift for my mother. She absolutely loves it. The spiritual significance combined with the beautiful craftsmanship makes it a truly meaningful present.",
        "The {product} is exactly what I was looking for. As someone interested in Eastern spiritual traditions, having a genuine blessed pendant from Wutai Mountain is incredible. Highly recommend.",
        "Wearing the {product} has brought me a sense of peace I didn't expect. The quality is top-notch and the blessing ceremony adds a layer of authenticity that you can't find elsewhere.",
        "I was skeptical at first, but the {product} has genuinely made a difference in my daily life. The energy feels different when I wear it. Beautiful craftsmanship too.",
        "Received my {product} yesterday and I'm impressed. The pendant is heavier than expected (in a good way) and the details are sharp. The certificate of blessing is a nice touch.",
        "Third purchase from this shop. The {product} maintains the same high quality I've come to expect. Each piece feels unique despite being part of a collection.",
        "The {product} is a masterpiece of traditional craftsmanship. I've shown it to friends who are equally impressed. Planning to collect more from this series.",
      ],
      followUp: [
        "Update after {weeks} weeks: The {product} has become my daily companion. I've noticed improvements in my overall wellbeing and sense of direction. The quality hasn't diminished at all.",
        "Follow-up after {weeks} weeks: Still wearing my {product} every day. Several friends have commented on it and asked where to get one. The spiritual energy is real.",
        "{weeks} weeks later: The {product} continues to bring positive energy. I've recommended it to several colleagues who are now also wearing theirs. Truly a special piece.",
        "Returning after {weeks} weeks to update: The {product} has held up beautifully. No tarnishing or wear. More importantly, I feel more centered and focused since wearing it.",
      ],
    },
    zh: {
      initial: [
        "在五台山开光加持的{product}，做工非常精细，每一个细节都能看出匠心。佩戴后感觉心态平和了很多，整个人的状态都好了起来。",
        "朋友推荐的{product}，收到后非常惊喜。吊坠的质感很好，沉甸甸的，雕刻工艺精湛。最重要的是经过五台山高僧开光，感觉很有灵气。",
        "一直想请一款五台山的开光法物，这款{product}完全符合我的期望。佩戴一段时间后，感觉运势有了明显的改善，工作和生活都顺利了很多。",
        "给家人请的{product}，家人非常喜欢。做工精美，包装也很用心，还附有开光证书。是一份非常有意义的礼物。",
        "第二次购买了，上次给自己请的，这次给父母请{product}。品质一如既往的好，五台山的开光加持让人很安心。",
        "{product}收到了，比想象中还要精美。吊坠的重量适中，佩戴舒适，雕刻的图案栩栩如生。感恩五台山的加持。",
        "请了{product}之后，感觉整个人的气场都不一样了。朋友们都说我最近气色好了很多，做事也更顺利了。非常感谢。",
        "作为一个注重传统文化的人，{product}让我非常满意。五台山作为四大佛教名山之一，其开光法物的灵力是毋庸置疑的。",
        "收到{product}的那一刻就感受到了它的不同。做工精致，材质上乘，开光证书齐全。佩戴后心境平和，诸事顺遂。",
        "已经佩戴{product}一个月了，效果超出预期。不仅是一件精美的饰品，更是一件有灵性的护身法物。强烈推荐。",
      ],
      followUp: [
        "佩戴{weeks}周后追评：{product}的效果真的很明显，最近工作顺利了很多，人际关系也改善了。会继续佩戴。",
        "{weeks}周后来追评：自从佩戴{product}后，感觉整个人的运势都在往好的方向发展。做工依然如新，非常满意。",
        "追评（{weeks}周后）：{product}已经成为我每天必戴的饰品。朋友们看到后都想请一款，已经推荐给好几个人了。",
        "使用{weeks}周追评：{product}品质经得起时间考验，没有任何褪色或磨损。更重要的是，佩戴后的正面变化是实实在在的。",
      ],
    },
    fr: {
      initial: [
        "J'ai commandé le {product} après avoir lu sur les traditions de bénédiction du Mont Wutai. L'artisanat est remarquable. Je le porte quotidiennement et ressens un véritable sentiment de calme.",
        "Ce {product} a dépassé mes attentes. La qualité est exceptionnelle et savoir qu'il a été béni au Mont Wutai lui donne une signification particulière. J'ai remarqué des changements positifs.",
        "Magnifique pièce ! Le {product} est arrivé bien emballé et le pendentif est superbe. Le poids est substantiel et la gravure est complexe. Très satisfait de cet achat.",
        "Acheté le {product} comme cadeau pour ma mère. Elle l'adore absolument. La signification spirituelle combinée à la belle facture en fait un cadeau vraiment significatif.",
        "Le {product} est exactement ce que je cherchais. En tant que passionné des traditions spirituelles orientales, avoir un véritable pendentif béni du Mont Wutai est incroyable.",
      ],
      followUp: [
        "Mise à jour après {weeks} semaines : Le {product} est devenu mon compagnon quotidien. J'ai remarqué des améliorations dans mon bien-être général. La qualité est toujours impeccable.",
        "Suivi après {weeks} semaines : Je porte toujours mon {product} chaque jour. Plusieurs amis m'ont demandé où l'acheter. L'énergie spirituelle est réelle.",
      ],
    },
    de: {
      initial: [
        "Ich habe das {product} bestellt, nachdem ich über die Segnungstraditionen des Wutai-Berges gelesen hatte. Die Handwerkskunst ist bemerkenswert. Ich trage es täglich und spüre eine echte Ruhe.",
        "Dieses {product} hat meine Erwartungen übertroffen. Die Qualität ist hervorragend, und zu wissen, dass es am Wutai-Berg gesegnet wurde, verleiht ihm eine besondere Bedeutung.",
        "Wunderschönes Stück! Das {product} kam gut verpackt an und der Anhänger selbst ist atemberaubend. Das Gewicht fühlt sich substanziell an. Sehr zufrieden mit diesem Kauf.",
        "Das {product} als Geschenk für meine Mutter gekauft. Sie liebt es absolut. Die spirituelle Bedeutung kombiniert mit der schönen Handwerkskunst macht es zu einem wirklich bedeutungsvollen Geschenk.",
        "Das {product} ist genau das, was ich gesucht habe. Als jemand, der sich für östliche spirituelle Traditionen interessiert, ist ein echter gesegneter Anhänger vom Wutai-Berg unglaublich.",
      ],
      followUp: [
        "Update nach {weeks} Wochen: Das {product} ist mein täglicher Begleiter geworden. Ich habe Verbesserungen in meinem allgemeinen Wohlbefinden bemerkt. Die Qualität ist unverändert.",
        "Nachverfolgung nach {weeks} Wochen: Ich trage mein {product} immer noch jeden Tag. Mehrere Freunde haben danach gefragt. Die spirituelle Energie ist spürbar.",
      ],
    },
    es: {
      initial: [
        "Pedí el {product} después de leer sobre las tradiciones de bendición del Monte Wutai. La artesanía es notable. Lo uso diariamente y siento una genuina sensación de calma y protección.",
        "Este {product} superó mis expectativas. La calidad es excepcional y saber que fue bendecido en el Monte Wutai le da un significado especial. He notado cambios positivos.",
        "¡Hermosa pieza! El {product} llegó bien empaquetado y el colgante es impresionante. El peso se siente sustancial y el tallado es intrincado. Muy contento con esta compra.",
        "Compré el {product} como regalo para mi madre. Le encanta absolutamente. El significado espiritual combinado con la hermosa artesanía lo convierte en un regalo verdaderamente significativo.",
        "El {product} es exactamente lo que estaba buscando. Como alguien interesado en las tradiciones espirituales orientales, tener un genuino colgante bendecido del Monte Wutai es increíble.",
      ],
      followUp: [
        "Actualización después de {weeks} semanas: El {product} se ha convertido en mi compañero diario. He notado mejoras en mi bienestar general. La calidad sigue impecable.",
        "Seguimiento después de {weeks} semanas: Sigo usando mi {product} todos los días. Varios amigos han preguntado dónde conseguirlo. La energía espiritual es real.",
      ],
    },
    it: {
      initial: [
        "Ho ordinato il {product} dopo aver letto delle tradizioni di benedizione del Monte Wutai. L'artigianato è notevole. Lo indosso quotidianamente e provo un genuino senso di calma.",
        "Questo {product} ha superato le mie aspettative. La qualità è eccezionale e sapere che è stato benedetto al Monte Wutai gli conferisce un significato speciale.",
        "Bellissimo pezzo! Il {product} è arrivato ben confezionato e il ciondolo è stupendo. Il peso è sostanziale e l'incisione è intricata. Molto soddisfatto dell'acquisto.",
        "Ho acquistato il {product} come regalo per mia madre. Lo adora assolutamente. Il significato spirituale combinato con la bella fattura lo rende un regalo veramente significativo.",
      ],
      followUp: [
        "Aggiornamento dopo {weeks} settimane: Il {product} è diventato il mio compagno quotidiano. Ho notato miglioramenti nel mio benessere generale. La qualità è invariata.",
      ],
    },
    ja: {
      initial: [
        "五台山の加持を受けた{product}を注文しました。職人技が素晴らしく、毎日身につけています。穏やかな気持ちと守護を感じます。",
        "この{product}は期待以上でした。品質が素晴らしく、五台山で祝福されたことに特別な意味を感じます。ポジティブな変化を感じています。",
        "美しい作品です！{product}は丁寧に梱包されており、ペンダント自体も見事です。重量感があり、彫刻も精緻です。とても満足しています。",
        "{product}を母へのプレゼントとして購入しました。とても喜んでいます。精神的な意味と美しい職人技が組み合わさった、本当に意味のある贈り物です。",
      ],
      followUp: [
        "{weeks}週間後の更新：{product}は毎日の相棒になりました。全体的な幸福感の向上を感じています。品質も変わりません。",
      ],
    },
    ko: {
      initial: [
        "오대산의 축복 전통에 대해 읽고 {product}를 주문했습니다. 장인정신이 놀랍습니다. 매일 착용하고 있으며 진정한 평온함과 보호를 느낍니다.",
        "이 {product}는 기대 이상이었습니다. 품질이 뛰어나고 오대산에서 축복받았다는 것이 특별한 의미를 부여합니다. 긍정적인 변화를 느끼고 있습니다.",
        "아름다운 작품입니다! {product}는 잘 포장되어 도착했고 펜던트 자체가 멋집니다. 무게감이 있고 조각이 정교합니다. 매우 만족합니다.",
        "어머니 선물로 {product}를 구매했습니다. 정말 좋아하십니다. 영적 의미와 아름다운 장인정신이 결합된 진정으로 의미 있는 선물입니다.",
      ],
      followUp: [
        "{weeks}주 후 업데이트: {product}가 일상의 동반자가 되었습니다. 전반적인 웰빙이 개선되었음을 느낍니다. 품질도 변함없습니다.",
      ],
    },
    pt: {
      initial: [
        "Encomendei o {product} depois de ler sobre as tradições de bênção do Monte Wutai. O artesanato é notável. Uso-o diariamente e sinto uma genuína sensação de calma e proteção.",
        "Este {product} superou as minhas expectativas. A qualidade é excepcional e saber que foi abençoado no Monte Wutai dá-lhe um significado especial.",
        "Peça linda! O {product} chegou bem embalado e o pingente é deslumbrante. O peso é substancial e a gravação é intrincada. Muito satisfeito com esta compra.",
      ],
      followUp: [
        "Atualização após {weeks} semanas: O {product} tornou-se o meu companheiro diário. Notei melhorias no meu bem-estar geral. A qualidade mantém-se impecável.",
      ],
    },
  },
  bracelet: {
    en: {
      initial: [
        "The {product} is absolutely beautiful. The sutra engraving is incredibly detailed and the craftsmanship is evident in every aspect. Wearing it brings a sense of peace and mindfulness throughout my day.",
        "I purchased the {product} for its spiritual significance and was not disappointed. The quality is exceptional — the material feels premium and the engraving is precise. A truly meaningful piece.",
        "This {product} has become my most treasured accessory. The sacred text is perfectly inscribed and the bracelet itself is comfortable for daily wear. I feel protected and centered when wearing it.",
        "Received the {product} as a gift and I'm deeply moved. The attention to detail is remarkable. Each character of the sutra is clearly visible. It's both a beautiful piece of jewelry and a spiritual companion.",
        "The craftsmanship of this {product} is on another level. Having the complete sacred text on a wearable piece is amazing. I've received many compliments and questions about it.",
      ],
      followUp: [
        "Update after {weeks} weeks: The {product} has held up beautifully with daily wear. No fading of the engraving and the material remains pristine. I feel more mindful and at peace.",
        "{weeks} weeks later: Still wearing my {product} every single day. The spiritual connection I feel with it has only grown stronger. Quality is excellent — no signs of wear.",
      ],
    },
    zh: {
      initial: [
        "{product}做工非常精细，经文刻印清晰可见，每一个字都一丝不苟。佩戴后感觉心境平和，整个人都安定了很多。五台山开光加持，值得信赖。",
        "收到{product}非常惊喜，手链的质感超出预期。经文雕刻精美，佩戴舒适，不会过重也不会过轻。是一件兼具美感和灵性的法物。",
        "第三次购买了，之前给家人请了两条，这次给自己请{product}。品质始终如一，五台山的加持让人很安心。每天佩戴，感觉运势都好了很多。",
        "朋友推荐的{product}，果然没有让我失望。经文完整清晰，做工精湛，佩戴后感觉整个人的气场都不一样了。已经推荐给更多朋友。",
        "{product}是我目前最喜欢的饰品。不仅外观精美，更重要的是它承载的佛法力量。每次看到手腕上的经文，都会提醒自己保持正念。",
      ],
      followUp: [
        "佩戴{weeks}周后追评：{product}的品质经得起时间考验，经文依然清晰如新。更重要的是，佩戴后的正面影响是持续的。",
        "{weeks}周后来追评：{product}已经成为我不可或缺的日常佩饰。朋友们看到后纷纷询问，已经帮好几个人请了。",
      ],
    },
    fr: {
      initial: [
        "Le {product} est absolument magnifique. La gravure du sutra est incroyablement détaillée. Le porter apporte un sentiment de paix et de pleine conscience tout au long de la journée.",
        "J'ai acheté le {product} pour sa signification spirituelle et je n'ai pas été déçu. La qualité est exceptionnelle et la gravure est précise. Une pièce vraiment significative.",
      ],
      followUp: [
        "Mise à jour après {weeks} semaines : Le {product} a très bien résisté à l'usure quotidienne. Aucune décoloration de la gravure. Je me sens plus en paix.",
      ],
    },
    de: {
      initial: [
        "Das {product} ist absolut wunderschön. Die Sutra-Gravur ist unglaublich detailliert. Es zu tragen bringt ein Gefühl des Friedens und der Achtsamkeit.",
        "Ich habe das {product} wegen seiner spirituellen Bedeutung gekauft und wurde nicht enttäuscht. Die Qualität ist außergewöhnlich und die Gravur ist präzise.",
      ],
      followUp: [
        "Update nach {weeks} Wochen: Das {product} hat sich beim täglichen Tragen wunderbar gehalten. Keine Verblassung der Gravur. Ich fühle mich achtsamer und friedlicher.",
      ],
    },
    es: {
      initial: [
        "El {product} es absolutamente hermoso. El grabado del sutra es increíblemente detallado. Usarlo trae una sensación de paz y atención plena durante todo el día.",
        "Compré el {product} por su significado espiritual y no me decepcionó. La calidad es excepcional y el grabado es preciso. Una pieza verdaderamente significativa.",
      ],
      followUp: [
        "Actualización después de {weeks} semanas: El {product} se ha mantenido muy bien con el uso diario. Sin decoloración del grabado. Me siento más en paz.",
      ],
    },
    it: {
      initial: [
        "Il {product} è assolutamente bellissimo. L'incisione del sutra è incredibilmente dettagliata. Indossarlo porta un senso di pace e consapevolezza durante tutta la giornata.",
      ],
      followUp: [
        "Aggiornamento dopo {weeks} settimane: Il {product} ha resistito benissimo all'uso quotidiano. Nessuno sbiadimento dell'incisione. Mi sento più in pace.",
      ],
    },
    ja: {
      initial: [
        "{product}は本当に美しいです。経典の彫刻は信じられないほど精緻で、身につけると一日中平和と気づきの感覚をもたらしてくれます。",
      ],
      followUp: [
        "{weeks}週間後の更新：{product}は毎日の着用にも美しく耐えています。彫刻の色褪せもありません。より穏やかに感じています。",
      ],
    },
    ko: {
      initial: [
        "{product}는 정말 아름답습니다. 경전 조각이 놀라울 정도로 정교하며, 착용하면 하루 종일 평화와 마음챙김의 감각을 가져다줍니다.",
      ],
      followUp: [
        "{weeks}주 후 업데이트: {product}는 매일 착용해도 아름답게 유지됩니다. 조각의 퇴색이 없습니다. 더 평온함을 느낍니다.",
      ],
    },
    pt: {
      initial: [
        "O {product} é absolutamente lindo. A gravação do sutra é incrivelmente detalhada. Usá-lo traz uma sensação de paz e atenção plena ao longo do dia.",
      ],
      followUp: [
        "Atualização após {weeks} semanas: O {product} manteve-se lindamente com o uso diário. Sem desbotamento da gravação. Sinto-me mais em paz.",
      ],
    },
  },
  service: {
    en: {
      initial: [
        "The {product} provided incredible insights into my life path. The analysis was thorough and surprisingly accurate. It helped me understand patterns I'd been struggling with for years.",
        "I was amazed by the depth of the {product}. The report covered aspects of my personality, career, and relationships with remarkable precision. Worth every penny.",
        "Received my {product} report and I'm genuinely impressed. The level of detail and accuracy is remarkable. It's given me clarity on decisions I've been putting off.",
        "The {product} was a transformative experience. The analysis revealed aspects of my life that I hadn't considered. I feel more confident about my path forward.",
        "Skeptical at first, but the {product} completely changed my perspective. The insights were specific, not generic, and many points resonated deeply with my actual experiences.",
      ],
      followUp: [
        "Update after {weeks} weeks: Following the guidance from my {product}, I've made some changes in my life. The results have been remarkable. Truly grateful for this service.",
        "{weeks} weeks later: The insights from my {product} continue to prove accurate. I refer back to the report regularly and find new meaning each time.",
      ],
    },
    zh: {
      initial: [
        "{product}的分析非常深入和准确，对我的人生道路提供了宝贵的洞察。报告涵盖了性格、事业、感情等方面，每一点都说到了心坎里。",
        "收到{product}的报告后非常震撼，分析的准确度超出预期。帮助我理解了多年来一直困扰的问题，找到了前进的方向。",
        "{product}是一次非常有价值的体验。报告的深度和广度都令人印象深刻，揭示了我之前没有注意到的生命模式。",
        "朋友推荐的{product}，结果让我非常满意。分析不是泛泛而谈，而是针对我个人情况的深入解读。已经推荐给身边的人了。",
        "对{product}的专业程度感到惊讶。报告内容详实，分析透彻，给出的建议也非常实用。对我的人生规划帮助很大。",
      ],
      followUp: [
        "追评（{weeks}周后）：按照{product}报告中的建议调整了一些生活方向，效果非常明显。感恩这次分析。",
        "{weeks}周后来追评：{product}的分析持续被验证为准确。我经常回顾报告，每次都有新的领悟。",
      ],
    },
    fr: {
      initial: [
        "Le {product} a fourni des aperçus incroyables sur mon chemin de vie. L'analyse était approfondie et étonnamment précise.",
        "J'ai été émerveillé par la profondeur du {product}. Le rapport couvrait des aspects de ma personnalité avec une précision remarquable.",
      ],
      followUp: [
        "Mise à jour après {weeks} semaines : En suivant les conseils de mon {product}, j'ai apporté des changements dans ma vie. Les résultats sont remarquables.",
      ],
    },
    de: {
      initial: [
        "Das {product} lieferte unglaubliche Einblicke in meinen Lebensweg. Die Analyse war gründlich und überraschend genau.",
        "Ich war erstaunt über die Tiefe des {product}. Der Bericht deckte Aspekte meiner Persönlichkeit mit bemerkenswerter Präzision ab.",
      ],
      followUp: [
        "Update nach {weeks} Wochen: Den Empfehlungen meines {product} folgend, habe ich einige Veränderungen vorgenommen. Die Ergebnisse sind bemerkenswert.",
      ],
    },
    es: {
      initial: [
        "El {product} proporcionó perspectivas increíbles sobre mi camino de vida. El análisis fue exhaustivo y sorprendentemente preciso.",
        "Me asombró la profundidad del {product}. El informe cubrió aspectos de mi personalidad con una precisión notable.",
      ],
      followUp: [
        "Actualización después de {weeks} semanas: Siguiendo la guía de mi {product}, he hecho algunos cambios. Los resultados han sido notables.",
      ],
    },
    it: {
      initial: [
        "Il {product} ha fornito intuizioni incredibili sul mio percorso di vita. L'analisi è stata approfondita e sorprendentemente accurata.",
      ],
      followUp: [
        "Aggiornamento dopo {weeks} settimane: Seguendo i consigli del mio {product}, ho apportato alcuni cambiamenti. I risultati sono notevoli.",
      ],
    },
    ja: {
      initial: [
        "{product}は私の人生の道筋について信じられないほどの洞察を提供してくれました。分析は徹底的で驚くほど正確でした。",
      ],
      followUp: [
        "{weeks}週間後の更新：{product}のガイダンスに従い、いくつかの変更を加えました。結果は素晴らしいものでした。",
      ],
    },
    ko: {
      initial: [
        "{product}는 제 인생 경로에 대한 놀라운 통찰을 제공했습니다. 분석이 철저하고 놀라울 정도로 정확했습니다.",
      ],
      followUp: [
        "{weeks}주 후 업데이트: {product}의 안내에 따라 몇 가지 변화를 주었습니다. 결과가 놀라웠습니다.",
      ],
    },
    pt: {
      initial: [
        "O {product} forneceu perspetivas incríveis sobre o meu caminho de vida. A análise foi minuciosa e surpreendentemente precisa.",
      ],
      followUp: [
        "Atualização após {weeks} semanas: Seguindo a orientação do meu {product}, fiz algumas mudanças. Os resultados foram notáveis.",
      ],
    },
  },
  prayer: {
    en: {
      initial: [
        "The {product} service was a deeply moving experience. Knowing that prayers were being offered at Wutai Mountain on my behalf brought immense comfort during a difficult time.",
        "I ordered the {product} for my family's wellbeing. Within weeks, I noticed a shift in our circumstances. Whether coincidence or not, I'm grateful for the spiritual support.",
        "The {product} exceeded my expectations. I received photos and documentation of the ceremony, which made the experience feel personal and authentic. Truly meaningful.",
        "As someone going through a challenging period, the {product} provided the spiritual support I needed. The traditional ceremony at Wutai Mountain carries genuine power.",
        "Ordered the {product} after a friend's recommendation. The entire process was professional and respectful. I felt a sense of peace knowing the prayers were being offered.",
      ],
      followUp: [
        "Update after {weeks} weeks: Since the {product} ceremony, I've felt a shift in my circumstances. Things that were stuck are now moving forward. The prayers are working.",
        "{weeks} weeks later: The {product} prayers have brought noticeable improvements. I feel more hopeful and situations are resolving. This traditional practice holds real power.",
      ],
    },
    zh: {
      initial: [
        "{product}让我感到非常安心。知道五台山的高僧在为我祈福，在困难时期给了我莫大的精神支持。整个过程专业而庄重。",
        "为家人请了{product}，几周后明显感觉到家庭氛围的改善。不管是巧合还是佛力加持，我都非常感恩。",
        "{product}超出了我的预期。收到了祈福仪式的照片和证明，让整个体验感觉非常真实和个人化。非常有意义的服务。",
        "经历了一段困难时期，{product}提供了我所需要的精神支持。五台山的传统祈福仪式确实有着不可思议的力量。",
        "朋友推荐的{product}，整个过程非常专业和尊重。知道祈福正在进行，心里感到一种平静和安宁。",
      ],
      followUp: [
        "追评（{weeks}周后）：自从{product}祈福仪式后，感觉运势有了明显的转变。之前停滞不前的事情现在都在向好的方向发展。",
        "{weeks}周后来追评：{product}的祈福带来了明显的改善。感觉更有希望了，各种情况都在好转。传统祈福确实有力量。",
      ],
    },
    fr: {
      initial: [
        "Le service {product} a été une expérience profondément émouvante. Savoir que des prières étaient offertes au Mont Wutai en mon nom a apporté un immense réconfort.",
        "J'ai commandé le {product} pour le bien-être de ma famille. En quelques semaines, j'ai remarqué un changement dans nos circonstances.",
      ],
      followUp: [
        "Mise à jour après {weeks} semaines : Depuis la cérémonie {product}, j'ai senti un changement dans mes circonstances. Les prières fonctionnent.",
      ],
    },
    de: {
      initial: [
        "Der {product}-Service war eine zutiefst bewegende Erfahrung. Zu wissen, dass am Wutai-Berg Gebete in meinem Namen dargebracht wurden, brachte immensen Trost.",
        "Ich habe den {product} für das Wohlbefinden meiner Familie bestellt. Innerhalb von Wochen bemerkte ich eine Veränderung in unseren Umständen.",
      ],
      followUp: [
        "Update nach {weeks} Wochen: Seit der {product}-Zeremonie habe ich eine Veränderung in meinen Umständen gespürt. Die Gebete wirken.",
      ],
    },
    es: {
      initial: [
        "El servicio {product} fue una experiencia profundamente conmovedora. Saber que se ofrecían oraciones en el Monte Wutai en mi nombre trajo un inmenso consuelo.",
        "Pedí el {product} para el bienestar de mi familia. En pocas semanas, noté un cambio en nuestras circunstancias.",
      ],
      followUp: [
        "Actualización después de {weeks} semanas: Desde la ceremonia {product}, he sentido un cambio en mis circunstancias. Las oraciones están funcionando.",
      ],
    },
    it: {
      initial: [
        "Il servizio {product} è stata un'esperienza profondamente commovente. Sapere che le preghiere venivano offerte al Monte Wutai a mio nome ha portato un immenso conforto.",
      ],
      followUp: [
        "Aggiornamento dopo {weeks} settimane: Dalla cerimonia {product}, ho sentito un cambiamento nelle mie circostanze. Le preghiere stanno funzionando.",
      ],
    },
    ja: {
      initial: [
        "{product}サービスは深く感動的な体験でした。五台山で私のために祈りが捧げられていることを知り、困難な時期に大きな慰めをもたらしました。",
      ],
      followUp: [
        "{weeks}週間後の更新：{product}の儀式以来、状況に変化を感じています。祈りが効いています。",
      ],
    },
    ko: {
      initial: [
        "{product} 서비스는 깊이 감동적인 경험이었습니다. 오대산에서 저를 위해 기도가 올려지고 있다는 것을 알고 어려운 시기에 큰 위안을 받았습니다.",
      ],
      followUp: [
        "{weeks}주 후 업데이트: {product} 의식 이후로 상황에 변화를 느꼈습니다. 기도가 효과를 보이고 있습니다.",
      ],
    },
    pt: {
      initial: [
        "O serviço {product} foi uma experiência profundamente comovente. Saber que orações estavam sendo oferecidas no Monte Wutai em meu nome trouxe imenso conforto.",
      ],
      followUp: [
        "Atualização após {weeks} semanas: Desde a cerimónia {product}, senti uma mudança nas minhas circunstâncias. As orações estão a funcionar.",
      ],
    },
  },
};

// ====== PRODUCT TYPE DETECTION ======
function getProductType(productName) {
  const name = productName.toLowerCase();
  if (name.includes('bracelet') || name.includes('手链') || name.includes('手镯')) return 'bracelet';
  if (name.includes('reading') || name.includes('analysis') || name.includes('fengshui') || name.includes('面相') || name.includes('手相') || name.includes('风水') || name.includes('命理') || name.includes('fortune') || name.includes('destiny')) return 'service';
  if (name.includes('prayer') || name.includes('blessing') || name.includes('供香') || name.includes('供灯') || name.includes('祈福')) return 'prayer';
  return 'zodiac'; // pendants, zodiac, constellation, moon, scripture pendant
}

// ====== MAIN ======
const products = await db.select().from(schema.products);
console.log(`Found ${products.length} products`);

// Clear existing reviews
console.log('Deleting existing reviews...');
await db.delete(schema.reviews);
console.log('Cleared all reviews.');

const TARGET_PER_PRODUCT = () => Math.floor(Math.random() * (39287 - 32143 + 1)) + 32143;
const BATCH_SIZE = 2000;

let totalGenerated = 0;

for (const product of products) {
  const target = TARGET_PER_PRODUCT();
  console.log(`\nGenerating ${target} reviews for: ${product.name}`);
  
  const productType = getProductType(product.name);
  const typeTemplates = TEMPLATES[productType];
  
  let generated = 0;
  
  while (generated < target) {
    const batch = [];
    const batchSize = Math.min(BATCH_SIZE, target - generated);
    
    for (let i = 0; i < batchSize; i++) {
      // Pick region
      const rand = Math.random();
      let regionKey;
      if (rand < 0.65) regionKey = 'europe';
      else if (rand < 0.85) regionKey = 'asia';
      else regionKey = 'usa';
      
      // Pick country
      const countries = REGIONS[regionKey].countries;
      const country = countries[Math.floor(Math.random() * countries.length)];
      
      // Language from country
      const lang = country.lang;
      
      // Is follow-up? (30%)
      const isFollowUp = Math.random() < 0.30;
      
      // Get templates for this language, fallback to English
      const langTemplates = typeTemplates[lang] || typeTemplates['en'];
      const templateArray = isFollowUp ? langTemplates.followUp : langTemplates.initial;
      
      let comment = templateArray[Math.floor(Math.random() * templateArray.length)];
      comment = comment.replace(/{product}/g, product.name);
      if (isFollowUp) {
        const weeks = Math.floor(Math.random() * 6) + 2;
        comment = comment.replace(/{weeks}/g, String(weeks));
      }
      
      // Rating: 85% 5-star, 15% 4-star
      const rating = Math.random() < 0.85 ? 5 : 4;
      
      // Date
      const createdAt = generateRandomDate();
      
      // Location
      const city = country.cities[Math.floor(Math.random() * country.cities.length)];
      const location = `${city}, ${country.name}`;
      
      batch.push({
        productId: product.id,
        userId: null,
        userName: generateUsername(lang),
        rating,
        comment,
        ipAddress: generateIP(country),
        location,
        language: lang,
        isVerified: true,
        isApproved: true,
        createdAt,
        updatedAt: createdAt,
      });
    }
    
    await db.insert(schema.reviews).values(batch);
    generated += batchSize;
    totalGenerated += batchSize;
    
    if (generated % 10000 < BATCH_SIZE) {
      console.log(`  Progress: ${generated}/${target} (${Math.round(generated/target*100)}%) | Total: ${totalGenerated}`);
    }
  }
  
  console.log(`✓ Completed ${product.name} (${generated} reviews)`);
}

console.log(`\n✓ All done! Total reviews generated: ${totalGenerated}`);
await connection.end();
