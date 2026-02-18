import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'client/src/i18n/locales');

// 翻译映射
const translations = {
  'get_report': {
    'en': 'Get Report',
    'pt': 'Obter Relatório',
    'es': 'Obtener Informe',
    'fr': 'Obtenir le Rapport',
    'de': 'Bericht Erhalten',
    'it': 'Ottieni Rapporto',
    'ja': 'レポートを取得',
    'ko': '보고서 받기',
    'ru': 'Получить Отчет',
    'ar': 'احصل على التقرير',
    'hi': 'रिपोर्ट प्राप्त करें',
    'th': 'รับรายงาน',
    'vi': 'Nhận Báo Cáo',
    'id': 'Dapatkan Laporan',
    'zh': '立即购买'
  },
  'tab_service': {
    'en': 'Service Details',
    'pt': 'Detalhes do Serviço',
    'es': 'Detalles del Servicio',
    'fr': 'Détails du Service',
    'de': 'Servicedetails',
    'it': 'Dettagli del Servizio',
    'ja': 'サービス詳細',
    'ko': '서비스 세부정보',
    'ru': 'Детали Услуги',
    'ar': 'تفاصيل الخدمة',
    'hi': 'सेवा विवरण',
    'th': 'รายละเอียดบริการ',
    'vi': 'Chi Tiết Dịch Vụ',
    'id': 'Detail Layanan',
    'zh': '服务说明'
  }
};

const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // 添加新翻译键
  if (content.product_detail) {
    if (!content.product_detail.get_report && translations.get_report[lang]) {
      content.product_detail.get_report = translations.get_report[lang];
    }
    if (!content.product_detail.tab_service && translations.tab_service[lang]) {
      content.product_detail.tab_service = translations.tab_service[lang];
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
  console.log(`✅ Updated ${lang}.json`);
});

console.log('✅ All translations updated!');
