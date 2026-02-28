import mysql from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str || '');

function deepClean(text) {
  if (!text) return text;
  
  let result = text;
  
  // 1. 删除括号内含中文的内容（半角和全角括号）
  result = result.replace(/\s*\([^)]*[\u4e00-\u9fff][^)]*\)/g, '');
  result = result.replace(/\s*（[^）]*[\u4e00-\u9fff][^）]*）/g, '');
  
  // 2. 删除引号内含中文的内容（双引号和单引号）
  result = result.replace(/\s*"[^"]*[\u4e00-\u9fff][^"]*"/g, '');
  result = result.replace(/\s*'[^']*[\u4e00-\u9fff][^']*'/g, '');
  result = result.replace(/\s*"[^"]*[\u4e00-\u9fff][^"]*"/g, ''); // 中文引号
  result = result.replace(/\s*'[^']*[\u4e00-\u9fff][^']*'/g, ''); // 中文单引号
  
  // 3. 删除破折号后的中文短语（如 —大吉大利）
  result = result.replace(/\s*[—–-]\s*[\u4e00-\u9fff]+/g, '');
  
  // 4. 删除所有剩余中文字符
  result = result.replace(/[\u4e00-\u9fff]+/g, '');
  
  // 5. 清理空引号 "" 或 ''
  result = result.replace(/""\s*/g, '');
  result = result.replace(/''\s*/g, '');
  result = result.replace(/\s*""\s*/g, ' ');
  
  // 6. 清理多余标点和空格
  result = result
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/\.\s*\./g, '.')
    .replace(/,\s*,/g, ',')
    .replace(/—\s*—/g, '—')
    .replace(/\s+—/g, '—')
    .replace(/—\s+/g, '—')
    .trim();
  
  return result;
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  // 查询所有仍有中文的新增产品
  const [products] = await conn.execute(`
    SELECT id, name, description, slug
    FROM products 
    WHERE id >= 630001
    ORDER BY id
  `);
  
  const withChinese = products.filter(p => 
    hasChinese(p.name) || hasChinese(p.description) || hasChinese(p.slug)
  );
  
  console.log(`仍有中文的产品数: ${withChinese.length}`);
  console.log('');
  
  let fixedCount = 0;
  
  for (const p of withChinese) {
    let newName = p.name;
    let newDesc = p.description;
    let needsUpdate = false;
    
    if (hasChinese(p.name)) {
      newName = deepClean(p.name);
      console.log(`[${p.id}] 名称: "${p.name}" → "${newName}"`);
      needsUpdate = true;
    }
    
    if (hasChinese(p.description)) {
      newDesc = deepClean(p.description);
      if (newDesc !== p.description) {
        // 找出有变化的片段
        const lines = p.description.split('. ');
        for (const line of lines) {
          if (hasChinese(line)) {
            const cleaned = deepClean(line);
            console.log(`[${p.id}] 描述片段: "${line.substring(0, 100)}"`);
            console.log(`        → "${cleaned.substring(0, 100)}"`);
          }
        }
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      await conn.execute(
        'UPDATE products SET name = ?, description = ? WHERE id = ?',
        [newName, newDesc, p.id]
      );
      fixedCount++;
    }
  }
  
  console.log('');
  console.log(`✅ 本次修复 ${fixedCount} 个产品`);
  
  // 最终验证
  const [remaining] = await conn.execute(`
    SELECT id, name, LEFT(description, 100) as desc_preview
    FROM products 
    WHERE id >= 630001 
    AND (name REGEXP '[\\u4e00-\\u9fff]' OR description REGEXP '[\\u4e00-\\u9fff]')
    LIMIT 20
  `);
  
  if (remaining.length === 0) {
    console.log('🎉 所有新增产品语言已完全修复！');
  } else {
    console.log(`⚠️ 仍有 ${remaining.length} 个产品有中文残留：`);
    for (const r of remaining) {
      console.log(`  ID ${r.id}: ${r.name}`);
      if (hasChinese(r.desc_preview)) {
        console.log(`    描述: ${r.desc_preview}`);
      }
    }
  }
  
  await conn.end();
}

main().catch(console.error);
