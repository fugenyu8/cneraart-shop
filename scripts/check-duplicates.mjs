import mysql2 from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';
const conn = await mysql2.createConnection(DB_URL);

const catIds = [30004, 30005, 30006, 30007];
const catNames = {
  30004: 'Wealth & Fortune',
  30005: 'Health & Safety',
  30006: 'Wisdom & Study',
  30007: 'Inner Peace'
};

let totalDups = 0;

for (const catId of catIds) {
  const [rows] = await conn.execute(
    'SELECT id, name, regularPrice, salePrice FROM products WHERE categoryId = ? ORDER BY id',
    [catId]
  );
  console.log(`\n=== ${catNames[catId]} (共${rows.length}个) ===`);

  // 检查重复名称
  const nameMap = {};
  for (const r of rows) {
    const n = r.name;
    if (!nameMap[n]) nameMap[n] = [];
    nameMap[n].push(r.id);
  }
  let hasDup = false;
  for (const [name, ids] of Object.entries(nameMap)) {
    if (ids.length > 1) {
      console.log(`  ⚠️  重复名称: "${name.substring(0, 60)}" → IDs: ${ids.join(', ')}`);
      hasDup = true;
      totalDups += ids.length - 1;
    }
  }
  if (!hasDup) console.log('  ✓ 无重复名称');

  // 列出所有产品
  for (const r of rows) {
    console.log(`  ID ${r.id}: ${r.name.substring(0, 50).padEnd(50)} 售价$${r.salePrice} 划线$${r.regularPrice}`);
  }
}

// 跨分类检查重复
console.log('\n=== 跨分类重复检查 ===');
const [allRows] = await conn.execute(
  'SELECT id, name, categoryId FROM products WHERE categoryId IN (30004, 30005, 30006, 30007) ORDER BY name'
);
const crossMap = {};
for (const r of allRows) {
  if (!crossMap[r.name]) crossMap[r.name] = [];
  crossMap[r.name].push({ id: r.id, cat: catNames[r.categoryId] });
}
let crossDup = false;
for (const [name, items] of Object.entries(crossMap)) {
  if (items.length > 1) {
    const cats = [...new Set(items.map(i => i.cat))];
    if (cats.length > 1) {
      console.log(`  ⚠️  跨分类重复: "${name.substring(0, 50)}"`);
      for (const item of items) {
        console.log(`       ID ${item.id} (${item.cat})`);
      }
      crossDup = true;
      totalDups++;
    }
  }
}
if (!crossDup) console.log('  ✓ 无跨分类重复');

console.log(`\n总计发现 ${totalDups} 个重复产品`);
await conn.end();
