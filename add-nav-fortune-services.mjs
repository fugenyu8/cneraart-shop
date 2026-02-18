import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';
const translations = {
  zh: "相学风水",
  en: "Physiognomy & Feng Shui",
  de: "Physiognomie & Feng Shui",
  fr: "Physionomie & Feng Shui",
  es: "Fisionomía & Feng Shui",
  it: "Fisionomia & Feng Shui",
  pt: "Fisionomia & Feng Shui",
  ru: "Физиогномика и Фэн-шуй",
  ja: "相学と風水",
  ko: "관상학 및 풍수",
  ar: "علم الفراسة والفنغ شوي",
  hi: "शारीरिक लक्षण और फेंग शुई",
  th: "โหงวเฮ้งและฮวงจุ้ย",
  vi: "Tướng số & Phong thủy",
  id: "Fisiognomi & Feng Shui"
};

Object.entries(translations).forEach(([lang, text]) => {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!content.nav.fortune_services) {
    content.nav.fortune_services = text;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`✓ 已添加 ${lang}.json`);
  } else {
    console.log(`- ${lang}.json 已存在`);
  }
});

console.log('\n完成!');
