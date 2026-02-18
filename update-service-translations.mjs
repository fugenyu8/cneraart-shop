import fs from 'fs';
import path from 'path';

const languages = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id'];

const translations = {
  en: {
    destiny: { subtitle: "BaZi Chart, Fortune Analysis" },
    prayer: { subtitle: "Lamp Offering, Prayer Service" }
  },
  de: {
    destiny: { subtitle: "BaZi-Diagramm, Schicksalsanalyse" },
    prayer: { subtitle: "Lampenopfer, Gebetsdienst" }
  },
  fr: {
    destiny: { subtitle: "Diagramme BaZi, Analyse du destin" },
    prayer: { subtitle: "Offrande de lampe, Service de prière" }
  },
  es: {
    destiny: { subtitle: "Carta BaZi, Análisis del destino" },
    prayer: { subtitle: "Ofrenda de lámpara, Servicio de oración" }
  },
  it: {
    destiny: { subtitle: "Diagramma BaZi, Analisi del destino" },
    prayer: { subtitle: "Offerta di lampada, Servizio di preghiera" }
  },
  pt: {
    destiny: { subtitle: "Mapa BaZi, Análise do destino" },
    prayer: { subtitle: "Oferta de lâmpada, Serviço de oração" }
  },
  ru: {
    destiny: { subtitle: "Карта BaZi, Анализ судьбы" },
    prayer: { subtitle: "Подношение лампы, Молитвенная служба" }
  },
  ja: {
    destiny: { subtitle: "八字命盤、運勢分析" },
    prayer: { subtitle: "灯明供養、祈願サービス" }
  },
  ko: {
    destiny: { subtitle: "사주팔자, 운세 분석" },
    prayer: { subtitle: "등불 공양, 기도 서비스" }
  },
  ar: {
    destiny: { subtitle: "مخطط BaZi، تحليل المصير" },
    prayer: { subtitle: "تقديم المصباح، خدمة الصلاة" }
  },
  hi: {
    destiny: { subtitle: "BaZi चार्ट, भाग्य विश्लेषण" },
    prayer: { subtitle: "दीपक अर्पण, प्रार्थना सेवा" }
  },
  th: {
    destiny: { subtitle: "แผนภูมิ BaZi, การวิเคราะห์โชคชะตา" },
    prayer: { subtitle: "การถวายโคมไฟ, บริการสวดมนต์" }
  },
  vi: {
    destiny: { subtitle: "Biểu đồ BaZi, Phân tích vận mệnh" },
    prayer: { subtitle: "Cúng đèn, Dịch vụ cầu nguyện" }
  },
  id: {
    destiny: { subtitle: "Diagram BaZi, Analisis Takdir" },
    prayer: { subtitle: "Persembahan Lampu, Layanan Doa" }
  }
};

languages.forEach(lang => {
  const filePath = path.join(process.cwd(), 'client/src/i18n/locales', `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    if (!data.serviceCards) {
      console.log(`⚠️  ${lang}.json: serviceCards not found, skipping`);
      return;
    }
    
    // 更新destiny和prayer的subtitle
    if (data.serviceCards.destiny) {
      data.serviceCards.destiny.subtitle = translations[lang].destiny.subtitle;
    }
    if (data.serviceCards.prayer) {
      data.serviceCards.prayer.subtitle = translations[lang].prayer.subtitle;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ ${lang}.json updated`);
  } catch (error) {
    console.error(`❌ Error updating ${lang}.json:`, error.message);
  }
});

console.log('\n✅ All translation files updated!');
