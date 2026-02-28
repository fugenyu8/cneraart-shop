/**
 * 修正所有产品价格：
 * salePrice = round((成本价+300)/7)   ← 用户实际购买价
 * regularPrice = round(salePrice*1.05) ← 划线价
 */
import mysql2 from 'mysql2/promise';
import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

function calcSalePrice(cost) {
  return Math.round((cost + 300) / 7);
}
function calcRegularPrice(salePrice) {
  return Math.round(salePrice * 1.05);
}
function cleanTitle(title) {
  return String(title || '').split('\n')[0].trim();
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
    const salePrice = calcSalePrice(costNum);
    const regularPrice = calcRegularPrice(salePrice);
    products.push({ seq, zhTitle: cleanTitle(title), cost: costNum, salePrice, regularPrice });
  }
  return products;
}

const excelMap = {
  30005: { file: '/home/ubuntu/upload/health&safety.xlsx', name: 'Health & Safety' },
  30007: { file: '/home/ubuntu/upload/innerpeace.xlsx', name: 'Inner Peace' },
  30004: { file: '/home/ubuntu/upload/wealth&fortune.xlsx', name: 'Wealth & Fortune' },
  30006: { file: '/home/ubuntu/upload/wisdom&study.xlsx', name: 'Wisdom & Study' },
};

// 打印计算结果
for (const [catId, { file, name }] of Object.entries(excelMap)) {
  const prods = readExcel(file);
  console.log(`\n=== ${name} ===`);
  for (const p of prods) {
    console.log(`  ${p.seq}. ${p.zhTitle.substring(0,28).padEnd(28)} 成本¥${p.cost} → 售价$${p.salePrice} 划线$${p.regularPrice}`);
  }
}

const conn = await mysql2.createConnection(DB_URL);
console.log('\n✅ 数据库连接成功');

let totalUpdated = 0;

for (const [catId, { file, name }] of Object.entries(excelMap)) {
  const excelProds = readExcel(file);
  const [dbProds] = await conn.execute(
    'SELECT id, name, regularPrice, salePrice FROM products WHERE categoryId = ? ORDER BY id',
    [catId]
  );
  
  console.log(`\n[${name}] Excel:${excelProds.length} DB:${dbProds.length}`);
  const count = Math.min(excelProds.length, dbProds.length);
  
  for (let i = 0; i < count; i++) {
    const excel = excelProds[i];
    const db = dbProds[i];
    const oldRegular = parseFloat(db.regularPrice);
    const oldSale = db.salePrice ? parseFloat(db.salePrice) : null;
    const changed = oldRegular !== excel.regularPrice || oldSale !== excel.salePrice;
    
    if (changed) {
      await conn.execute(
        'UPDATE products SET regularPrice = ?, salePrice = ? WHERE id = ?',
        [excel.regularPrice.toString(), excel.salePrice.toString(), db.id]
      );
      console.log(`  ✅ ID ${db.id}: 划线$${oldRegular}→$${excel.regularPrice} 售价$${oldSale}→$${excel.salePrice}`);
      totalUpdated++;
    } else {
      console.log(`  ✓  ID ${db.id}: 无需更新 划线$${excel.regularPrice} 售价$${excel.salePrice}`);
    }
  }
}

// 处理health&safety中超出Excel行数的产品（猪年+七彩琉璃）
// 猪年吊坠 630021: cost=40, 七彩琉璃 630022: cost=41
const extra = [
  { id: 630021, cost: 40 },
  { id: 630022, cost: 41 },
];
console.log('\n[额外产品]');
for (const { id, cost } of extra) {
  const sp = calcSalePrice(cost);
  const rp = calcRegularPrice(sp);
  await conn.execute('UPDATE products SET regularPrice=?, salePrice=? WHERE id=?', [rp.toString(), sp.toString(), id]);
  console.log(`  ✅ ID ${id}: 划线$${rp} 售价$${sp}`);
  totalUpdated++;
}

// wisdom&study最后两个产品(700041, 700042) cost=32
const wisdom_extra = [
  { id: 700041, cost: 32 },
  { id: 700042, cost: 32 },
];
for (const { id, cost } of wisdom_extra) {
  const sp = calcSalePrice(cost);
  const rp = calcRegularPrice(sp);
  await conn.execute('UPDATE products SET regularPrice=?, salePrice=? WHERE id=?', [rp.toString(), sp.toString(), id]);
  console.log(`  ✅ ID ${id}: 划线$${rp} 售价$${sp}`);
  totalUpdated++;
}

await conn.end();
console.log(`\n✅ 全部完成！共更新 ${totalUpdated} 个产品`);
