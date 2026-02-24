/**
 * 修复产品翻译错误
 * 将 "Error: Could not translate." 替换为正确的翻译
 */
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq, like } from 'drizzle-orm';
import { products } from '../drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// 支持的语言列表
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'hi', 'id', 'it', 'ja', 'ko', 'pt', 'ru', 'th', 'tr', 'vi', 'zh', 'zh-Hant'];

// 翻译修复数据
const fixes = {
  // ID 6: 月牙星座吊坠
  6: {
    name: {
      zh: '月牙星座吊坠',
      'zh-Hant': '月牙星座吊墜',
      en: 'Crescent Moon Zodiac Pendant',
      ja: '三日月星座ペンダント',
      ko: '초승달 별자리 펜던트',
      de: 'Halbmond-Sternzeichen-Anhänger',
      fr: 'Pendentif Croissant de Lune Zodiacal',
      es: 'Colgante Zodiacal de Luna Creciente',
      pt: 'Pingente Zodiacal de Lua Crescente',
      it: 'Ciondolo Zodiacale Luna Crescente',
      ru: 'Кулон Зодиака Полумесяц',
      ar: 'قلادة الأبراج الهلالية',
      hi: 'अर्धचंद्र राशि पेंडेंट',
      th: 'จี้ราศีพระจันทร์เสี้ยว',
      vi: 'Mặt dây chuyền cung hoàng đạo trăng lưỡi liềm',
      id: 'Liontin Zodiak Bulan Sabit',
      tr: 'Hilal Burç Kolye Ucu',
    },
    shortDescription: {
      zh: '一款优雅的月牙星座吊坠，展现您的独特星座魅力。',
      'zh-Hant': '一款優雅的月牙星座吊墜，展現您的獨特星座魅力。',
      en: 'An elegant crescent moon zodiac pendant that showcases your unique astrological charm.',
      ja: 'あなたの星座の魅力を引き出すエレガントな三日月ペンダント。',
      ko: '당신만의 별자리 매력을 보여주는 우아한 초승달 펜던트.',
      de: 'Ein eleganter Halbmond-Anhänger, der Ihren einzigartigen Sternzeichen-Charme zeigt.',
      fr: 'Un élégant pendentif en croissant de lune qui met en valeur votre charme astrologique unique.',
      es: 'Un elegante colgante de luna creciente que muestra tu encanto zodiacal único.',
      pt: 'Um elegante pingente de lua crescente que exibe seu charme zodiacal único.',
      it: 'Un elegante ciondolo a luna crescente che mostra il tuo fascino zodiacale unico.',
      ru: 'Элегантный кулон в виде полумесяца, раскрывающий вашу уникальную зодиакальную харизму.',
      ar: 'قلادة هلالية أنيقة تُبرز سحر برجك الفريد.',
      hi: 'एक सुंदर अर्धचंद्र राशि पेंडेंट जो आपकी अनूठी ज्योतिषीय आभा को प्रदर्शित करता है।',
      th: 'จี้พระจันทร์เสี้ยวอันสง่างามที่แสดงเสน่ห์ราศีอันเป็นเอกลักษณ์ของคุณ',
      vi: 'Mặt dây chuyền trăng lưỡi liềm thanh lịch thể hiện sức hấp dẫn cung hoàng đạo độc đáo của bạn.',
      id: 'Liontin bulan sabit yang elegan menampilkan pesona zodiak unik Anda.',
      tr: 'Eşsiz burç çekiciliğinizi sergileyen zarif bir hilal kolye ucu.',
    },
  },
  // ID 8: 双重祈福套餐
  8: {
    name: {
      zh: '双重祈福套餐',
      'zh-Hant': '雙重祈福套餐',
      en: 'Dual Blessings Package',
      ja: '二重祈福パッケージ',
      ko: '이중 축복 패키지',
      de: 'Doppelsegen-Paket',
      fr: 'Forfait Double Bénédiction',
      es: 'Paquete de Doble Bendición',
      pt: 'Pacote de Dupla Bênção',
      it: 'Pacchetto Doppia Benedizione',
      ru: 'Пакет двойного благословения',
      ar: 'باقة البركة المزدوجة',
      hi: 'दोहरा आशीर्वाद पैकेज',
      th: 'แพ็คเกจอวยพรคู่',
      vi: 'Gói phước lành đôi',
      id: 'Paket Berkah Ganda',
      tr: 'Çift Kutsama Paketi',
    },
    shortDescription: {
      zh: '此套餐包含两款由五台山高僧加持的殊胜法宝，为您和您的家人带来事业与健康的双重祝福。',
      'zh-Hant': '此套餐包含兩款由五台山高僧加持的殊勝法寶，為您和您的家人帶來事業與健康的雙重祝福。',
      en: 'This package includes two sacred treasures blessed by eminent monks of Wutai Mountain, bringing dual blessings of career and health to you and your family.',
      ja: '五台山の高僧が加持した二つの殊勝な法宝を含むセット。あなたとご家族に事業と健康の二重の祝福をお届けします。',
      ko: '이 패키지에는 오대산 고승이 가지한 두 가지 수승한 법보가 포함되어 있으며, 당신과 가족에게 사업과 건강의 이중 축복을 가져다 줍니다.',
      de: 'Dieses Paket enthält zwei von den ehrwürdigen Mönchen des Wutai-Berges gesegnete heilige Schätze, die Ihnen und Ihrer Familie doppelten Segen für Karriere und Gesundheit bringen.',
      fr: 'Ce forfait comprend deux trésors sacrés bénis par les éminents moines du Mont Wutai, apportant une double bénédiction de carrière et de santé à vous et votre famille.',
      es: 'Este paquete incluye dos tesoros sagrados bendecidos por los eminentes monjes del Monte Wutai, trayendo doble bendición de carrera y salud para usted y su familia.',
      pt: 'Este pacote inclui dois tesouros sagrados abençoados pelos eminentes monges do Monte Wutai, trazendo dupla bênção de carreira e saúde para você e sua família.',
      it: 'Questo pacchetto include due tesori sacri benedetti dagli eminenti monaci del Monte Wutai, portando doppia benedizione di carriera e salute a te e alla tua famiglia.',
      ru: 'Этот пакет включает два священных сокровища, благословлённых выдающимися монахами горы Утайшань, приносящих двойное благословение карьеры и здоровья вам и вашей семье.',
      ar: 'تتضمن هذه الباقة كنزين مقدسين مباركين من رهبان جبل ووتاي البارزين، مما يجلب بركة مزدوجة في المسيرة المهنية والصحة لك ولعائلتك.',
      hi: 'इस पैकेज में वुताई पर्वत के प्रतिष्ठित भिक्षुओं द्वारा आशीर्वादित दो पवित्र खजाने शामिल हैं, जो आपको और आपके परिवार को करियर और स्वास्थ्य का दोहरा आशीर्वाद प्रदान करते हैं।',
      th: 'แพ็คเกจนี้ประกอบด้วยสมบัติศักดิ์สิทธิ์สองชิ้นที่ได้รับพรจากพระอาจารย์แห่งภูเขาอู่ไถ นำพรคู่แห่งอาชีพและสุขภาพมาสู่คุณและครอบครัว',
      vi: 'Gói này bao gồm hai bảo vật linh thiêng được các vị cao tăng Ngũ Đài Sơn gia trì, mang đến phước lành đôi về sự nghiệp và sức khỏe cho bạn và gia đình.',
      id: 'Paket ini mencakup dua harta suci yang diberkati oleh biksu terkemuka Gunung Wutai, membawa berkah ganda karier dan kesehatan untuk Anda dan keluarga.',
      tr: 'Bu paket, Wutai Dağı\'nın seçkin keşişleri tarafından kutsanmış iki kutsal hazine içerir ve size ve ailenize kariyer ve sağlık açısından çifte kutsama getirir.',
    },
  },
  // ID 30015: 五台山加持双子座守护吊坠 (只有部分语言错误)
  30015: {
    name: {
      zh: '五台山加持双子座守护吊坠',
      'zh-Hant': '五台山加持雙子座守護吊墜',
      en: 'Wutai Mountain Blessed Gemini Guardian Pendant',
      de: 'Wutai-Berg Gesegneter Zwillinge-Schutzanhänger',
      fr: 'Pendentif Protecteur Gémeaux Béni du Mont Wutai',
      ja: '五台山加持ふたご座守護ペンダント',
      ko: '오대산 가지 쌍둥이자리 수호 펜던트',
      es: 'Colgante Guardián de Géminis Bendecido del Monte Wutai',
      pt: 'Pingente Guardião de Gêmeos Abençoado do Monte Wutai',
      it: 'Ciondolo Guardiano dei Gemelli Benedetto del Monte Wutai',
      ru: 'Кулон-хранитель Близнецов, благословлённый горой Утайшань',
      ar: 'قلادة حارس الجوزاء المباركة من جبل ووتاي',
      hi: 'वुताई पर्वत आशीर्वादित मिथुन रक्षक पेंडेंट',
      th: 'จี้ราศีเมถุนพิทักษ์อวยพรจากภูเขาอู่ไถ',
      vi: 'Mặt dây chuyền hộ mệnh Song Tử gia trì Ngũ Đài Sơn',
      id: 'Liontin Pelindung Gemini Berkah Gunung Wutai',
      tr: 'Wutai Dağı Kutsanmış İkizler Koruyucu Kolye Ucu',
    },
  },
  // ID 30007: 五台山加持马年守护吊坠
  30007: {
    name: {
      zh: '五台山加持马年守护吊坠',
      'zh-Hant': '五台山加持馬年守護吊墜',
      en: 'Mount Wutai Blessed Year of the Horse Protective Pendant',
      de: 'Berg Wutai Gesegneter Pferdejahr-Schutzanhänger',
      fr: 'Pendentif Protecteur Année du Cheval Béni du Mont Wutai',
      ja: '五台山加持午年守護ペンダント',
      ko: '오대산 가지 말띠 수호 펜던트',
      es: 'Colgante Protector del Año del Caballo Bendecido del Monte Wutai',
      pt: 'Pingente Protetor do Ano do Cavalo Abençoado do Monte Wutai',
      it: 'Ciondolo Protettivo Anno del Cavallo Benedetto del Monte Wutai',
      ru: 'Кулон-хранитель года Лошади, благословлённый горой Утайшань',
      ar: 'قلادة حماية عام الحصان المباركة من جبل ووتاي',
      hi: 'वुताई पर्वत आशीर्वादित घोड़ा वर्ष रक्षक पेंडेंट',
      th: 'จี้ปีม้าพิทักษ์อวยพรจากภูเขาอู่ไถ',
      vi: 'Mặt dây chuyền hộ mệnh tuổi Ngọ gia trì Ngũ Đài Sơn',
      id: 'Liontin Pelindung Tahun Kuda Berkah Gunung Wutai',
      tr: 'Wutai Dağı Kutsanmış At Yılı Koruyucu Kolye Ucu',
    },
  },
  // ID 30006: 五台山加持蛇护符吊坠
  30006: {
    name: {
      zh: '五台山加持蛇护符吊坠',
      'zh-Hant': '五台山加持蛇護符吊墜',
      en: 'Mount Wutai Blessed Snake Talisman Pendant',
      de: 'Berg Wutai Gesegneter Schlangen-Talisman-Anhänger',
      fr: 'Pendentif Talisman du Serpent Béni du Mont Wutai',
      ja: '五台山加持巳年護符ペンダント',
      ko: '오대산 가지 뱀띠 부적 펜던트',
      es: 'Colgante Talismán de la Serpiente Bendecido del Monte Wutai',
      pt: 'Pingente Talismã da Serpente Abençoado do Monte Wutai',
      it: 'Ciondolo Talismano del Serpente Benedetto del Monte Wutai',
      ru: 'Кулон-талисман Змеи, благословлённый горой Утайшань',
      ar: 'قلادة تعويذة الأفعى المباركة من جبل ووتاي',
      hi: 'वुताई पर्वत आशीर्वादित सर्प ताबीज पेंडेंट',
      th: 'จี้เครื่องรางปีงูอวยพรจากภูเขาอู่ไถ',
      vi: 'Mặt dây chuyền bùa hộ mệnh tuổi Tỵ gia trì Ngũ Đài Sơn',
      id: 'Liontin Jimat Ular Berkah Gunung Wutai',
      tr: 'Wutai Dağı Kutsanmış Yılan Tılsım Kolye Ucu',
    },
  },
};

// 修复函数
async function fixTranslations() {
  console.log('🔧 开始修复产品翻译错误...\n');

  for (const [productId, fixData] of Object.entries(fixes)) {
    const id = parseInt(productId);
    console.log(`📦 修复产品 ID: ${id}`);

    // 获取当前产品数据
    const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) {
      console.log(`  ⚠️ 产品 ID ${id} 不存在，跳过`);
      continue;
    }

    const updates = {};

    // 修复 name
    if (fixData.name) {
      let nameObj = {};
      try {
        nameObj = JSON.parse(product.name);
      } catch {
        nameObj = {};
      }
      // 替换所有翻译错误的值
      for (const [lang, value] of Object.entries(nameObj)) {
        if (typeof value === 'string' && value.includes('Error: Could not translate')) {
          if (fixData.name[lang]) {
            nameObj[lang] = fixData.name[lang];
          }
        }
      }
      // 补充缺失的语言
      for (const [lang, value] of Object.entries(fixData.name)) {
        if (!nameObj[lang] || nameObj[lang].includes('Error')) {
          nameObj[lang] = value;
        }
      }
      updates.name = JSON.stringify(nameObj);
      console.log(`  ✅ name 已修复`);
    }

    // 修复 shortDescription
    if (fixData.shortDescription) {
      let sdObj = {};
      try {
        sdObj = JSON.parse(product.shortDescription || '{}');
      } catch {
        sdObj = {};
      }
      for (const [lang, value] of Object.entries(sdObj)) {
        if (typeof value === 'string' && value.includes('Error: Could not translate')) {
          if (fixData.shortDescription[lang]) {
            sdObj[lang] = fixData.shortDescription[lang];
          }
        }
      }
      for (const [lang, value] of Object.entries(fixData.shortDescription)) {
        if (!sdObj[lang] || sdObj[lang].includes('Error')) {
          sdObj[lang] = value;
        }
      }
      updates.shortDescription = JSON.stringify(sdObj);
      console.log(`  ✅ shortDescription 已修复`);
    }

    // 更新数据库
    if (Object.keys(updates).length > 0) {
      await db.update(products).set(updates).where(eq(products.id, id));
      console.log(`  ✅ 数据库已更新\n`);
    }
  }

  // 额外：修复所有产品中 description 和 wearingGuide 的翻译错误
  console.log('\n🔍 扫描所有产品的 description 和 wearingGuide 字段...');
  const allProducts = await db.select().from(products);
  let fixedCount = 0;

  for (const product of allProducts) {
    const updates = {};
    const fieldsToCheck = ['description', 'wearingGuide'];

    for (const field of fieldsToCheck) {
      const value = product[field];
      if (!value) continue;
      try {
        const obj = JSON.parse(value);
        if (typeof obj === 'object' && !Array.isArray(obj)) {
          let changed = false;
          for (const [lang, text] of Object.entries(obj)) {
            if (typeof text === 'string' && text.includes('Error: Could not translate')) {
              // 用中文或英文版本替代
              const fallback = obj.zh || obj.en || '';
              if (fallback && !fallback.includes('Error')) {
                obj[lang] = fallback;
                changed = true;
              }
            }
          }
          if (changed) {
            updates[field] = JSON.stringify(obj);
          }
        }
      } catch {}
    }

    if (Object.keys(updates).length > 0) {
      await db.update(products).set(updates).where(eq(products.id, product.id));
      fixedCount++;
      console.log(`  🔧 修复产品 ID ${product.id}: ${Object.keys(updates).join(', ')}`);
    }
  }

  console.log(`\n✅ 额外修复了 ${fixedCount} 个产品的翻译字段`);
  console.log('\n🎉 所有翻译修复完成！');
}

await fixTranslations();
await connection.end();
