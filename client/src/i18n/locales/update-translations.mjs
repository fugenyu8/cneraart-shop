import fs from 'fs';

const translations = {
  en: {
    tab_efficacy: "Efficacy Information",
    efficacy_suitable_for: "Suitable For",
    efficacy_effects: "Blessing Effects",
    efficacy_wearing_tips: "Wearing Tips"
  },
  de: {
    tab_efficacy: "Wirksamkeitsinformationen",
    efficacy_suitable_for: "Geeignet für",
    efficacy_effects: "Segenswirkungen",
    efficacy_wearing_tips: "Tragehinweise"
  },
  fr: {
    tab_efficacy: "Informations sur l'efficacité",
    efficacy_suitable_for: "Convient pour",
    efficacy_effects: "Effets de bénédiction",
    efficacy_wearing_tips: "Conseils de port"
  },
  es: {
    tab_efficacy: "Información de eficacia",
    efficacy_suitable_for: "Adecuado para",
    efficacy_effects: "Efectos de bendición",
    efficacy_wearing_tips: "Consejos de uso"
  },
  it: {
    tab_efficacy: "Informazioni sull'efficacia",
    efficacy_suitable_for: "Adatto per",
    efficacy_effects: "Effetti di benedizione",
    efficacy_wearing_tips: "Consigli per l'uso"
  },
  pt: {
    tab_efficacy: "Informações de eficácia",
    efficacy_suitable_for: "Adequado para",
    efficacy_effects: "Efeitos de bênção",
    efficacy_wearing_tips: "Dicas de uso"
  },
  ru: {
    tab_efficacy: "Информация об эффективности",
    efficacy_suitable_for: "Подходит для",
    efficacy_effects: "Эффекты благословения",
    efficacy_wearing_tips: "Советы по ношению"
  },
  ja: {
    tab_efficacy: "効能説明",
    efficacy_suitable_for: "適用対象",
    efficacy_effects: "開光効果",
    efficacy_wearing_tips: "着用のアドバイス"
  },
  ko: {
    tab_efficacy: "효능 설명",
    efficacy_suitable_for: "적합한 대상",
    efficacy_effects: "개광 효과",
    efficacy_wearing_tips: "착용 조언"
  },
  ar: {
    tab_efficacy: "معلومات الفعالية",
    efficacy_suitable_for: "مناسب لـ",
    efficacy_effects: "تأثيرات البركة",
    efficacy_wearing_tips: "نصائح الارتداء"
  },
  hi: {
    tab_efficacy: "प्रभावकारिता जानकारी",
    efficacy_suitable_for: "के लिए उपयुक्त",
    efficacy_effects: "आशीर्वाद प्रभाव",
    efficacy_wearing_tips: "पहनने की सलाह"
  },
  th: {
    tab_efficacy: "ข้อมูลประสิทธิภาพ",
    efficacy_suitable_for: "เหมาะสำหรับ",
    efficacy_effects: "ผลของพรจากการเปิดแสง",
    efficacy_wearing_tips: "คำแนะนำในการสวมใส่"
  },
  vi: {
    tab_efficacy: "Thông tin hiệu quả",
    efficacy_suitable_for: "Phù hợp cho",
    efficacy_effects: "Hiệu quả khai quang",
    efficacy_wearing_tips: "Lời khuyên đeo"
  },
  id: {
    tab_efficacy: "Informasi Khasiat",
    efficacy_suitable_for: "Cocok untuk",
    efficacy_effects: "Efek Pemberkatan",
    efficacy_wearing_tips: "Tips Pemakaian"
  }
};

for (const [lang, keys] of Object.entries(translations)) {
  const filePath = `./${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // 在 product_detail 中的 tab_reviews 后面添加新键
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  let newLines = [];
  let added = false;
  
  for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);
    
    // 在 tab_reviews 行后面添加新的翻译
    if (lines[i].includes('"tab_reviews"') && !added) {
      const indent = '    ';
      newLines.push(`${indent}"tab_efficacy": "${keys.tab_efficacy}",`);
      newLines.push(`${indent}"efficacy_suitable_for": "${keys.efficacy_suitable_for}",`);
      newLines.push(`${indent}"efficacy_effects": "${keys.efficacy_effects}",`);
      newLines.push(`${indent}"efficacy_wearing_tips": "${keys.efficacy_wearing_tips}",`);
      added = true;
    }
  }
  
  if (added) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✓ Updated ${lang}.json`);
  } else {
    console.log(`✗ Could not find insertion point in ${lang}.json`);
  }
}

console.log('\n所有翻译文件更新完成!');
