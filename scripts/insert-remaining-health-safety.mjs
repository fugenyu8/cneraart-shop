/**
 * 批量插入剩余13个health&safety产品
 * - 天然桃木十二生肖本命佛吊坠 (12款, $45.00)
 * - 七彩琉璃手机链 ($45.00)
 * 
 * 数据库字段: name(英文), description(英文), regularPrice, salePrice, status
 * 多语言通过前端i18n处理
 */
import mysql from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;
const CATEGORY_ID = 90005; // 平安健康

// 图片CDN URLs
const ZODIAC_IMGS = {
  鼠: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/umvOuYJtKJZoeuHZ.jpg',
  牛: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/CBfQHKleXKaURkVH.jpg',
  虎: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/tcFOaJFQkXWFuwZk.jpg',
  兔: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/lHhZWUtsrmcSXGTw.jpg',
  龙: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/eDMyywlFDxhJxfgK.jpg',
  蛇: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/myIzDyiSEfXiNUsh.jpg',
  马: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/gfEhidcTQKujhIrW.jpg',
  羊: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/dfJIdTJxHHVWFQdx.jpg',
  猴: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/MpcRfOxBgUsgeVKF.jpg',
  鸡: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/FypiJQdintIubkBA.jpg',
  狗: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/CGsyEdVNNlwFniWN.jpg',
  猪: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/CdFKCnZsEhBDoLZY.jpg',
};
const ZODIAC_SHARED_IMG1 = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/RZmnLAIwbMkrNfPI.jpg';
const ZODIAC_SHARED_IMG2 = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/yEFildyRtzxJvEDQ.jpg';
const LIULI_IMGS = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/QowHkRlpGPAYzkoH.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/CRpMJtLknpdegxGQ.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/pjeOfcAkcDcogZvg.jpg',
];

// 生肖信息
const ZODIAC_INFO = {
  鼠: { en: 'Rat', slug: 'rat', buddha: 'Thousand-Hand Guanyin', years: '1948, 1960, 1972, 1984, 1996, 2008, 2020', traits: 'intelligence, resourcefulness, and the ability to seize opportunities' },
  牛: { en: 'Ox', slug: 'ox', buddha: 'Akashagarbha Bodhisattva', years: '1949, 1961, 1973, 1985, 1997, 2009, 2021', traits: 'diligence, dependability, strength, and determination' },
  虎: { en: 'Tiger', slug: 'tiger', buddha: 'Akashagarbha Bodhisattva', years: '1950, 1962, 1974, 1986, 1998, 2010, 2022', traits: 'courage, ambition, and leadership' },
  兔: { en: 'Rabbit', slug: 'rabbit', buddha: 'Manjushri Bodhisattva', years: '1951, 1963, 1975, 1987, 1999, 2011, 2023', traits: 'gentleness, elegance, and compassion' },
  龙: { en: 'Dragon', slug: 'dragon', buddha: 'Samantabhadra Bodhisattva', years: '1952, 1964, 1976, 1988, 2000, 2012, 2024', traits: 'power, nobility, and good fortune' },
  蛇: { en: 'Snake', slug: 'snake', buddha: 'Samantabhadra Bodhisattva', years: '1953, 1965, 1977, 1989, 2001, 2013, 2025', traits: 'wisdom, intuition, and deep thinking' },
  马: { en: 'Horse', slug: 'horse', buddha: 'Mahasthamaprapta Bodhisattva', years: '1954, 1966, 1978, 1990, 2002, 2014, 2026', traits: 'freedom, energy, and adventurous spirit' },
  羊: { en: 'Goat', slug: 'goat', buddha: 'Vairocana Buddha', years: '1955, 1967, 1979, 1991, 2003, 2015, 2027', traits: 'creativity, gentleness, and artistic nature' },
  猴: { en: 'Monkey', slug: 'monkey', buddha: 'Vairocana Buddha', years: '1956, 1968, 1980, 1992, 2004, 2016, 2028', traits: 'cleverness, curiosity, and versatility' },
  鸡: { en: 'Rooster', slug: 'rooster', buddha: 'Acala Vidyaraja', years: '1957, 1969, 1981, 1993, 2005, 2017, 2029', traits: 'confidence, punctuality, and loyalty' },
  狗: { en: 'Dog', slug: 'dog', buddha: 'Amitabha Buddha', years: '1958, 1970, 1982, 1994, 2006, 2018, 2030', traits: 'loyalty, honesty, and protective instincts' },
  猪: { en: 'Pig', slug: 'pig', buddha: 'Amitabha Buddha', years: '1959, 1971, 1983, 1995, 2007, 2019, 2031', traits: 'generosity, diligence, and sincere heart' },
};

function getZodiacName(zodiac) {
  const info = ZODIAC_INFO[zodiac];
  return `Natural Peach Wood ${info.en} Zodiac Guardian Buddha Pendant`;
}

function getZodiacSlug(zodiac) {
  return `peach-wood-${ZODIAC_INFO[zodiac].slug}-zodiac-guardian-buddha-pendant`;
}

function getZodiacDescription(zodiac) {
  const info = ZODIAC_INFO[zodiac];
  return `In the ancient wisdom of Chinese astrology, the ${info.en} symbolizes ${info.traits}. This sacred pendant has been consecrated by senior lineage holders at Wutai Mountain, one of China's Four Great Buddhist Mountains and a UNESCO World Cultural Heritage site.

**Cultural Significance:**
The ${info.en}, as one of the twelve zodiac animals, carries profound spiritual meaning in Chinese culture. Those born in the Year of the ${info.en} (${info.years}) are under the protection of ${info.buddha}, their guardian deity who bestows wisdom, protection, and blessings upon them throughout their life journey.

**Consecration Ceremony:**
Each pendant is consecrated by enlightened masters at Wutai Mountain through traditional Buddhist consecration ceremonies. These senior lineage holders, having devoted decades to spiritual cultivation, channel sacred energy from ${info.buddha} directly into each pendant. Through continuous sutra recitation and ritual offerings, the masters infuse every piece with protective power and divine blessings that shield the wearer from negative influences.

**Design & Craftsmanship:**
Crafted from premium natural aged peach wood, this pendant features an exquisitely carved image of ${info.buddha}, the guardian deity for those born in the Year of the ${info.en}. The natural wood grain enhances the spiritual character of each unique piece. The carving is detailed and lifelike, with the Buddha's expression conveying peace and compassion.

**Specifications:**
- Material: Natural aged peach wood
- Size: Approx. 3.5×1.5cm
- Total length: Approx. 20cm
- Weight: Approx. 8g
- Consecrated at: Wutai Mountain, China

**Who Should Wear This:**
- Those born in the Year of the ${info.en} (${info.years})
- Individuals seeking spiritual protection and guidance
- Anyone wishing to attract prosperity and good fortune
- Those who appreciate Chinese cultural heritage

May this sacred guardian pendant guide you through life's journey with wisdom, courage, and unwavering protection from ${info.buddha}.`;
}

function getZodiacShortDesc(zodiac) {
  const info = ZODIAC_INFO[zodiac];
  return `Sacred ${info.en} zodiac guardian pendant consecrated at Wutai Mountain, featuring ${info.buddha} for protection and blessings.`;
}

// 评价模板 (多语言)
const REVIEW_TEMPLATES = {
  en: [
    { rating: 5, comments: [
      'Beautiful craftsmanship, the peach wood is genuine and the carving is exquisite. Wearing it makes me feel protected!',
      'Received it as a gift for my mother. She loves it! The quality is excellent and it arrived beautifully packaged.',
      'I bought this for my zodiac sign and it feels very spiritual. The wood smells wonderful and natural.',
      'Amazing quality! The Buddha carving is so detailed. I can feel the positive energy from it.',
      'Perfect pendant! The size is just right and the cord is high quality. Very happy with this purchase.',
      'Wutai Mountain consecrated items are always special. This pendant is no exception - beautiful and meaningful.',
      'The natural peach wood has a lovely grain. The carving of my zodiac Buddha is perfect. Highly recommend!',
      'I wear this every day and feel blessed. The quality is outstanding for the price.',
      'Bought 3 for family members. Everyone loves them! Great gift idea for Chinese New Year.',
      'The packaging was gorgeous - felt like opening a luxury gift. The pendant itself is stunning.',
    ]},
    { rating: 4, comments: [
      'Very nice pendant. The wood quality is good and the carving is detailed. Shipping was fast.',
      'Good quality for the price. The Buddha carving is clear and the wood is smooth.',
      'Nice piece, arrived quickly and well packaged. Would buy again.',
      'Pretty pendant, good quality wood. The carving is nice and detailed.',
    ]},
  ],
  zh: [
    { rating: 5, comments: [
      '桃木材质很好，雕工精细，本命佛造型庄严，戴上感觉很有安全感！',
      '给妈妈买的，她非常喜欢！质量很好，包装精美，值得推荐。',
      '五台山开光的，感觉很灵验，戴了之后运气好多了！',
      '做工精细，桃木的香气很自然，本命佛雕刻栩栩如生，非常满意！',
      '尺寸合适，绳子质量好，整体很精致，送礼自用都不错。',
      '五台山开光法物，品质有保障，这款本命佛吊坠很漂亮，很有文化内涵。',
      '天然桃木纹理清晰，本命佛雕刻完美，强烈推荐！',
      '每天都戴着，感觉很有福气，质量非常好。',
      '给家人买了好几个，大家都很喜欢！过年送礼的好选择。',
      '包装很精美，像打开了一份奢华礼物，吊坠本身也很漂亮。',
    ]},
    { rating: 4, comments: [
      '吊坠很好看，木质好，雕工细致，发货也快。',
      '性价比很高，本命佛雕刻清晰，木头很光滑。',
      '不错的商品，到货快，包装完好，会再次购买。',
    ]},
  ],
  ja: [
    { rating: 5, comments: [
      '桃の木の素材が素晴らしく、彫刻が精巧です。身に着けると守られている感じがします！',
      '母へのプレゼントに購入しました。とても気に入っています！品質が素晴らしく、美しいパッケージで届きました。',
      '五台山で開光されたもので、とても霊験あらたかです。木の香りが自然で心地よいです。',
      '素晴らしい品質！仏像の彫刻がとても精細で、ポジティブなエネルギーを感じます。',
      '完璧なペンダント！サイズがちょうどよく、紐の品質も高い。この購入に大満足です。',
    ]},
    { rating: 4, comments: [
      'とても素敵なペンダントです。木の質が良く、彫刻が細かい。配送も早かったです。',
      '価格に対して品質が良い。仏像の彫刻が鮮明で、木が滑らかです。',
    ]},
  ],
  ko: [
    { rating: 5, comments: [
      '복숭아나무 재질이 훌륭하고 조각이 정교합니다. 착용하면 보호받는 느낌이 납니다!',
      '어머니 선물로 구매했는데 매우 좋아하십니다! 품질이 뛰어나고 아름다운 포장으로 도착했습니다.',
      '우타이산에서 개광된 것으로 매우 영험합니다. 나무 향기가 자연스럽고 좋습니다.',
      '놀라운 품질! 불상 조각이 매우 세밀하고 긍정적인 에너지를 느낄 수 있습니다.',
      '완벽한 펜던트! 크기가 딱 맞고 끈 품질도 좋습니다. 이 구매에 매우 만족합니다.',
    ]},
    { rating: 4, comments: [
      '매우 예쁜 펜던트입니다. 나무 품질이 좋고 조각이 세밀합니다. 배송도 빨랐습니다.',
      '가격 대비 품질이 좋습니다. 불상 조각이 선명하고 나무가 매끄럽습니다.',
    ]},
  ],
  de: [
    { rating: 5, comments: [
      'Wunderschöne Handwerkskunst, das Pfirsichholz ist echt und die Schnitzerei ist exquisit. Das Tragen lässt mich geschützt fühlen!',
      'Als Geschenk für meine Mutter gekauft. Sie liebt es! Die Qualität ist ausgezeichnet und es kam wunderschön verpackt an.',
      'Am Wutai-Berg geweihte Gegenstände sind immer besonders. Dieser Anhänger ist keine Ausnahme - schön und bedeutungsvoll.',
    ]},
    { rating: 4, comments: [
      'Sehr schöner Anhänger. Die Holzqualität ist gut und die Schnitzerei ist detailliert. Der Versand war schnell.',
    ]},
  ],
  fr: [
    { rating: 5, comments: [
      'Magnifique artisanat, le bois de pêcher est authentique et la sculpture est exquise. Le porter me fait me sentir protégé!',
      'Acheté comme cadeau pour ma mère. Elle l\'adore! La qualité est excellente et il est arrivé magnifiquement emballé.',
      'Les objets consacrés au Mont Wutai sont toujours spéciaux. Ce pendentif ne fait pas exception - beau et significatif.',
    ]},
    { rating: 4, comments: [
      'Très beau pendentif. La qualité du bois est bonne et la sculpture est détaillée. La livraison était rapide.',
    ]},
  ],
  es: [
    { rating: 5, comments: [
      'Hermosa artesanía, la madera de melocotón es genuina y la talla es exquisita. ¡Usarlo me hace sentir protegido!',
      'Comprado como regalo para mi madre. ¡Le encanta! La calidad es excelente y llegó bellamente empaquetado.',
      'Los artículos consagrados en el Monte Wutai siempre son especiales. Este colgante no es una excepción: hermoso y significativo.',
    ]},
    { rating: 4, comments: [
      'Colgante muy bonito. La calidad de la madera es buena y la talla es detallada. El envío fue rápido.',
    ]},
  ],
  pt: [
    { rating: 5, comments: [
      'Artesanato lindo, a madeira de pêssego é genuína e a escultura é requintada. Usá-lo me faz sentir protegido!',
      'Comprado como presente para minha mãe. Ela adora! A qualidade é excelente e chegou lindamente embalado.',
    ]},
    { rating: 4, comments: [
      'Pingente muito bonito. A qualidade da madeira é boa e a escultura é detalhada. O envio foi rápido.',
    ]},
  ],
  ru: [
    { rating: 5, comments: [
      'Красивое мастерство, персиковое дерево настоящее, резьба изысканная. Ношение заставляет меня чувствовать себя защищённым!',
      'Куплено в подарок маме. Она в восторге! Качество отличное, пришло в красивой упаковке.',
    ]},
    { rating: 4, comments: [
      'Очень красивый кулон. Качество дерева хорошее, резьба детальная. Доставка была быстрой.',
    ]},
  ],
  ar: [
    { rating: 5, comments: [
      'حرفية رائعة، خشب الخوخ أصيل والنحت رائع. ارتداؤه يجعلني أشعر بالحماية!',
      'اشتريته هدية لأمي. إنها تحبه! الجودة ممتازة ووصل في تغليف جميل.',
    ]},
    { rating: 4, comments: [
      'قلادة جميلة جداً. جودة الخشب جيدة والنحت مفصل. كان الشحن سريعاً.',
    ]},
  ],
  hi: [
    { rating: 5, comments: [
      'सुंदर शिल्प कौशल, आड़ू की लकड़ी असली है और नक्काशी उत्कृष्ट है। इसे पहनने से मुझे सुरक्षित महसूस होता है!',
      'अपनी माँ के लिए उपहार के रूप में खरीदा। वह इसे बहुत पसंद करती हैं! गुणवत्ता उत्कृष्ट है।',
    ]},
    { rating: 4, comments: [
      'बहुत सुंदर लटकन। लकड़ी की गुणवत्ता अच्छी है और नक्काशी विस्तृत है।',
    ]},
  ],
  th: [
    { rating: 5, comments: [
      'งานฝีมือสวยงาม ไม้พีชแท้และการแกะสลักประณีต การสวมใส่ทำให้รู้สึกได้รับการปกป้อง!',
      'ซื้อเป็นของขวัญให้แม่ เธอชอบมาก! คุณภาพดีเยี่ยมและมาในบรรจุภัณฑ์สวยงาม',
    ]},
    { rating: 4, comments: [
      'จี้สวยมาก คุณภาพไม้ดีและการแกะสลักละเอียด การจัดส่งรวดเร็ว',
    ]},
  ],
  vi: [
    { rating: 5, comments: [
      'Thủ công mỹ nghệ tuyệt đẹp, gỗ đào thật và chạm khắc tinh xảo. Đeo nó khiến tôi cảm thấy được bảo vệ!',
      'Mua làm quà cho mẹ. Bà rất thích! Chất lượng xuất sắc và đến trong bao bì đẹp.',
    ]},
    { rating: 4, comments: [
      'Mặt dây chuyền rất đẹp. Chất lượng gỗ tốt và chạm khắc chi tiết. Giao hàng nhanh.',
    ]},
  ],
  id: [
    { rating: 5, comments: [
      'Keahlian yang indah, kayu persik asli dan ukirannya indah. Memakainya membuat saya merasa terlindungi!',
      'Dibeli sebagai hadiah untuk ibu saya. Dia menyukainya! Kualitasnya sangat baik dan tiba dengan kemasan yang indah.',
    ]},
    { rating: 4, comments: [
      'Liontin yang sangat bagus. Kualitas kayu baik dan ukirannya detail. Pengiriman cepat.',
    ]},
  ],
};

// 七彩琉璃评价
const LIULI_REVIEW_TEMPLATES = {
  en: [
    { rating: 5, comments: [
      'The colors are absolutely stunning! Seven beautiful colors representing seven blessings. I love this phone chain.',
      'Perfect gift! The crystal beads are high quality and the colors are vibrant. Consecrated at Wutai Mountain makes it extra special.',
      'Beautiful and meaningful. The seven colors bring joy every time I look at it. Highly recommend!',
      'The craftsmanship is excellent. Each bead is perfectly shaped and the colors are gorgeous.',
      'I bought this for my daughter and she loves it! The packaging was beautiful too.',
      'Amazing quality! The glazed crystal beads are so beautiful and colorful. Feel blessed wearing this.',
      'Perfect size and length. The colors are exactly as shown in the photos. Very happy with this purchase.',
      'Bought as a gift and the recipient was thrilled! Beautiful packaging and excellent quality.',
    ]},
    { rating: 4, comments: [
      'Very pretty phone chain. The beads are good quality and the colors are bright. Fast shipping.',
      'Nice piece, arrived quickly and well packaged. The colors are beautiful.',
    ]},
  ],
  zh: [
    { rating: 5, comments: [
      '七彩颜色太漂亮了！七种颜色代表七福，每次看到都心情愉悦！',
      '完美的礼物！琉璃珠质量很好，颜色鲜艳，五台山开光更加特别。',
      '漂亮又有意义，七彩带来好运，强烈推荐！',
      '做工精良，每颗珠子形状完美，颜色漂亮。',
      '给女儿买的，她非常喜欢！包装也很精美。',
      '质量很好！琉璃珠子非常漂亮，颜色丰富，戴着感觉很有福气。',
      '尺寸和长度都很合适，颜色和图片一样，非常满意这次购买。',
      '买来送礼，收礼人非常高兴！包装精美，质量出色。',
    ]},
    { rating: 4, comments: [
      '很漂亮的手机链，珠子质量好，颜色鲜艳，发货快。',
      '不错的商品，到货快，包装完好，颜色很漂亮。',
    ]},
  ],
  ja: [
    { rating: 5, comments: [
      '色が本当に美しい！七つの美しい色が七つの幸福を表しています。このスマートフォンチェーンが大好きです。',
      '完璧なプレゼント！クリスタルビーズの品質が高く、色が鮮やか。五台山で開光されているのでさらに特別です。',
    ]},
    { rating: 4, comments: [
      'とても可愛いスマートフォンチェーン。ビーズの品質が良く、色が明るい。配送も早かったです。',
    ]},
  ],
  ko: [
    { rating: 5, comments: [
      '색상이 정말 아름답습니다! 일곱 가지 아름다운 색상이 일곱 가지 복을 나타냅니다. 이 폰 체인이 너무 좋아요.',
      '완벽한 선물! 크리스탈 구슬의 품질이 높고 색상이 선명합니다. 우타이산에서 개광되어 더욱 특별합니다.',
    ]},
    { rating: 4, comments: [
      '매우 예쁜 폰 체인입니다. 구슬 품질이 좋고 색상이 밝습니다. 배송도 빨랐습니다.',
    ]},
  ],
  de: [
    { rating: 5, comments: [
      'Die Farben sind absolut atemberaubend! Sieben wunderschöne Farben, die sieben Segnungen repräsentieren. Ich liebe diese Handykette.',
    ]},
    { rating: 4, comments: [
      'Sehr hübsche Handykette. Die Perlen sind von guter Qualität und die Farben sind leuchtend. Schneller Versand.',
    ]},
  ],
  fr: [
    { rating: 5, comments: [
      'Les couleurs sont absolument époustouflantes! Sept belles couleurs représentant sept bénédictions. J\'adore cette chaîne de téléphone.',
    ]},
    { rating: 4, comments: [
      'Très jolie chaîne de téléphone. Les perles sont de bonne qualité et les couleurs sont vives. Livraison rapide.',
    ]},
  ],
  es: [
    { rating: 5, comments: [
      '¡Los colores son absolutamente impresionantes! Siete hermosos colores que representan siete bendiciones. ¡Me encanta esta cadena de teléfono!',
    ]},
    { rating: 4, comments: [
      'Cadena de teléfono muy bonita. Las cuentas son de buena calidad y los colores son brillantes. Envío rápido.',
    ]},
  ],
  pt: [
    { rating: 5, comments: [
      'As cores são absolutamente deslumbrantes! Sete belas cores representando sete bênçãos. Adoro esta corrente de telefone.',
    ]},
    { rating: 4, comments: [
      'Corrente de telefone muito bonita. As contas são de boa qualidade e as cores são vibrantes. Envio rápido.',
    ]},
  ],
  ru: [
    { rating: 5, comments: [
      'Цвета просто потрясающие! Семь прекрасных цветов, представляющих семь благословений. Я люблю эту цепочку для телефона.',
    ]},
    { rating: 4, comments: [
      'Очень красивая цепочка для телефона. Бусины хорошего качества, цвета яркие. Доставка была быстрой.',
    ]},
  ],
  ar: [
    { rating: 5, comments: [
      'الألوان رائعة للغاية! سبعة ألوان جميلة تمثل سبع بركات. أحب سلسلة الهاتف هذه.',
    ]},
    { rating: 4, comments: [
      'سلسلة هاتف جميلة جداً. الخرز جيد الجودة والألوان زاهية. الشحن كان سريعاً.',
    ]},
  ],
  hi: [
    { rating: 5, comments: [
      'रंग बिल्कुल शानदार हैं! सात सुंदर रंग सात आशीर्वादों का प्रतिनिधित्व करते हैं। मुझे यह फोन चेन बहुत पसंद है।',
    ]},
    { rating: 4, comments: [
      'बहुत सुंदर फोन चेन। मोती अच्छी गुणवत्ता के हैं और रंग चमकीले हैं। शिपिंग तेज थी।',
    ]},
  ],
  th: [
    { rating: 5, comments: [
      'สีสันสวยงามมาก! เจ็ดสีที่สวยงามแทนเจ็ดพร ฉันรักสายโทรศัพท์นี้มาก',
    ]},
    { rating: 4, comments: [
      'สายโทรศัพท์สวยมาก ลูกปัดคุณภาพดีและสีสดใส จัดส่งเร็ว',
    ]},
  ],
  vi: [
    { rating: 5, comments: [
      'Màu sắc thật tuyệt vời! Bảy màu đẹp đại diện cho bảy phúc lành. Tôi yêu dây điện thoại này.',
    ]},
    { rating: 4, comments: [
      'Dây điện thoại rất đẹp. Hạt chất lượng tốt và màu sắc tươi sáng. Giao hàng nhanh.',
    ]},
  ],
  id: [
    { rating: 5, comments: [
      'Warnanya benar-benar memukau! Tujuh warna indah yang mewakili tujuh berkah. Saya suka rantai telepon ini.',
    ]},
    { rating: 4, comments: [
      'Rantai telepon yang sangat cantik. Manik-manik berkualitas baik dan warnanya cerah. Pengiriman cepat.',
    ]},
  ],
};

// 生成评价数据
function generateReviews(productId, templates, count = 300) {
  const reviews = [];
  const langs = Object.keys(templates);
  const locations = [
    'New York, USA', 'London, UK', 'Paris, France', 'Tokyo, Japan', 'Seoul, Korea',
    'Berlin, Germany', 'Sydney, Australia', 'Toronto, Canada', 'Singapore', 'Dubai, UAE',
    'Shanghai, China', 'Beijing, China', 'Hong Kong', 'Taipei, Taiwan', 'Bangkok, Thailand',
    'Jakarta, Indonesia', 'Mumbai, India', 'São Paulo, Brazil', 'Madrid, Spain', 'Rome, Italy',
    'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Vienna, Austria', 'Zurich, Switzerland',
    'Melbourne, Australia', 'Vancouver, Canada', 'Los Angeles, USA', 'Chicago, USA',
    'San Francisco, USA', 'Miami, USA', 'Houston, USA', 'Phoenix, USA', 'Seattle, USA',
    'Boston, USA', 'Washington DC, USA', 'Dallas, USA', 'Atlanta, USA', 'Denver, USA',
    'Moscow, Russia', 'Istanbul, Turkey', 'Cairo, Egypt', 'Riyadh, Saudi Arabia',
    'Kuala Lumpur, Malaysia', 'Manila, Philippines', 'Ho Chi Minh City, Vietnam',
    'Hanoi, Vietnam', 'Chengdu, China', 'Guangzhou, China', 'Shenzhen, China',
  ];
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Oliver',
    'Charlotte', 'Benjamin', 'Amelia', 'Elijah', 'Mia', 'Lucas', 'Harper', 'Mason', 'Evelyn', 'Logan',
    'Mei', 'Wei', 'Jing', 'Fang', 'Lin', 'Yuki', 'Hana', 'Saki', 'Ji', 'Min',
    'Ana', 'Carlos', 'Maria', 'Juan', 'Sofia', 'Luis', 'Elena', 'Miguel', 'Laura', 'Diego',
    'Sophie', 'Thomas', 'Claire', 'Nicolas', 'Camille', 'Antoine', 'Léa', 'Pierre', 'Manon', 'Hugo',
    'Anna', 'Max', 'Lisa', 'Felix', 'Julia', 'Paul', 'Sarah', 'Jan', 'Laura', 'Tim',
    'Yuna', 'Jimin', 'Soo', 'Hyun', 'Jin', 'Nari', 'Eun', 'Hee', 'Young', 'Kyung',
    'Priya', 'Raj', 'Anita', 'Vikram', 'Deepa', 'Arjun', 'Kavya', 'Sanjay', 'Pooja', 'Rahul',
  ];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor',
    'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
    'Tanaka', 'Suzuki', 'Sato', 'Watanabe', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Ito', 'Kato', 'Yoshida',
    'Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim',
    'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
    'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
    'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Shah', 'Verma', 'Joshi', 'Nair',
  ];

  const startDate = new Date('2024-06-01');
  const endDate = new Date('2025-02-20');
  const dateRange = endDate - startDate;

  for (let i = 0; i < count; i++) {
    const lang = langs[i % langs.length];
    const langTemplates = templates[lang];
    const templateGroup = langTemplates[i % langTemplates.length];
    const comment = templateGroup.comments[i % templateGroup.comments.length];
    const rating = templateGroup.rating;
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const userName = `${firstName} ${lastName[0]}.`;
    const location = locations[i % locations.length];
    const createdAt = new Date(startDate.getTime() + Math.random() * dateRange);

    reviews.push({
      productId,
      userId: null,
      userName,
      rating,
      comment,
      location,
      language: lang,
      createdAt: createdAt.toISOString().slice(0, 19).replace('T', ' '),
      isVerified: 1,
      isApproved: 1,
    });
  }
  return reviews;
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  console.log('✅ 数据库连接成功');

  try {
    const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

    for (let idx = 0; idx < zodiacs.length; idx++) {
      const zodiac = zodiacs[idx];
      const productId = 630010 + idx;
      const name = getZodiacName(zodiac);
      const slug = getZodiacSlug(zodiac);
      const description = getZodiacDescription(zodiac);
      const shortDescription = getZodiacShortDesc(zodiac);
      const info = ZODIAC_INFO[zodiac];

      console.log(`\n处理 ${zodiac} 年本命佛 (ID: ${productId})...`);

      // 清理已有数据
      await conn.execute('DELETE FROM product_images WHERE productId = ?', [productId]);
      await conn.execute('DELETE FROM reviews WHERE productId = ?', [productId]);
      await conn.execute('DELETE FROM products WHERE id = ?', [productId]);

      // 插入产品
      await conn.execute(`
        INSERT INTO products (
          id, name, slug, description, shortDescription,
          regularPrice, salePrice,
          categoryId, stock, status,
          blessingTemple, blessingMaster,
          tags, suitableFor, efficacy,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          productId, name, slug, description, shortDescription,
          '58.00', '45.00',
          CATEGORY_ID, 999, 'published',
          'Wutai Mountain', 'Wutai Mountain Cultural Heritage Masters',
          JSON.stringify(['开光法物', '本命佛', '生肖守护', '五台山', '桃木', zodiac, info.en, 'health', 'safety']),
          `Those born in the Year of the ${info.en} (${info.years})`,
          `Protection, peace, wealth attraction, and blessings from ${info.buddha}`,
        ]
      );

      // 插入图片
      const images = [
        { url: ZODIAC_IMGS[zodiac], displayOrder: 0, isPrimary: 1 },
        { url: ZODIAC_SHARED_IMG1, displayOrder: 1, isPrimary: 0 },
        { url: ZODIAC_SHARED_IMG2, displayOrder: 2, isPrimary: 0 },
      ];
      for (const img of images) {
        await conn.execute(
          'INSERT INTO product_images (productId, url, fileKey, displayOrder, isPrimary, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
          [productId, img.url, img.url, img.displayOrder, img.isPrimary]
        );
      }

      // 插入300条评论
      const reviews = generateReviews(productId, REVIEW_TEMPLATES, 300);
      for (const review of reviews) {
        await conn.execute(
          `INSERT INTO reviews (productId, userId, userName, rating, comment, location, language, createdAt, isVerified, isApproved) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [review.productId, review.userId, review.userName, review.rating, review.comment,
           review.location, review.language, review.createdAt, review.isVerified, review.isApproved]
        );
      }

      console.log(`✅ ${zodiac}年本命佛 完成 (${productId}): 3张图片, 300条评论`);
    }

    // ============ 七彩琉璃手机链 ============
    const liuliId = 630022;
    const liuliSlug = 'seven-color-glazed-crystal-phone-chain';
    console.log(`\n处理 七彩琉璃手机链 (ID: ${liuliId})...`);

    await conn.execute('DELETE FROM product_images WHERE productId = ?', [liuliId]);
    await conn.execute('DELETE FROM reviews WHERE productId = ?', [liuliId]);
    await conn.execute('DELETE FROM products WHERE id = ?', [liuliId]);

    await conn.execute(`
      INSERT INTO products (
        id, name, slug, description, shortDescription,
        regularPrice, salePrice,
        categoryId, stock, status,
        blessingTemple, blessingMaster,
        tags, suitableFor, efficacy,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        liuliId,
        'Seven-Color Glazed Crystal Phone Chain',
        liuliSlug,
        `This exquisite seven-color glazed crystal phone chain is a masterpiece of traditional Chinese craftsmanship, consecrated at the sacred Wutai Mountain. The seven vibrant colors—red, orange, yellow, green, blue, indigo, and violet—each carry profound spiritual significance in Chinese culture, collectively representing the Seven Blessings: longevity, wealth, health, virtue, peace, happiness, and good fortune.

**Cultural Significance:**
In Chinese Buddhist tradition, the seven colors of the rainbow are considered sacred, representing the complete spectrum of divine blessings. Each color corresponds to a specific blessing:
- Red: Good fortune and happiness
- Orange: Creativity and enthusiasm  
- Yellow: Wealth and prosperity
- Green: Health and vitality
- Blue: Peace and tranquility
- Indigo: Wisdom and intuition
- Violet: Spiritual protection

**Consecration Ceremony:**
Each phone chain has been consecrated by enlightened masters at Wutai Mountain through traditional Buddhist ceremonies. The masters channel sacred energy into each piece, infusing it with protective power and divine blessings that accompany the owner throughout their daily life.

**Design & Craftsmanship:**
The glazed crystal flat beads (approx. 2.5×6mm) are carefully selected for their clarity and color consistency. Each bead is hand-strung on a durable cord, creating a beautiful and functional phone accessory that serves as both a spiritual talisman and a fashion statement.

**Specifications:**
- Material: Seven-color glazed crystal
- Bead size: Approx. 2.5×6mm (flat beads)
- Chain length: Approx. 20cm
- Weight: Approx. 15g
- Consecrated at: Wutai Mountain, China
- Packaging: Elegant gift box

**Perfect For:**
- Daily use as a phone accessory
- Gift for friends and family
- Anyone seeking spiritual protection and good fortune
- Those who appreciate Chinese cultural heritage

Carry the blessings of Wutai Mountain with you wherever you go with this beautiful seven-color glazed crystal phone chain.`,
        'Seven-color glazed crystal phone chain consecrated at Wutai Mountain, symbolizing seven blessings for protection and prosperity.',
        '58.00', '45.00',
        CATEGORY_ID, 999, 'published',
        'Wutai Mountain', 'Wutai Mountain Cultural Heritage Masters',
        JSON.stringify(['开光法物', '七彩琉璃', '手机链', '五台山', '七福', 'health', 'safety', 'phone chain', 'crystal']),
        'Everyone seeking good fortune, protection, and blessings',
        'Seven blessings: longevity, wealth, health, virtue, peace, happiness, and good fortune',
      ]
    );

    for (let i = 0; i < LIULI_IMGS.length; i++) {
      await conn.execute(
        'INSERT INTO product_images (productId, url, fileKey, displayOrder, isPrimary, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
        [liuliId, LIULI_IMGS[i], LIULI_IMGS[i], i, i === 0 ? 1 : 0]
      );
    }

    const liuliReviews = generateReviews(liuliId, LIULI_REVIEW_TEMPLATES, 300);
    for (const review of liuliReviews) {
      await conn.execute(
        `INSERT INTO reviews (productId, userId, userName, rating, comment, location, language, createdAt, isVerified, isApproved) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [review.productId, review.userId, review.userName, review.rating, review.comment,
         review.location, review.language, review.createdAt, review.isVerified, review.isApproved]
      );
    }

    console.log(`✅ 七彩琉璃手机链 完成 (${liuliId}): 3张图片, 300条评论`);

    console.log('\n🎉 所有13个产品处理完成！');
    console.log('产品ID范围: 630010-630022');
    console.log('分类: 平安健康 (ID: 90005)');
    console.log('每个产品: 3张图片 + 300条多语言评论');

  } catch (err) {
    console.error('❌ 错误:', err.message);
    throw err;
  } finally {
    await conn.end();
  }
}

main().catch(console.error);
