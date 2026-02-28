import mysql from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str || '');
const isJson = (str) => { try { const p = JSON.parse(str); return typeof p === 'object'; } catch { return false; } };

function extractEnglish(str) {
  if (!str) return str;
  try {
    const parsed = JSON.parse(str);
    if (typeof parsed === 'object' && parsed.en) return parsed.en;
  } catch {}
  return str;
}

function removeChinese(str) {
  if (!str) return str;
  // 删除中文括号注释：(中文) 或 （中文）
  let result = str.replace(/[（(][^\)）]*[\u4e00-\u9fff][^\)）]*[)）]/g, '');
  // 删除引号内的中文：'中文' 或 "中文"
  result = result.replace(/['"][^'"]*[\u4e00-\u9fff][^'"]*['"]/g, '');
  // 删除剩余的中文字符及其周围的标点
  result = result.replace(/[\u4e00-\u9fff]+/g, '');
  // 清理多余空格和标点
  result = result.replace(/\s{2,}/g, ' ').replace(/,\s*,/g, ',').replace(/\(\s*\)/g, '').trim();
  return result;
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);

  // 获取今天新增的所有产品（4个新分类）
  const [products] = await conn.execute(`
    SELECT p.id, p.name, p.description, p.shortDescription, p.status, p.salePrice, p.regularPrice
    FROM products p
    WHERE p.categoryId IN (
      SELECT id FROM categories WHERE name IN ('Health & Safety', 'Inner Peace', 'Wealth & Fortune', 'Wisdom & Study')
    )
    ORDER BY p.id
  `);

  console.log(`检查 ${products.length} 个产品...\n`);

  let fixedStatus = 0;
  let fixedJson = 0;
  let fixedChinese = 0;
  let fixedPrice = 0;

  for (const p of products) {
    const updates = {};

    // 1. 修复JSON格式的名称（status字段已正确为published，无需修改）
    if (isJson(p.name)) {
      const newName = extractEnglish(p.name);
      if (newName !== p.name) {
        updates.name = newName;
        console.log(`[${p.id}] 名称JSON→英文: ${newName.substring(0, 60)}`);
        fixedJson++;
      }
    } else if (hasChinese(p.name)) {
      updates.name = removeChinese(p.name);
      console.log(`[${p.id}] 名称去中文: ${updates.name}`);
      fixedChinese++;
    }

    // 2. 修复JSON格式的描述
    if (isJson(p.description)) {
      const newDesc = extractEnglish(p.description);
      if (newDesc !== p.description) {
        updates.description = newDesc;
        console.log(`[${p.id}] 描述JSON→英文 (前80字): ${newDesc.substring(0, 80)}`);
        fixedJson++;
      }
    } else if (hasChinese(p.description)) {
      updates.description = removeChinese(p.description);
      fixedChinese++;
    }

    // 3. 修复JSON格式的短描述
    if (isJson(p.shortDescription)) {
      const newShort = extractEnglish(p.shortDescription);
      if (newShort !== p.shortDescription) {
        updates.shortDescription = newShort;
        fixedJson++;
      }
    } else if (hasChinese(p.shortDescription)) {
      updates.shortDescription = removeChinese(p.shortDescription);
      fixedChinese++;
    }

    // 4. 修复价格：salePrice 为 null 或 0 时，用 regularPrice 的 85% 作为 salePrice
    const sale = parseFloat(p.salePrice);
    const regular = parseFloat(p.regularPrice);
    if ((!sale || sale <= 0) && regular > 0) {
      updates.salePrice = Math.round(regular * 0.85);
      fixedPrice++;
    }

    // 执行更新
    if (Object.keys(updates).length > 0) {
      const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
      const values = [...Object.values(updates), p.id];
      await conn.execute(`UPDATE products SET ${setClauses} WHERE id = ?`, values);
    }
  }

  console.log(`\n✅ 修复完成：`);
  console.log(`  JSON格式提取英文: ${fixedJson} 个字段`);
  console.log(`  中文字符清除: ${fixedChinese} 个字段`);
  console.log(`  价格修复: ${fixedPrice} 个`);

  // 验证修复结果
  const [remaining] = await conn.execute(`
    SELECT COUNT(*) as cnt FROM products 
    WHERE categoryId IN (SELECT id FROM categories WHERE name IN ('Health & Safety', 'Inner Peace', 'Wealth & Fortune', 'Wisdom & Study'))
    AND status != 'active'
  `);
  console.log(`\n验证 - 状态非active的产品: ${remaining[0].cnt} 个`);

  const [allProducts] = await conn.execute(`
    SELECT id, name, description, shortDescription FROM products 
    WHERE categoryId IN (SELECT id FROM categories WHERE name IN ('Health & Safety', 'Inner Peace', 'Wealth & Fortune', 'Wisdom & Study'))
  `);
  
  let stillChinese = 0;
  for (const p of allProducts) {
    if (hasChinese(p.name) || hasChinese(p.description) || hasChinese(p.shortDescription)) {
      stillChinese++;
      console.log(`  仍有中文: [${p.id}] ${p.name}`);
    }
  }
  console.log(`验证 - 仍有中文的产品: ${stillChinese} 个`);

  await conn.end();
}

main().catch(console.error);
