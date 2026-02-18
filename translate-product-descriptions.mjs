import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { invokeLLM } from './server/_core/llm.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' }
];

// 读取中文翻译
const zhPath = path.join(__dirname, 'client/src/i18n/locales/zh.json');
const zhTranslations = JSON.parse(fs.readFileSync(zhPath, 'utf-8'));

const productSlugs = Object.keys(zhTranslations.products || {});

console.log(`🌍 开始为${productSlugs.length}个商品生成${languages.length}种语言的翻译...\n`);

for (const lang of languages) {
  console.log(`📝 正在翻译 ${lang.name} (${lang.code})...`);
  
  const langPath = path.join(__dirname, `client/src/i18n/locales/${lang.code}.json`);
  let langTranslations = {};
  
  if (fs.existsSync(langPath)) {
    langTranslations = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
  }
  
  langTranslations.products = langTranslations.products || {};
  
  for (const slug of productSlugs) {
    const zhProduct = zhTranslations.products[slug];
    
    try {
      // 使用LLM翻译商品名称和描述
      const prompt = `Translate the following product information from Chinese to ${lang.name}. Maintain the formatting (including **bold**, bullet points, and line breaks). Do not add any explanations, only return the translated JSON.

Chinese product name: ${zhProduct.name}

Chinese product description:
${zhProduct.description}

Return ONLY a JSON object with this exact structure:
{
  "name": "translated name",
  "description": "translated description with original formatting preserved"
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'You are a professional translator specializing in spiritual and traditional Chinese culture content. Translate accurately while maintaining cultural sensitivity and formatting.' },
          { role: 'user', content: prompt }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'product_translation',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['name', 'description'],
              additionalProperties: false
            }
          }
        }
      });
      
      const translated = JSON.parse(response.choices[0].message.content);
      langTranslations.products[slug] = translated;
      
      console.log(`  ✅ ${slug} 翻译完成`);
      
      // 短暂延迟避免API限流
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`  ❌ ${slug} 翻译失败:`, error.message);
    }
  }
  
  // 保存翻译文件
  fs.writeFileSync(langPath, JSON.stringify(langTranslations, null, 2), 'utf-8');
  console.log(`✅ ${lang.name} 翻译已保存\n`);
}

console.log('🎉 所有语言翻译完成!');
