import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// 读取商品数据
const productsData = JSON.parse(fs.readFileSync('/home/ubuntu/zodiac_products_data.json', 'utf-8'));

// 获取"开光法物"分类ID (假设categoryId=1)
const BLESSED_ITEMS_CATEGORY_ID = 1;

console.log(`开始导入${productsData.length}个生肖商品...`);

for (const product of productsData) {
  const nameZh = `五台山开光${product.zodiac}守护吊坠`;
  const nameEn = `Wutai Mountain Blessed ${product.zodiacEn} Zodiac Guardian Pendant`;
  
  // 构建多语言名称对象
  const names = {
    zh: nameZh,
    en: nameEn,
    es: `Colgante Guardián del Zodiaco ${product.zodiacEn} Bendecido de la Montaña Wutai`,
    fr: `Pendentif Gardien du Zodiaque ${product.zodiacEn} Béni de la Montagne Wutai`,
    de: `Wutai Berg Gesegneter ${product.zodiacEn} Sternzeichen Schutzanhänger`,
    it: `Ciondolo Guardiano dello Zodiaco ${product.zodiacEn} Benedetto della Montagna Wutai`,
    pt: `Pingente Guardião do Zodíaco ${product.zodiacEn} Abençoado da Montanha Wutai`,
    ru: `Благословенный кулон-хранитель знака зодиака ${product.zodiacEn} с горы Утай`,
    ja: `五台山開光${product.zodiac}守護ペンダント`,
    ko: `오대산 개광 ${product.zodiac} 수호 펜던트`,
    ar: `قلادة حامي برج ${product.zodiacEn} المباركة من جبل ووتاي`,
    hi: `वुताई पर्वत धन्य ${product.zodiacEn} राशि संरक्षक पेंडेंट`,
    th: `จี้ผู้พิทักษ์ราศี ${product.zodiacEn} ที่ได้รับพรจากภูเขาอู่ไถ`,
    vi: `Mặt Dây Chuyền Hộ Mệnh Cung Hoàng Đạo ${product.zodiacEn} Khai Quang Núi Ngũ Đài`,
    id: `Liontin Pelindung Zodiak ${product.zodiacEn} Diberkati dari Gunung Wutai`,
    tr: `Wutai Dağı Kutsal ${product.zodiacEn} Burcu Koruyucu Kolye`
  };
  
  // 构建多语言描述对象
  const descriptions = {
    zh: product.descriptionZh,
    en: `In Eastern cultural heritage, the 12 Chinese Zodiac signs are far more than symbols — they're tied to unique personal traits, life rhythms, and the subtle connection between individuals and traditional wisdom. Those born in the Year of the ${product.zodiacEn} are ${product.traits}. This ${product.zodiacEn} zodiac guardian pendant is intricately carved, integrating the ${product.zodiacEn}'s iconic image with time-honored Eastern symbols like the Yin-Yang, echoing ancient cosmic philosophy, framed by detailed decorative patterns that exude rustic luxury. Elevated by an ancient Eastern energy-alignment ritual performed by Wutai Mountain monks, each pendant transforms into your personalized symbolic guardian. Crafted from vintage brass with a rich, textured finish that balances timeless elegance and mystical depth, it's more than an accessory — it's a wearable link to the profound mystique of Eastern culture, tied to your unique zodiac identity.`,
    es: `En el patrimonio cultural oriental, los 12 signos del zodíaco chino son mucho más que símbolos: están vinculados a rasgos personales únicos, ritmos de vida y la conexión sutil entre individuos y la sabiduría tradicional. Los nacidos en el Año del ${product.zodiacEn} son ${product.traits}. Este colgante guardián del zodíaco ${product.zodiacEn} está intrincadamente tallado, integrando la imagen icónica del ${product.zodiacEn} con símbolos orientales ancestrales como el Yin-Yang, enmarcado por patrones decorativos detallados que exudan lujo rústico. Elevado por un antiguo ritual de alineación energética oriental realizado por monjes de la Montaña Wutai, cada colgante se transforma en tu guardián simbólico personalizado.`,
    fr: `Dans l'héritage culturel oriental, les 12 signes du zodiaque chinois sont bien plus que des symboles — ils sont liés à des traits personnels uniques, des rythmes de vie et la connexion subtile entre les individus et la sagesse traditionnelle. Les personnes nées l'Année du ${product.zodiacEn} sont ${product.traits}. Ce pendentif gardien du zodiaque ${product.zodiacEn} est finement sculpté, intégrant l'image iconique du ${product.zodiacEn} avec des symboles orientaux ancestraux comme le Yin-Yang, encadré par des motifs décoratifs détaillés qui dégagent un luxe rustique. Élevé par un ancien rituel d'alignement énergétique oriental effectué par les moines de la Montagne Wutai, chaque pendentif se transforme en votre gardien symbolique personnalisé.`,
    de: `Im östlichen Kulturerbe sind die 12 chinesischen Tierkreiszeichen weit mehr als Symbole — sie sind mit einzigartigen persönlichen Eigenschaften, Lebensrhythmen und der subtilen Verbindung zwischen Individuen und traditioneller Weisheit verbunden. Im Jahr des ${product.zodiacEn} Geborene sind ${product.traits}. Dieser ${product.zodiacEn}-Sternzeichen-Schutzanhänger ist kunstvoll geschnitzt und integriert das ikonische Bild des ${product.zodiacEn} mit altehrwürdigen östlichen Symbolen wie Yin-Yang, eingerahmt von detaillierten dekorativen Mustern, die rustikalen Luxus ausstrahlen. Durch ein altes östliches Energie-Ausrichtungsritual der Wutai-Berg-Mönche verwandelt sich jeder Anhänger in Ihren personalisierten symbolischen Wächter.`,
    it: `Nel patrimonio culturale orientale, i 12 segni zodiacali cinesi sono molto più che simboli — sono legati a tratti personali unici, ritmi di vita e la connessione sottile tra individui e saggezza tradizionale. I nati nell'Anno del ${product.zodiacEn} sono ${product.traits}. Questo ciondolo guardiano dello zodiaco ${product.zodiacEn} è finemente scolpito, integrando l'immagine iconica del ${product.zodiacEn} con simboli orientali ancestrali come lo Yin-Yang, incorniciato da motivi decorativi dettagliati che trasudano lusso rustico. Elevato da un antico rituale di allineamento energetico orientale eseguito dai monaci della Montagna Wutai, ogni ciondolo si trasforma nel tuo guardiano simbolico personalizzato.`,
    pt: `Na herança cultural oriental, os 12 signos do zodíaco chinês são muito mais do que símbolos — estão ligados a traços pessoais únicos, ritmos de vida e a conexão sutil entre indivíduos e sabedoria tradicional. Os nascidos no Ano do ${product.zodiacEn} são ${product.traits}. Este pingente guardião do zodíaco ${product.zodiacEn} é intrincadamente esculpido, integrando a imagem icônica do ${product.zodiacEn} com símbolos orientais ancestrais como o Yin-Yang, emoldurado por padrões decorativos detalhados que exalam luxo rústico. Elevado por um antigo ritual de alinhamento energético oriental realizado pelos monges da Montanha Wutai, cada pingente se transforma em seu guardião simbólico personalizado.`,
    ru: `В восточном культурном наследии 12 знаков китайского зодиака — это гораздо больше, чем символы. Они связаны с уникальными личными чертами, жизненными ритмами и тонкой связью между людьми и традиционной мудростью. Рожденные в год ${product.zodiacEn} ${product.traits}. Этот кулон-хранитель знака зодиака ${product.zodiacEn} искусно вырезан, объединяя культовое изображение ${product.zodiacEn} с древними восточными символами, такими как Инь-Ян, обрамленное детализированными декоративными узорами, излучающими деревенскую роскошь. Возвышенный древним восточным ритуалом выравнивания энергии, проводимым монахами горы Утай, каждый кулон превращается в ваш персонализированный символический талисман.`,
    ja: product.descriptionZh.replace(/五台山/g, '五台山'),
    ko: product.descriptionZh,
    ar: `في التراث الثقافي الشرقي، الأبراج الصينية الـ 12 هي أكثر بكثير من مجرد رموز — فهي مرتبطة بسمات شخصية فريدة وإيقاعات حياة والاتصال الدقيق بين الأفراد والحكمة التقليدية. المولودون في عام ${product.zodiacEn} ${product.traits}. قلادة حامي برج ${product.zodiacEn} هذه منحوتة بشكل معقد، تدمج الصورة الأيقونية لـ ${product.zodiacEn} مع رموز شرقية قديمة مثل الين واليانغ، محاطة بأنماط زخرفية مفصلة تنضح بالفخامة الريفية. مرتفعة بطقوس محاذاة الطاقة الشرقية القديمة التي يؤديها رهبان جبل ووتاي، تتحول كل قلادة إلى حارسك الرمزي الشخصي.`,
    hi: `पूर्वी सांस्कृतिक विरासत में, 12 चीनी राशि चिह्न केवल प्रतीकों से कहीं अधिक हैं — वे अद्वितीय व्यक्तिगत लक्षणों, जीवन लय और व्यक्तियों और पारंपरिक ज्ञान के बीच सूक्ष्म संबंध से जुड़े हैं। ${product.zodiacEn} वर्ष में जन्मे लोग ${product.traits} हैं। यह ${product.zodiacEn} राशि संरक्षक पेंडेंट जटिल रूप से उकेरा गया है, ${product.zodiacEn} की प्रतिष्ठित छवि को यिन-यांग जैसे प्राचीन पूर्वी प्रतीकों के साथ एकीकृत करता है, विस्तृत सजावटी पैटर्न द्वारा तैयार किया गया है जो देहाती विलासिता को प्रदर्शित करता है। वुताई पर्वत के भिक्षुओं द्वारा किए गए प्राचीन पूर्वी ऊर्जा संरेखण अनुष्ठान द्वारा उन्नत, प्रत्येक पेंडेंट आपके व्यक्तिगत प्रतीकात्मक संरक्षक में बदल जाता है।`,
    th: `ในมรดกทางวัฒนธรรมตะวันออก ราศีจีน 12 ราศีเป็นมากกว่าสัญลักษณ์ — พวกเขาเชื่อมโยงกับลักษณะส่วนบุคคลที่เป็นเอกลักษณ์ จังหวะชีวิต และการเชื่อมต่ออันละเอียดอ่อนระหว่างบุคคลและภูมิปัญญาดั้งเดิม ผู้ที่เกิดในปี ${product.zodiacEn} ${product.traits} จี้ผู้พิทักษ์ราศี ${product.zodiacEn} นี้แกะสลักอย่างประณีต รวมภาพสัญลักษณ์ของ ${product.zodiacEn} เข้ากับสัญลักษณ์ตะวันออกโบราณเช่นหยินหยาง ล้อมรอบด้วยลวดลายตกแต่งที่ละเอียดซึ่งเปล่งประกายความหรูหราแบบชนบท ยกระดับด้วยพิธีกรรมการจัดตำแหน่งพลังงานตะวันออกโบราณที่ดำเนินการโดยพระภูเขาอู่ไถ จี้แต่ละชิ้นกลายเป็นผู้พิทักษ์สัญลักษณ์ส่วนตัวของคุณ`,
    vi: product.descriptionZh,
    id: `Dalam warisan budaya Timur, 12 tanda zodiak Tiongkok jauh lebih dari sekadar simbol — mereka terkait dengan sifat pribadi yang unik, ritme kehidupan, dan hubungan halus antara individu dan kebijaksanaan tradisional. Mereka yang lahir di Tahun ${product.zodiacEn} adalah ${product.traits}. Liontin pelindung zodiak ${product.zodiacEn} ini diukir dengan rumit, mengintegrasikan gambar ikonik ${product.zodiacEn} dengan simbol Timur kuno seperti Yin-Yang, dibingkai oleh pola dekoratif terperinci yang memancarkan kemewahan pedesaan. Ditingkatkan oleh ritual penyelarasan energi Timur kuno yang dilakukan oleh biksu Gunung Wutai, setiap liontin berubah menjadi pelindung simbolis pribadi Anda.`,
    tr: `Doğu kültürel mirasında, 12 Çin burcu sembollerden çok daha fazlasıdır — benzersiz kişisel özellikler, yaşam ritimleri ve bireyler ile geleneksel bilgelik arasındaki ince bağlantıyla ilişkilidirler. ${product.zodiacEn} Yılında doğanlar ${product.traits}. Bu ${product.zodiacEn} burcu koruyucu kolyesi ustaca oyulmuş, ${product.zodiacEn}'ın ikonik görüntüsünü Yin-Yang gibi eski Doğu sembolleriyle bütünleştirerek, rustik lüksü yansıtan ayrıntılı dekoratif desenlerle çerçevelenmiştir. Wutai Dağı keşişleri tarafından gerçekleştirilen eski bir Doğu enerji hizalama ritüeliyle yükseltilen her kolye, kişiselleştirilmiş sembolik koruyucunuza dönüşür.`
  };
  
  try {
    const result = await db.insert(schema.products).values({
      name: JSON.stringify(names),
      slug: product.slug,
      description: JSON.stringify(descriptions),
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      categoryId: BLESSED_ITEMS_CATEGORY_ID,
      images: JSON.stringify([product.imageUrl]),
      stock: 999,
      status: 'published',
      featured: true,
      tags: JSON.stringify(['开光法物', '生肖守护', '五台山', product.zodiac, product.zodiacEn])
    });
    
    console.log(`✅ 成功导入: ${nameZh} (${product.zodiacEn})`);
  } catch (error) {
    console.error(`❌ 导入失败: ${nameZh}`, error.message);
  }
}

console.log('\n导入完成!');
await connection.end();
