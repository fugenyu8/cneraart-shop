import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';
const languages = ['zh', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id'];

const cards = [
  { key: 'blessedItems', name: '开光护佑法物' },
  { key: 'destiny', name: '命理运势' },
  { key: 'palmistry', name: '面相手相风水' },
  { key: 'prayer', name: '代客祈福' }
];

console.log('='.repeat(80));
console.log('检查首页4个服务卡片的语言一致性');
console.log('='.repeat(80));
console.log();

// 读取中文翻译作为基准
const zhData = JSON.parse(fs.readFileSync(path.join(localesDir, 'zh.json'), 'utf-8'));
const zhCards = zhData.serviceCards;

console.log('【中文基准】');
cards.forEach(card => {
  console.log(`${card.name}:`);
  console.log(`  标题: ${zhCards[card.key].title}`);
  console.log(`  副标题: ${zhCards[card.key].subtitle}`);
  console.log();
});

console.log('='.repeat(80));
console.log();

// 检查每个语言的翻译
for (const lang of languages) {
  if (lang === 'zh') continue; // 跳过中文
  
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${lang}.json 文件不存在`);
    continue;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const serviceCards = data.serviceCards;
  
  console.log(`【${lang.toUpperCase()}】`);
  
  if (!serviceCards) {
    console.log(`  ❌ 缺少 serviceCards 字段`);
    console.log();
    continue;
  }
  
  let hasIssue = false;
  
  cards.forEach(card => {
    if (!serviceCards[card.key]) {
      console.log(`  ❌ ${card.name} - 缺少 ${card.key} 字段`);
      hasIssue = true;
    } else {
      const title = serviceCards[card.key].title;
      const subtitle = serviceCards[card.key].subtitle;
      
      if (!title || !subtitle) {
        console.log(`  ❌ ${card.name}:`);
        if (!title) console.log(`     缺少 title`);
        if (!subtitle) console.log(`     缺少 subtitle`);
        hasIssue = true;
      } else {
        console.log(`  ✅ ${card.name}:`);
        console.log(`     标题: ${title}`);
        console.log(`     副标题: ${subtitle}`);
      }
    }
  });
  
  if (!hasIssue) {
    console.log(`  ✅ 所有翻译完整`);
  }
  
  console.log();
}

console.log('='.repeat(80));
console.log('检查完成');
console.log('='.repeat(80));
