import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'client/src/i18n/locales');

// 翻译映射
const translations = {
  en: {
    pageTitle: "Destiny Analysis Services",
    pageSubtitle: "Master-Level Deep Analysis, Resolving Annual Fortune Challenges"
  },
  de: {
    pageTitle: "Schicksalsanalyse-Dienste",
    pageSubtitle: "Meisterliche Tiefenanalyse zur Auflösung von Jahresschicksalsherausforderungen"
  },
  fr: {
    pageTitle: "Services d'Analyse du Destin",
    pageSubtitle: "Analyse Approfondie de Niveau Maître, Résolution des Défis de la Fortune Annuelle"
  },
  es: {
    pageTitle: "Servicios de Análisis del Destino",
    pageSubtitle: "Análisis Profundo de Nivel Maestro, Resolviendo Desafíos de Fortuna Anual"
  },
  it: {
    pageTitle: "Servizi di Analisi del Destino",
    pageSubtitle: "Analisi Approfondita di Livello Maestro, Risoluzione delle Sfide della Fortuna Annuale"
  },
  pt: {
    pageTitle: "Serviços de Análise do Destino",
    pageSubtitle: "Análise Profunda de Nível Mestre, Resolvendo Desafios da Fortuna Anual"
  },
  ru: {
    pageTitle: "Услуги Анализа Судьбы",
    pageSubtitle: "Глубокий Анализ Мастерского Уровня, Разрешение Проблем Годовой Удачи"
  },
  ja: {
    pageTitle: "運命分析サービス",
    pageSubtitle: "マスターレベルの深い分析、流年運勢の課題を解決"
  },
  ko: {
    pageTitle: "운명 분석 서비스",
    pageSubtitle: "마스터급 심층 분석, 연간 운세 문제 해결"
  },
  ar: {
    pageTitle: "خدمات تحليل القدر",
    pageSubtitle: "تحليل عميق على مستوى الخبراء، حل تحديات الحظ السنوي"
  },
  hi: {
    pageTitle: "भाग्य विश्लेषण सेवाएं",
    pageSubtitle: "मास्टर-स्तरीय गहन विश्लेषण, वार्षिक भाग्य चुनौतियों का समाधान"
  },
  th: {
    pageTitle: "บริการวิเคราะห์ชะตากรรม",
    pageSubtitle: "การวิเคราะห์เชิงลึกระดับปรมาจารย์ แก้ไขความท้าทายด้านโชคลาภประจำปี"
  },
  vi: {
    pageTitle: "Dịch Vụ Phân Tích Vận Mệnh",
    pageSubtitle: "Phân Tích Sâu Cấp Độ Chuyên Gia, Giải Quyết Thách Thức Vận May Hàng Năm"
  },
  id: {
    pageTitle: "Layanan Analisis Takdir",
    pageSubtitle: "Analisis Mendalam Tingkat Master, Mengatasi Tantangan Keberuntungan Tahunan"
  }
};

// 更新所有语言文件
Object.keys(translations).forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (content.fortuneServices) {
      content.fortuneServices.pageTitle = translations[lang].pageTitle;
      content.fortuneServices.pageSubtitle = translations[lang].pageSubtitle;
      
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
      console.log(`✅ Updated ${lang}.json`);
    } else {
      console.log(`⚠️  ${lang}.json does not have fortuneServices section`);
    }
  } else {
    console.log(`❌ ${lang}.json not found`);
  }
});

console.log('\n✅ All translations updated!');
