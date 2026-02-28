import mysql from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str || '');

// 删除描述中的中文括号注释，例如 (貔貅) (平安扣) (葫芦) 等
// 同时处理全角括号 （貔貅）
function removeChinese(text) {
  if (!text) return text;
  
  // 1. 删除括号内含中文的内容：(中文) 或 （中文）
  let result = text
    .replace(/\s*\([^)]*[\u4e00-\u9fff][^)]*\)/g, '')   // 半角括号 (含中文)
    .replace(/\s*（[^）]*[\u4e00-\u9fff][^）]*）/g, '')  // 全角括号 （含中文）
    // 2. 删除独立的中文字符（不在括号内的）
    .replace(/[\u4e00-\u9fff]+/g, '')
    // 3. 清理多余空格
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .trim();
  
  return result;
}

// 从JSON格式提取英文
function extractEnglish(text) {
  if (!text) return text;
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed.en) return parsed.en;
  } catch (e) {}
  return text;
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  // 查询所有新增产品
  const [products] = await conn.execute(`
    SELECT id, name, description, slug
    FROM products 
    WHERE id >= 630001
    ORDER BY id
  `);
  
  console.log('检查产品数:', products.length);
  
  let fixedCount = 0;
  
  for (const p of products) {
    let newName = p.name;
    let newDesc = p.description;
    let needsUpdate = false;
    
    // 修复 JSON 格式的名称
    if (p.name && p.name.startsWith('{')) {
      newName = extractEnglish(p.name);
      console.log(`[${p.id}] 修复JSON名称: "${newName}"`);
      needsUpdate = true;
    }
    
    // 修复描述中的中文
    if (hasChinese(p.description)) {
      newDesc = removeChinese(p.description);
      if (newDesc !== p.description) {
        console.log(`[${p.id}] 修复描述中文: "${p.name}"`);
        // 显示修复前后对比（只显示有变化的部分）
        const before = p.description.substring(0, 150);
        const after = newDesc.substring(0, 150);
        if (before !== after) {
          console.log(`  前: ${before}`);
          console.log(`  后: ${after}`);
        }
        needsUpdate = true;
      }
    }
    
    // 修复名称中的中文（非JSON格式）
    if (!p.name?.startsWith('{') && hasChinese(p.name)) {
      newName = removeChinese(p.name);
      console.log(`[${p.id}] 修复名称中文: "${p.name}" → "${newName}"`);
      needsUpdate = true;
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
  console.log(`✅ 修复完成！共修复 ${fixedCount} 个产品`);
  
  // 验证修复结果
  const [remaining] = await conn.execute(`
    SELECT COUNT(*) as cnt FROM products 
    WHERE id >= 630001 
    AND (name REGEXP '[\\u4e00-\\u9fff]' OR description REGEXP '[\\u4e00-\\u9fff]')
  `);
  console.log('修复后仍有中文的产品数:', remaining[0].cnt);
  
  await conn.end();
}

main().catch(console.error);
