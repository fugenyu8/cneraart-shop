/**
 * 用 (成本价+300)/7 四舍五入重新计算所有新增产品售价并更新数据库
 */
import mysql2 from 'mysql2/promise';
import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const PROD_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

function calcPrice(costCNY) {
  return Math.round((costCNY + 300) / 7);
}

function cleanTitle(title) {
  if (!title) return '';
  return String(title).split('\n')[0].trim();
}

function readExcel(filepath) {
  const buf = readFileSync(filepath);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
  const products = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const seq = row[0];
    const title = row[4];
    const cost = row[6];
    if (!seq || !title || cost === undefined || cost === null || cost === '') continue;
    const costNum = Number(cost);
    if (isNaN(costNum)) continue;
    const price = calcPrice(costNum);
    const salePrice = price - 10 > 0 ? price - 10 : null;
    products.push({
      seq,
      zhTitle: cleanTitle(title),
      cost: costNum,
      price,
      salePrice,
    });
  }
  return products;
}

// 读取所有Excel
const excelFiles = [
  { file: '/home/ubuntu/upload/health&safety.xlsx', cat: 'Health & Safety' },
  { file: '/home/ubuntu/upload/innerpeace.xlsx', cat: 'Inner Peace' },
  { file: '/home/ubuntu/upload/wealth&fortune.xlsx', cat: 'Wealth & Fortune' },
  { file: '/home/ubuntu/upload/wisdom&study.xlsx', cat: 'Wisdom & Study' },
];

const allExcelProducts = [];
for (const { file, cat } of excelFiles) {
  const prods = readExcel(file);
  console.log(`\n=== ${cat} (${prods.length} 个) ===`);
  for (const p of prods) {
    console.log(`  ${p.seq}. ${p.zhTitle} | 成本¥${p.cost} → 售价$${p.price} (折扣$${p.salePrice})`);
  }
  allExcelProducts.push(...prods);
}
console.log(`\n总计Excel产品: ${allExcelProducts.length} 个`);

// 连接数据库
const conn = await mysql2.createConnection(PROD_URL);
console.log('\n✅ 数据库连接成功');

// 查询所有新增产品
const [dbProducts] = await conn.execute(
  'SELECT id, name, regularPrice, salePrice FROM products WHERE id >= 30000 ORDER BY id'
);
console.log(`\n数据库中 id>=30000 的产品: ${dbProducts.length} 个`);

// 打印当前价格
console.log('\n当前数据库价格:');
for (const p of dbProducts) {
  console.log(`  ID ${p.id}: ${String(p.name).substring(0, 45).padEnd(45)} | 当前: $${p.regularPrice} / $${p.salePrice}`);
}

// 匹配策略：按顺序匹配（Excel行序 = 数据库插入顺序）
// 先按分类分组
const [healthProds] = await conn.execute(
  'SELECT id, name, regularPrice, salePrice FROM products WHERE categoryId = 30005 ORDER BY id'
);
const [innerProds] = await conn.execute(
  'SELECT id, name, regularPrice, salePrice FROM products WHERE categoryId = 30007 ORDER BY id'
);
const [wealthProds] = await conn.execute(
  'SELECT id, name, regularPrice, salePrice FROM products WHERE categoryId = 30004 ORDER BY id'
);
const [wisdomProds] = await conn.execute(
  'SELECT id, name, regularPrice, salePrice FROM products WHERE categoryId = 30006 ORDER BY id'
);

const excelByCategory = {
  'Health & Safety': readExcel('/home/ubuntu/upload/health&safety.xlsx'),
  'Inner Peace': readExcel('/home/ubuntu/upload/innerpeace.xlsx'),
  'Wealth & Fortune': readExcel('/home/ubuntu/upload/wealth&fortune.xlsx'),
  'Wisdom & Study': readExcel('/home/ubuntu/upload/wisdom&study.xlsx'),
};

const dbByCategory = {
  'Health & Safety': healthProds,
  'Inner Peace': innerProds,
  'Wealth & Fortune': wealthProds,
  'Wisdom & Study': wisdomProds,
};

console.log('\n\n=== 价格对比 ===');
const updates = [];
for (const [cat, excelProds] of Object.entries(excelByCategory)) {
  const dbProds = dbByCategory[cat];
  console.log(`\n[${cat}] Excel: ${excelProds.length} 个, DB: ${dbProds.length} 个`);
  
  const count = Math.min(excelProds.length, dbProds.length);
  for (let i = 0; i < count; i++) {
    const excel = excelProds[i];
    const db = dbProds[i];
    const oldPrice = parseFloat(db.regularPrice);
    const oldSale = db.salePrice ? parseFloat(db.salePrice) : null;
    const changed = oldPrice !== excel.price || oldSale !== excel.salePrice;
    const marker = changed ? '⚠️ 需更新' : '✅ 正确';
    console.log(`  ${marker} ID ${db.id}: ${String(db.name).substring(0, 35).padEnd(35)} | 旧$${oldPrice}→新$${excel.price} | 旧折扣$${oldSale}→新折扣$${excel.salePrice}`);
    if (changed) {
      updates.push({
        id: db.id,
        name: db.name,
        newPrice: excel.price,
        newSalePrice: excel.salePrice,
        oldPrice,
        oldSale,
        excelTitle: excel.zhTitle,
        cost: excel.cost,
      });
    }
  }
}

console.log(`\n\n需要更新的产品: ${updates.length} 个`);

if (updates.length > 0) {
  console.log('\n开始批量更新...');
  let successCount = 0;
  for (const u of updates) {
    await conn.execute(
      'UPDATE products SET regularPrice = ?, salePrice = ? WHERE id = ?',
      [u.newPrice.toString(), u.newSalePrice ? u.newSalePrice.toString() : null, u.id]
    );
    console.log(`  ✅ ID ${u.id}: $${u.oldPrice} → $${u.newPrice} (折扣: $${u.oldSale} → $${u.newSalePrice})`);
    successCount++;
  }
  console.log(`\n✅ 成功更新 ${successCount} 个产品价格`);
} else {
  console.log('\n✅ 所有价格已经正确，无需更新');
}

await conn.end();
console.log('\n✅ 完成！');
