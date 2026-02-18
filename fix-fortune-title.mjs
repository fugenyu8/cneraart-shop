import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';
const languages = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id'];

const translations = {
  en: {
    pageTitle: "Physiognomy & Feng Shui",
    pageSubtitle: "Ancient wisdom of face and palm reading, revealing life's destiny"
  },
  de: {
    pageTitle: "Physiognomie & Feng Shui",
    pageSubtitle: "Alte Weisheit der Gesichts- und Handlesekunde, die das Schicksal des Lebens offenbart"
  },
  fr: {
    pageTitle: "Physiognomie & Feng Shui",
    pageSubtitle: "Sagesse ancienne de la lecture du visage et de la paume, révélant le destin de la vie"
  },
  es: {
    pageTitle: "Fisiognomía & Feng Shui",
    pageSubtitle: "Sabiduría antigua de la lectura del rostro y la palma, revelando el destino de la vida"
  },
  it: {
    pageTitle: "Fisiognomica & Feng Shui",
    pageSubtitle: "Antica saggezza della lettura del viso e del palmo, rivelando il destino della vita"
  },
  pt: {
    pageTitle: "Fisiognomia & Feng Shui",
    pageSubtitle: "Sabedoria antiga da leitura do rosto e da palma, revelando o destino da vida"
  },
  ru: {
    pageTitle: "Физиогномика и Фэн-Шуй",
    pageSubtitle: "Древняя мудрость чтения лица и ладони, раскрывающая судьбу жизни"
  },
  ja: {
    pageTitle: "相学と風水",
    pageSubtitle: "顔相と手相の古代の知恵、人生の運命を明らかにする"
  },
  ko: {
    pageTitle: "관상학 및 풍수",
    pageSubtitle: "얼굴과 손금 읽기의 고대 지혜, 인생의 운명을 밝히다"
  },
  ar: {
    pageTitle: "علم الفراسة وفنغ شوي",
    pageSubtitle: "الحكمة القديمة لقراءة الوجه والكف، كشف مصير الحياة"
  },
  hi: {
    pageTitle: "चेहरा पढ़ना और फेंग शुई",
    pageSubtitle: "चेहरे और हथेली पढ़ने की प्राचीन बुद्धि, जीवन की नियति का खुलासा"
  },
  th: {
    pageTitle: "ดูหน้าและฮวงจุ้ย",
    pageSubtitle: "ภูมิปัญญาโบราณของการดูหน้าและฝ่ามือ เปิดเผยชะตาชีวิต"
  },
  vi: {
    pageTitle: "Tướng số & Phong thủy",
    pageSubtitle: "Trí tuệ cổ xưa của xem tướng mặt và lòng bàn tay, tiết lộ vận mệnh cuộc đời"
  },
  id: {
    pageTitle: "Fisiognomi & Feng Shui",
    pageSubtitle: "Kebijaksanaan kuno membaca wajah dan telapak tangan, mengungkap takdir hidup"
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (content.fortuneServices) {
    content.fortuneServices.pageTitle = translations[lang].pageTitle;
    content.fortuneServices.pageSubtitle = translations[lang].pageSubtitle;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
  console.log(`✓ Updated ${lang}.json`);
});

console.log('\n✓ All translations updated successfully!');
