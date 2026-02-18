import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const languages = ['en', 'de', 'fr', 'es', 'pt', 'it', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id', 'nl'];

const trustTranslations = {
  en: {
    trustTitle: "Trust & Security",
    privacy: "Privacy Protection",
    privacyDesc: "All information strictly confidential",
    speed: "Fast Delivery",
    speedDesc: "Analysis completed within 3-5 business days",
    accuracy: "Professional Accuracy",
    accuracyDesc: "Traditional wisdom meets modern analysis"
  },
  de: {
    trustTitle: "Vertrauen & Sicherheit",
    privacy: "Datenschutz",
    privacyDesc: "Alle Informationen streng vertraulich",
    speed: "Schnelle Lieferung",
    speedDesc: "Analyse innerhalb von 3-5 Werktagen",
    accuracy: "Professionelle Genauigkeit",
    accuracyDesc: "Traditionelle Weisheit trifft moderne Analyse"
  },
  fr: {
    trustTitle: "Confiance & Sécurité",
    privacy: "Protection de la vie privée",
    privacyDesc: "Toutes les informations strictement confidentielles",
    speed: "Livraison rapide",
    speedDesc: "Analyse complétée sous 3-5 jours ouvrables",
    accuracy: "Précision professionnelle",
    accuracyDesc: "Sagesse traditionnelle et analyse moderne"
  },
  es: {
    trustTitle: "Confianza y Seguridad",
    privacy: "Protección de privacidad",
    privacyDesc: "Toda la información estrictamente confidencial",
    speed: "Entrega rápida",
    speedDesc: "Análisis completado en 3-5 días hábiles",
    accuracy: "Precisión profesional",
    accuracyDesc: "Sabiduría tradicional con análisis moderno"
  },
  pt: {
    trustTitle: "Confiança e Segurança",
    privacy: "Proteção de privacidade",
    privacyDesc: "Todas as informações estritamente confidenciais",
    speed: "Entrega rápida",
    speedDesc: "Análise concluída em 3-5 dias úteis",
    accuracy: "Precisão profissional",
    accuracyDesc: "Sabedoria tradicional com análise moderna"
  },
  it: {
    trustTitle: "Fiducia e Sicurezza",
    privacy: "Protezione della privacy",
    privacyDesc: "Tutte le informazioni strettamente confidenziali",
    speed: "Consegna veloce",
    speedDesc: "Analisi completata entro 3-5 giorni lavorativi",
    accuracy: "Precisione professionale",
    accuracyDesc: "Saggezza tradizionale con analisi moderna"
  },
  ru: {
    trustTitle: "Доверие и безопасность",
    privacy: "Защита конфиденциальности",
    privacyDesc: "Вся информация строго конфиденциальна",
    speed: "Быстрая доставка",
    speedDesc: "Анализ завершается за 3-5 рабочих дней",
    accuracy: "Профессиональная точность",
    accuracyDesc: "Традиционная мудрость и современный анализ"
  },
  ja: {
    trustTitle: "信頼とセキュリティ",
    privacy: "プライバシー保護",
    privacyDesc: "すべての情報は厳重に機密保持されます",
    speed: "迅速な納品",
    speedDesc: "3〜5営業日以内に分析完了",
    accuracy: "専門的な正確性",
    accuracyDesc: "伝統的な知恵と現代的な分析の融合"
  },
  ko: {
    trustTitle: "신뢰와 보안",
    privacy: "개인정보 보호",
    privacyDesc: "모든 정보는 엄격히 기밀로 유지됩니다",
    speed: "빠른 배송",
    speedDesc: "3-5 영업일 이내 분석 완료",
    accuracy: "전문적인 정확성",
    accuracyDesc: "전통적 지혜와 현대적 분석의 결합"
  },
  ar: {
    trustTitle: "الثقة والأمان",
    privacy: "حماية الخصوصية",
    privacyDesc: "جميع المعلومات سرية للغاية",
    speed: "تسليم سريع",
    speedDesc: "يتم إكمال التحليل خلال 3-5 أيام عمل",
    accuracy: "دقة احترافية",
    accuracyDesc: "الحكمة التقليدية تلتقي بالتحليل الحديث"
  },
  hi: {
    trustTitle: "विश्वास और सुरक्षा",
    privacy: "गोपनीयता सुरक्षा",
    privacyDesc: "सभी जानकारी सख्ती से गोपनीय",
    speed: "तेज़ डिलीवरी",
    speedDesc: "3-5 कार्य दिवसों में विश्लेषण पूर्ण",
    accuracy: "पेशेवर सटीकता",
    accuracyDesc: "पारंपरिक ज्ञान और आधुनिक विश्लेषण का संयोजन"
  },
  th: {
    trustTitle: "ความไว้วางใจและความปลอดภัย",
    privacy: "การปกป้องความเป็นส่วนตัว",
    privacyDesc: "ข้อมูลทั้งหมดเป็นความลับอย่างเคร่งครัด",
    speed: "การจัดส่งที่รวดเร็ว",
    speedDesc: "การวิเคราะห์เสร็จสิ้นภายใน 3-5 วันทำการ",
    accuracy: "ความแม่นยำระดับมืออาชีพ",
    accuracyDesc: "ภูมิปัญญาดั้งเดิมผสานการวิเคราะห์สมัยใหม่"
  },
  vi: {
    trustTitle: "Tin cậy & Bảo mật",
    privacy: "Bảo vệ quyền riêng tư",
    privacyDesc: "Mọi thông tin được bảo mật tuyệt đối",
    speed: "Giao hàng nhanh",
    speedDesc: "Phân tích hoàn thành trong 3-5 ngày làm việc",
    accuracy: "Chính xác chuyên nghiệp",
    accuracyDesc: "Trí tuệ truyền thống kết hợp phân tích hiện đại"
  },
  id: {
    trustTitle: "Kepercayaan & Keamanan",
    privacy: "Perlindungan Privasi",
    privacyDesc: "Semua informasi dijaga ketat kerahasiaannya",
    speed: "Pengiriman Cepat",
    speedDesc: "Analisis selesai dalam 3-5 hari kerja",
    accuracy: "Akurasi Profesional",
    accuracyDesc: "Kebijaksanaan tradisional bertemu analisis modern"
  },
  nl: {
    trustTitle: "Vertrouwen & Veiligheid",
    privacy: "Privacybescherming",
    privacyDesc: "Alle informatie strikt vertrouwelijk",
    speed: "Snelle levering",
    speedDesc: "Analyse voltooid binnen 3-5 werkdagen",
    accuracy: "Professionele nauwkeurigheid",
    accuracyDesc: "Traditionele wijsheid ontmoet moderne analyse"
  }
};

for (const lang of languages) {
  const filePath = join(__dirname, 'client', 'src', 'i18n', 'locales', `${lang}.json`);
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // 添加信任保障翻译
    if (data.fortuneServices) {
      Object.assign(data.fortuneServices, trustTranslations[lang]);
      
      // 写回文件
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`✅ ${lang}.json 已更新`);
    }
  } catch (error) {
    console.error(`❌ ${lang}.json 更新失败:`, error.message);
  }
}

console.log('\n🎉 所有语言的信任保障翻译已添加!');
