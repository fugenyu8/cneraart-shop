import fs from 'fs';
import path from 'path';

const localesDir = './client/src/i18n/locales';
const languages = ['zh', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id'];

console.log('='.repeat(80));
console.log('检查首页主标题和副标题的语言一致性');
console.log('='.repeat(80));
console.log();

// 读取中文翻译作为基准
const zhData = JSON.parse(fs.readFileSync(path.join(localesDir, 'zh.json'), 'utf-8'));
const zhHero = zhData.hero;

console.log('【中文基准】');
console.log(`主标题: ${zhHero.title}`);
console.log(`副标题: ${zhHero.subtitle}`);
console.log();
console.log('='.repeat(80));
console.log();

// 检查每个语言的翻译
for (const lang of languages) {
  if (lang === 'zh') continue; // 跳过中文
  
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${lang}.json 文件不存在`);
    console.log();
    continue;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const hero = data.hero;
  
  console.log(`【${lang.toUpperCase()}】`);
  
  if (!hero) {
    console.log(`  ❌ 缺少 hero 字段`);
    console.log();
    continue;
  }
  
  if (!hero.title || !hero.subtitle) {
    console.log(`  ❌ 翻译不完整:`);
    if (!hero.title) console.log(`     缺少 title`);
    if (!hero.subtitle) console.log(`     缺少 subtitle`);
  } else {
    console.log(`  ✅ 主标题: ${hero.title}`);
    console.log(`  ✅ 副标题: ${hero.subtitle}`);
  }
  
  console.log();
}

console.log('='.repeat(80));
console.log('检查完成');
console.log('='.repeat(80));
