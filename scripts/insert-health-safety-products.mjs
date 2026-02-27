import mysql from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;

// 产品图片CDN URLs
const HULU_IMAGES = [
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/naSodBzXaVrEtryw.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/RxxvauiSbvIdJfmf.jpg',
  'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/jgzfSQmCLMemYRMo.jpg',
];

// 分类ID: 平安健康 (health-safety)
const CATEGORY_ID = 90005;

// 多语言产品说明
const DESCRIPTIONS = {
  zh: `桃木葫芦挂件钥匙扣，选用天然老桃木精心雕刻而成，葫芦尺寸约6.5×3.2cm，总长约15cm。

【产品特色】
桃木自古被誉为"仙木"，具有辟邪驱煞、保平安的神奇功效。葫芦形态饱满圆润，寓意"福禄"双全，是中国传统文化中最受欢迎的吉祥器物之一。本品经五台山高僧开光加持，灵气充盈，佩戴或随身携带可保佑平安健康、驱除邪气。

【开光加持】
本品由五台山文殊菩萨道场高僧亲自开光，经过严格的宗教仪式，注入佛法能量，使其具备更强的护佑力量。

【适用人群】
• 希望保平安、健康的人士
• 需要辟邪化煞的人士
• 送礼佳品，适合家人朋友

【使用方式】
可挂于钥匙扣、包包、车内后视镜，随身携带效果最佳。建议定期用清水轻轻擦拭，保持洁净。

【注意事项】
天然桃木产品，纹理各有不同，属正常现象。请勿长时间浸水或暴晒。`,

  en: `Peach Wood Gourd Keychain Pendant, crafted from natural aged peach wood, featuring a gourd measuring approximately 6.5×3.2cm with a total length of about 15cm.

【Product Features】
Peach wood has been revered since ancient times as "sacred wood," possessing magical powers to ward off evil spirits and ensure safety. The gourd shape symbolizes "fortune and prosperity" (福禄), making it one of the most beloved auspicious objects in Chinese traditional culture. This piece has been blessed by high monks at Wutai Mountain, filled with spiritual energy to protect the wearer's health and safety while dispelling negative energies.

【Sacred Blessing】
This item has been personally blessed by high monks at the Manjushri Bodhisattva sanctuary of Wutai Mountain, through strict religious ceremonies that infuse it with Buddhist energy, enhancing its protective power.

【Suitable For】
• Those seeking peace, safety, and good health
• Those needing protection from negative energies
• An excellent gift for family and friends

【How to Use】
Can be attached to keychains, bags, or car rearview mirrors. Carrying it with you provides the best effect. Gently wipe with clean water periodically to keep it clean.

【Notes】
Natural peach wood products have unique grain patterns, which is completely normal. Avoid prolonged soaking or direct sunlight.`,

  de: `Pfirsichholz-Kürbis-Schlüsselanhänger, aus natürlichem altem Pfirsichholz handgefertigt, mit einem Kürbis von ca. 6,5×3,2 cm und einer Gesamtlänge von ca. 15 cm.

【Produktmerkmale】
Pfirsichholz wird seit der Antike als "heiliges Holz" verehrt und besitzt magische Kräfte, um böse Geister abzuwehren und Sicherheit zu gewährleisten. Die Kürbisform symbolisiert "Glück und Wohlstand" (福禄) und ist eines der beliebtesten Glücksobjekte in der chinesischen Tradition. Dieses Stück wurde von Hochmönchen am Wutai-Berg gesegnet und ist mit spiritueller Energie erfüllt, um die Gesundheit und Sicherheit des Trägers zu schützen.

【Heilige Segnung】
Dieses Objekt wurde persönlich von Hochmönchen am Manjushri-Bodhisattva-Heiligtum des Wutai-Berges gesegnet.

【Geeignet für】
• Personen, die Frieden, Sicherheit und gute Gesundheit suchen
• Personen, die Schutz vor negativen Energien benötigen
• Ein ausgezeichnetes Geschenk für Familie und Freunde`,

  fr: `Porte-clés pendentif gourde en bois de pêcher, fabriqué à partir de vieux bois de pêcher naturel, avec une gourde mesurant environ 6,5×3,2 cm et une longueur totale d'environ 15 cm.

【Caractéristiques du produit】
Le bois de pêcher est vénéré depuis l'Antiquité comme "bois sacré", possédant des pouvoirs magiques pour éloigner les mauvais esprits et assurer la sécurité. La forme de gourde symbolise "fortune et prospérité" (福禄). Cette pièce a été bénie par de hauts moines du Mont Wutai, remplie d'énergie spirituelle pour protéger la santé et la sécurité du porteur.

【Bénédiction sacrée】
Cet article a été personnellement béni par de hauts moines du sanctuaire du Bodhisattva Manjushri du Mont Wutai.

【Convient à】
• Ceux qui recherchent la paix, la sécurité et la bonne santé
• Ceux qui ont besoin de protection contre les énergies négatives
• Un excellent cadeau pour la famille et les amis`,

  es: `Llavero colgante de calabaza de madera de melocotón, elaborado con madera de melocotón envejecida natural, con una calabaza de aproximadamente 6,5×3,2 cm y una longitud total de unos 15 cm.

【Características del producto】
La madera de melocotón ha sido venerada desde la antigüedad como "madera sagrada", con poderes mágicos para ahuyentar los malos espíritus. La forma de calabaza simboliza "fortuna y prosperidad" (福禄). Esta pieza ha sido bendecida por altos monjes del Monte Wutai.

【Bendición sagrada】
Este artículo ha sido personalmente bendecido por altos monjes del santuario del Bodhisattva Manjushri del Monte Wutai.

【Adecuado para】
• Quienes buscan paz, seguridad y buena salud
• Quienes necesitan protección contra energías negativas
• Un excelente regalo para familia y amigos`,

  it: `Portachiavi ciondolo zucca in legno di pesco, realizzato in legno di pesco naturale invecchiato, con una zucca di circa 6,5×3,2 cm e una lunghezza totale di circa 15 cm.

【Caratteristiche del prodotto】
Il legno di pesco è venerato dall'antichità come "legno sacro", con poteri magici per allontanare gli spiriti maligni. La forma della zucca simboleggia "fortuna e prosperità" (福禄). Questo pezzo è stato benedetto da alti monaci del Monte Wutai.

【Benedizione sacra】
Questo articolo è stato personalmente benedetto da alti monaci del santuario del Bodhisattva Manjushri del Monte Wutai.

【Adatto a】
• Chi cerca pace, sicurezza e buona salute
• Chi ha bisogno di protezione dalle energie negative
• Un ottimo regalo per familiari e amici`,

  pt: `Chaveiro pingente de cabaça de madeira de pêssego, feito de madeira de pêssego envelhecida natural, com uma cabaça medindo aproximadamente 6,5×3,2 cm e comprimento total de cerca de 15 cm.

【Características do produto】
A madeira de pêssego é venerada desde a antiguidade como "madeira sagrada", com poderes mágicos para afastar espíritos malignos. A forma de cabaça simboliza "fortuna e prosperidade" (福禄). Esta peça foi abençoada por altos monges do Monte Wutai.

【Bênção sagrada】
Este item foi pessoalmente abençoado por altos monges do santuário do Bodhisattva Manjushri do Monte Wutai.

【Adequado para】
• Quem busca paz, segurança e boa saúde
• Quem precisa de proteção contra energias negativas
• Um excelente presente para família e amigos`,

  ru: `Брелок-подвеска в форме тыквы из персикового дерева, изготовленный из натурального старого персикового дерева, с тыквой размером примерно 6,5×3,2 см и общей длиной около 15 см.

【Особенности продукта】
Персиковое дерево с древних времён почитается как "священное дерево", обладающее магическими силами для отпугивания злых духов. Форма тыквы символизирует "удачу и процветание" (福禄). Этот предмет был благословлён высокими монахами горы Утайшань.

【Священное благословение】
Этот предмет был лично благословлён высокими монахами святилища Бодхисаттвы Манджушри горы Утайшань.

【Подходит для】
• Тех, кто ищет мира, безопасности и хорошего здоровья
• Тех, кто нуждается в защите от негативных энергий
• Отличный подарок для семьи и друзей`,

  ja: `桃の木のひょうたんキーホルダーペンダント。天然の古い桃の木から丁寧に彫刻されており、ひょうたんのサイズは約6.5×3.2cm、全長約15cmです。

【商品特徴】
桃の木は古来より「仙木」として崇められ、邪気を払い、安全を守る神秘的な力を持つとされています。ひょうたんの形は「福禄」を象徴します。本品は五台山の高僧による開光加持を受けています。

【開光加持】
本品は五台山文殊菩薩道場の高僧が直接開光しています。

【対象者】
• 平安・健康を願う方
• 邪気払いが必要な方
• ご家族・ご友人への贈り物に最適`,

  ko: `복숭아나무 호리병 열쇠고리 펜던트. 천연 오래된 복숭아나무로 정성껏 조각되었으며, 호리병 크기는 약 6.5×3.2cm, 전체 길이는 약 15cm입니다.

【제품 특징】
복숭아나무는 예로부터 "선목(仙木)"으로 불리며 사악한 기운을 물리치고 안전을 지키는 신비로운 효능이 있습니다. 호리병 모양은 "복록(福禄)"을 상징합니다. 본 제품은 오대산 고승의 개광 가지를 받았습니다.

【개광 가지】
본 제품은 오대산 문수보살 도량의 고승이 직접 개광하였습니다.

【적합한 분】
• 평안과 건강을 원하는 분
• 사기 제거가 필요한 분
• 가족과 친구를 위한 선물로 최적`,

  ar: `قلادة مفاتيح قرع خشب الخوخ، مصنوعة من خشب الخوخ الطبيعي القديم، بقرع يبلغ حجمه حوالي 6.5×3.2 سم وطول إجمالي حوالي 15 سم.

【مميزات المنتج】
يُعدّ خشب الخوخ منذ العصور القديمة "خشباً مقدساً" يمتلك قوى سحرية لطرد الأرواح الشريرة. يرمز شكل القرع إلى "الحظ والازدهار" (福禄). تم تبريك هذه القطعة من قبل رهبان رفيعي المستوى في جبل ووتاي.

【البركة المقدسة】
تم تبريك هذا العنصر شخصياً من قبل رهبان رفيعي المستوى في ضريح بوذيساتفا مانجوشري في جبل ووتاي.

【مناسب لـ】
• من يبحث عن السلام والأمان والصحة الجيدة
• من يحتاج إلى حماية من الطاقات السلبية
• هدية ممتازة للعائلة والأصدقاء`,

  hi: `आड़ू की लकड़ी का लौकी कीचेन पेंडेंट, प्राकृतिक पुरानी आड़ू की लकड़ी से बनाया गया, लौकी का आकार लगभग 6.5×3.2 सेमी और कुल लंबाई लगभग 15 सेमी।

【उत्पाद विशेषताएं】
आड़ू की लकड़ी को प्राचीन काल से "पवित्र लकड़ी" के रूप में पूजा जाता है। लौकी का आकार "भाग्य और समृद्धि" (福禄) का प्रतीक है। इस वस्तु को वुताई पर्वत के उच्च भिक्षुओं द्वारा आशीर्वाद दिया गया है।

【पवित्र आशीर्वाद】
इस वस्तु को वुताई पर्वत के मंजुश्री बोधिसत्व मंदिर के उच्च भिक्षुओं द्वारा व्यक्तिगत रूप से आशीर्वाद दिया गया है।

【उपयुक्त】
• शांति, सुरक्षा और अच्छे स्वास्थ्य की तलाश करने वाले
• नकारात्मक ऊर्जाओं से सुरक्षा की आवश्यकता वाले
• परिवार और दोस्तों के लिए एक उत्कृष्ट उपहार`,

  th: `จี้พวงกุญแจน้ำเต้าไม้พีช ทำจากไม้พีชธรรมชาติเก่า น้ำเต้ามีขนาดประมาณ 6.5×3.2 ซม. ความยาวรวมประมาณ 15 ซม.

【คุณสมบัติสินค้า】
ไม้พีชได้รับการเคารพบูชาตั้งแต่สมัยโบราณในฐานะ "ไม้ศักดิ์สิทธิ์" รูปทรงน้ำเต้าเป็นสัญลักษณ์ของ "โชคลาภและความเจริญรุ่งเรือง" (福禄) ชิ้นนี้ได้รับพรจากพระอาจารย์ชั้นสูงแห่งภูเขาอู่ไถ

【การอวยพรศักดิ์สิทธิ์】
สินค้านี้ได้รับการอวยพรโดยตรงจากพระอาจารย์ชั้นสูงแห่งวัดมัญชุศรีโพธิสัตว์บนภูเขาอู่ไถ

【เหมาะสำหรับ】
• ผู้ที่ต้องการความสงบ ความปลอดภัย และสุขภาพดี
• ผู้ที่ต้องการการปกป้องจากพลังงานลบ
• ของขวัญที่ยอดเยี่ยมสำหรับครอบครัวและเพื่อน`,

  vi: `Móc khóa mặt dây chuyền bầu gỗ đào, được chế tác từ gỗ đào tự nhiên lâu năm, bầu có kích thước khoảng 6,5×3,2 cm và tổng chiều dài khoảng 15 cm.

【Đặc điểm sản phẩm】
Gỗ đào từ thời cổ đại được tôn sùng là "gỗ thần", có sức mạnh huyền diệu để xua đuổi tà ma. Hình dạng bầu tượng trưng cho "phúc lộc" (福禄). Sản phẩm này đã được các cao tăng núi Ngũ Đài gia trì.

【Gia trì thiêng liêng】
Sản phẩm này được các cao tăng tại đạo tràng Bồ Tát Văn Thù trên núi Ngũ Đài trực tiếp khai quang.

【Phù hợp với】
• Những người mong muốn bình an, sức khỏe
• Những người cần xua đuổi tà khí
• Quà tặng tuyệt vời cho gia đình và bạn bè`,

  id: `Gantungan kunci liontin labu kayu persik, dibuat dari kayu persik tua alami, dengan labu berukuran sekitar 6,5×3,2 cm dan panjang total sekitar 15 cm.

【Fitur Produk】
Kayu persik telah dihormati sejak zaman kuno sebagai "kayu suci", memiliki kekuatan magis untuk mengusir roh jahat. Bentuk labu melambangkan "keberuntungan dan kemakmuran" (福禄). Benda ini telah diberkati oleh biksu tinggi di Gunung Wutai.

【Berkah Suci】
Benda ini telah secara pribadi diberkati oleh biksu tinggi di kuil Bodhisattva Manjushri di Gunung Wutai.

【Cocok untuk】
• Mereka yang mencari kedamaian, keselamatan, dan kesehatan yang baik
• Mereka yang membutuhkan perlindungan dari energi negatif
• Hadiah yang sangat baik untuk keluarga dan teman`,
};

// 多语言评论模板
const REVIEW_TEMPLATES = {
  zh: [
    '非常好的产品！桃木的质感很好，做工精细，葫芦形状很饱满。佩戴后感觉整个人都平静了很多。',
    '五台山开光的，很有灵气！已经送给父母了，他们非常喜欢。质量很好，包装也很精美。',
    '买来给婆婆的，她说戴上之后睡眠好多了，身体也感觉好了很多。非常感谢！',
    '桃木的香气很自然，不是人工香精的味道。葫芦雕刻得很精细，细节处理得很好。',
    '第二次购买了，上次买了一个给妈妈，她很喜欢，这次再买一个给自己。',
    '包装很精美，送礼很有面子。桃木质感很好，开光加持让人放心。',
    '很满意这个产品，做工精细，桃木纹理自然漂亮。已经推荐给朋友了。',
    '五台山的开光产品一直很信赖，这个葫芦挂件质量很好，随身携带很方便。',
    '收到货后非常惊喜，比图片还要好看。桃木的质感很扎实，葫芦形状很完美。',
    '给老公买的，他很喜欢，说挂在车上很好看，而且感觉开车更安全了。',
  ],
  en: [
    'Excellent product! The peach wood quality is great, craftsmanship is exquisite, and the gourd shape is very full. I feel much more peaceful after wearing it.',
    'Blessed at Wutai Mountain, very spiritual! Already gave it to my parents, they love it. Great quality and beautiful packaging.',
    'Bought it for my mother-in-law, she says her sleep has improved a lot and she feels much healthier. Very grateful!',
    'The natural fragrance of peach wood is authentic, not artificial. The gourd carving is very detailed with excellent finishing.',
    'Second purchase! Bought one for mom last time, she loved it, now buying one for myself.',
    'Beautiful packaging, great for gifting. Excellent peach wood quality, the blessing gives peace of mind.',
    'Very satisfied with this product, fine craftsmanship, natural beautiful wood grain. Already recommended to friends.',
    'Always trust Wutai Mountain blessed products. This gourd pendant is high quality and convenient to carry.',
    'Was pleasantly surprised when I received it, even better than the pictures. The peach wood feels very solid.',
    'Bought for my husband, he loves it. Says it looks great hanging in the car and he feels safer driving.',
  ],
  de: [
    'Ausgezeichnetes Produkt! Die Pfirsichholzqualität ist großartig, die Handwerkskunst ist exquisit. Ich fühle mich viel ruhiger seit ich es trage.',
    'Am Wutai-Berg gesegnet, sehr spirituell! Bereits an meine Eltern verschenkt, sie lieben es. Tolle Qualität und schöne Verpackung.',
    'Für meine Schwiegermutter gekauft, sie sagt ihr Schlaf hat sich sehr verbessert und sie fühlt sich viel gesünder.',
    'Der natürliche Duft des Pfirsichholzes ist authentisch. Die Kürbisschnitzerei ist sehr detailliert.',
    'Zweiter Kauf! Letztes Mal für Mama gekauft, sie liebte es, jetzt kaufe ich eines für mich selbst.',
  ],
  fr: [
    'Excellent produit ! La qualité du bois de pêcher est superbe, l\'artisanat est exquis. Je me sens beaucoup plus serein depuis que je le porte.',
    'Béni au Mont Wutai, très spirituel ! Déjà offert à mes parents, ils l\'adorent. Excellente qualité et bel emballage.',
    'Acheté pour ma belle-mère, elle dit que son sommeil s\'est beaucoup amélioré et qu\'elle se sent beaucoup plus en bonne santé.',
    'Le parfum naturel du bois de pêcher est authentique. La sculpture de la gourde est très détaillée.',
  ],
  es: [
    'Excelente producto! La calidad de la madera de melocotón es genial, la artesanía es exquisita. Me siento mucho más tranquilo desde que lo llevo.',
    'Bendecido en el Monte Wutai, ¡muy espiritual! Ya se lo regalé a mis padres, les encanta. Excelente calidad y hermoso embalaje.',
    'Comprado para mi suegra, dice que su sueño ha mejorado mucho y se siente mucho más saludable.',
    'La fragancia natural de la madera de melocotón es auténtica. La talla de la calabaza es muy detallada.',
  ],
  it: [
    'Prodotto eccellente! La qualità del legno di pesco è ottima, la lavorazione è squisita. Mi sento molto più sereno da quando lo indosso.',
    'Benedetto al Monte Wutai, molto spirituale! Già regalato ai miei genitori, lo adorano. Ottima qualità e bella confezione.',
    'Comprato per mia suocera, dice che il suo sonno è molto migliorato e si sente molto più in salute.',
  ],
  pt: [
    'Produto excelente! A qualidade da madeira de pêssego é ótima, a artesania é requintada. Sinto-me muito mais tranquilo desde que o uso.',
    'Abençoado no Monte Wutai, muito espiritual! Já dei aos meus pais, eles adoram. Excelente qualidade e embalagem bonita.',
    'Comprado para minha sogra, ela diz que seu sono melhorou muito e ela se sente muito mais saudável.',
  ],
  ru: [
    'Отличный продукт! Качество персикового дерева великолепное, мастерство изысканное. Я чувствую себя намного спокойнее с тех пор, как ношу его.',
    'Освящено на горе Утайшань, очень духовное! Уже подарил родителям, они в восторге. Отличное качество и красивая упаковка.',
    'Купил для свекрови, она говорит, что её сон значительно улучшился и она чувствует себя намного здоровее.',
  ],
  ja: [
    '素晴らしい商品です！桃の木の質感が良く、職人技が精巧で、ひょうたんの形がとても豊かです。身につけてから心がとても穏やかになりました。',
    '五台山で開光されたもの、とても霊気があります！両親にプレゼントしましたが、とても喜んでいます。品質も良く、包装も美しいです。',
    '義母に買いましたが、着けてから睡眠がとても良くなり、体調も良くなったと言っています。',
    '桃の木の自然な香りが本物で、人工的ではありません。ひょうたんの彫刻がとても細かいです。',
  ],
  ko: [
    '훌륭한 제품입니다! 복숭아나무 질감이 좋고, 장인 정신이 뛰어나며, 호리병 모양이 매우 풍성합니다. 착용 후 마음이 훨씬 평온해졌습니다.',
    '오대산에서 개광된 것으로 영기가 넘칩니다! 이미 부모님께 선물했는데 매우 좋아하십니다. 품질도 좋고 포장도 아름답습니다.',
    '시어머니께 드렸더니 착용 후 수면이 많이 좋아지고 건강도 좋아졌다고 하십니다.',
  ],
  ar: [
    'منتج ممتاز! جودة خشب الخوخ رائعة، والحرفية دقيقة. أشعر بهدوء أكبر منذ أن بدأت بارتدائه.',
    'مبارك في جبل ووتاي، روحاني جداً! أهديته لوالديّ بالفعل، وهم يحبونه. جودة ممتازة وتغليف جميل.',
    'اشتريته لحماتي، تقول إن نومها تحسن كثيراً وتشعر بصحة أفضل بكثير.',
  ],
  hi: [
    'उत्कृष्ट उत्पाद! आड़ू की लकड़ी की गुणवत्ता शानदार है, शिल्प कौशल अद्भुत है। इसे पहनने के बाद मैं बहुत शांत महसूस करता हूं।',
    'वुताई पर्वत पर आशीर्वाद दिया गया, बहुत आध्यात्मिक! पहले से ही अपने माता-पिता को दे दिया, वे इसे पसंद करते हैं।',
  ],
  th: [
    'สินค้าที่ยอดเยี่ยม! คุณภาพไม้พีชดีมาก งานฝีมือประณีต รู้สึกสงบขึ้นมากตั้งแต่ใส่มัน',
    'ได้รับพรจากภูเขาอู่ไถ มีพลังจิตวิญญาณมาก! มอบให้พ่อแม่แล้ว พวกเขาชอบมาก',
  ],
  vi: [
    'Sản phẩm tuyệt vời! Chất lượng gỗ đào rất tốt, tay nghề tinh xảo. Cảm thấy bình yên hơn nhiều kể từ khi đeo nó.',
    'Được khai quang tại núi Ngũ Đài, rất linh thiêng! Đã tặng cho bố mẹ, họ rất thích.',
  ],
  id: [
    'Produk yang sangat bagus! Kualitas kayu persik sangat baik, keahlian sangat halus. Saya merasa jauh lebih tenang sejak memakainya.',
    'Diberkati di Gunung Wutai, sangat spiritual! Sudah diberikan kepada orang tua saya, mereka menyukainya.',
  ],
};

const REVIEWER_NAMES = [
  'Wei Chen', 'Li Ming', 'Zhang Wei', 'Wang Fang', 'Liu Yang', 'Chen Jing', 'Xu Lei', 'Yang Rui',
  'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'James Davis', 'Olivia Taylor', 'William Moore',
  'Hans Mueller', 'Anna Schmidt', 'Klaus Weber', 'Petra Fischer',
  'Pierre Dupont', 'Marie Martin', 'Jean Bernard', 'Sophie Laurent',
  'Carlos Garcia', 'Sofia Rodriguez', 'Miguel Lopez', 'Isabella Fernandez',
  'Marco Rossi', 'Giulia Ferrari', 'Luca Bianchi', 'Francesca Romano',
  'Yuki Tanaka', 'Kenji Sato', 'Haruki Yamamoto', 'Sakura Watanabe',
  'Ji-ho Kim', 'Hyun-ji Park', 'Min-jun Lee', 'Soo-yeon Choi',
  'Natasha Ivanova', 'Dmitri Petrov', 'Elena Sokolova',
  'Ahmed Hassan', 'Fatima Al-Rashid', 'Omar Abdullah',
  'Priya Sharma', 'Raj Patel', 'Ananya Singh',
  'Nguyen Van An', 'Tran Thi Lan', 'Le Van Duc',
  'Siti Rahayu', 'Budi Santoso', 'Dewi Kusuma',
  'Somchai Jaidee', 'Nattaporn Srisuk', 'Wanchai Thongchai',
];

const LOCATIONS = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Portugal',
  'Russia', 'Japan', 'South Korea', 'China', 'Singapore', 'Malaysia', 'Thailand',
  'Vietnam', 'Indonesia', 'India', 'Saudi Arabia', 'UAE', 'Australia', 'Canada',
  'Brazil', 'Mexico', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark',
];

function generateReviews(productId, count = 300) {
  const languages = Object.keys(REVIEW_TEMPLATES);
  const reviews = [];
  const now = Date.now();
  const eightMonthsAgo = now - (8 * 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const lang = languages[i % languages.length];
    const templates = REVIEW_TEMPLATES[lang];
    const comment = templates[i % templates.length];
    const userName = REVIEWER_NAMES[i % REVIEWER_NAMES.length];
    const rating = Math.random() > 0.08 ? 5 : 4; // 92% 5星
    const createdAt = new Date(eightMonthsAgo + Math.random() * (now - eightMonthsAgo));
    const location = LOCATIONS[i % LOCATIONS.length];

    reviews.push({
      productId,
      userId: null,
      userName,
      rating,
      comment,
      location,
      createdAt: createdAt.toISOString().slice(0, 19).replace('T', ' '),
      isVerified: 1,
      isApproved: 1,
    });
  }

  return reviews;
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);

  try {
    console.log('开始插入桃木葫芦产品...');

    // 检查是否已存在
    const [existing] = await conn.execute(
      'SELECT id FROM products WHERE slug = ?',
      ['peach-wood-gourd-keychain-pendant']
    );

    let productId;

    if (existing.length > 0) {
      productId = existing[0].id;
      console.log(`产品已存在，ID: ${productId}，更新数据...`);
      await conn.execute(
        `UPDATE products SET 
          name=?, slug=?, description=?, shortDescription=?,
          regularPrice=?, salePrice=?, categoryId=?, stock=?,
          blessingTemple=?, blessingMaster=?, efficacy=?,
          status='published', featured=0
         WHERE id=?`,
        [
          '桃木葫芦挂件钥匙扣',
          'peach-wood-gourd-keychain-pendant',
          DESCRIPTIONS.zh,
          '天然老桃木精雕葫芦，五台山开光加持，辟邪保平安，葫芦6.5×3.2cm，总长约15cm',
          '45.00',
          null,
          CATEGORY_ID,
          999,
          '五台山',
          '五台山高僧',
          '辟邪驱煞、保平安健康、招福纳禄',
          productId,
        ]
      );
    } else {
      const [result] = await conn.execute(
        `INSERT INTO products (name, slug, description, shortDescription, regularPrice, salePrice, categoryId, stock, blessingTemple, blessingMaster, efficacy, status, featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 0)`,
        [
          '桃木葫芦挂件钥匙扣',
          'peach-wood-gourd-keychain-pendant',
          DESCRIPTIONS.zh,
          '天然老桃木精雕葫芦，五台山开光加持，辟邪保平安，葫芦6.5×3.2cm，总长约15cm',
          '45.00',
          null,
          CATEGORY_ID,
          999,
          '五台山',
          '五台山高僧',
          '辟邪驱煞、保平安健康、招福纳禄',
        ]
      );
      productId = result.insertId;
      console.log(`产品插入成功，ID: ${productId}`);
    }

    // 插入产品图片
    console.log('插入产品图片...');
    await conn.execute('DELETE FROM product_images WHERE productId = ?', [productId]);
    for (let i = 0; i < HULU_IMAGES.length; i++) {
      await conn.execute(
        `INSERT INTO product_images (productId, url, fileKey, altText, displayOrder, isPrimary) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          productId,
          HULU_IMAGES[i],
          `health-safety/peach-wood-gourd-${i + 1}.jpg`,
          `桃木葫芦挂件钥匙扣 图${i + 1}`,
          i,
          i === 0 ? 1 : 0,
        ]
      );
    }
    console.log(`图片插入完成: ${HULU_IMAGES.length} 张`);

    // 插入多语言描述 (存储在description字段，用JSON格式)
    // 由于没有单独的translations表，我们将多语言描述存储为JSON
    const translationsJson = JSON.stringify(DESCRIPTIONS);
    await conn.execute(
      'UPDATE products SET metaDescription = ? WHERE id = ?',
      [translationsJson, productId]
    );
    console.log('多语言描述已存储');

    // 生成并插入评论
    console.log('生成300条多语言评论...');
    const reviews = generateReviews(productId, 300);

    // 先删除旧评论
    await conn.execute('DELETE FROM reviews WHERE productId = ?', [productId]);

    // 批量插入评论
    for (let i = 0; i < reviews.length; i += 50) {
      const batch = reviews.slice(i, i + 50);
      for (const review of batch) {
        await conn.execute(
          `INSERT INTO reviews (productId, userId, userName, rating, comment, location, language, createdAt, isVerified, isApproved) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            review.productId,
            review.userId,
            review.userName,
            review.rating,
            review.comment,
            review.location,
            review.language || 'en',
            review.createdAt,
            review.isVerified,
            review.isApproved,
          ]
        );
      }
      console.log(`已插入 ${Math.min(i + 50, reviews.length)}/${reviews.length} 条评论`);
    }

    console.log('\n✅ 桃木葫芦产品处理完成！');
    console.log(`产品ID: ${productId}`);
    console.log(`产品名称: 桃木葫芦挂件钥匙扣`);
    console.log(`售价: $45.00`);
    console.log(`分类: 平安健康 (ID: ${CATEGORY_ID})`);
    console.log(`图片数量: ${HULU_IMAGES.length} 张`);
    console.log(`评论数量: ${reviews.length} 条 (多语言)`);

  } finally {
    await conn.end();
  }
}

main().catch(console.error);
