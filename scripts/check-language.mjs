import mysql from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str || '');

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  // 先查列名
  const [cols] = await conn.execute('DESCRIBE products');
  const colNames = cols.map(c => c.Field);
  console.log('产品表列名:', colNames.join(', '));
  console.log('');
  
  // 查询所有新增产品
  const [products] = await conn.execute(`
    SELECT id, name, description, slug, categoryId
    FROM products 
    WHERE id >= 630001
    ORDER BY categoryId, id
  `);
  
  console.log('总新增产品数:', products.length);
  console.log('');
  
  const issues = [];
  for (const p of products) {
    const nameHasChinese = hasChinese(p.name);
    const descHasChinese = hasChinese(p.description);
    const slugHasChinese = hasChinese(p.slug);
    
    if (nameHasChinese || descHasChinese || slugHasChinese) {
      issues.push({
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        nameOk: !nameHasChinese,
        descOk: !descHasChinese,
        slugOk: !slugHasChinese,
        slug: p.slug,
        descPreview: (p.description || '').substring(0, 100)
      });
    }
  }
  
  console.log('有语言问题的产品数:', issues.length);
  console.log('');
  
  for (const issue of issues) {
    console.log(`--- ID: ${issue.id} | 分类: ${issue.categoryId}`);
    console.log(`  名称: ${issue.name} ${issue.nameOk ? '✅' : '❌中文'}`);
    console.log(`  Slug: ${issue.slug} ${issue.slugOk ? '✅' : '❌中文'}`);
    if (!issue.descOk) {
      console.log(`  描述前100字: ${issue.descPreview} ❌中文`);
    }
    console.log('');
  }
  
  // 按分类统计
  console.log('=== 按分类统计 ===');
  const catMap = {};
  for (const p of products) {
    if (!catMap[p.categoryId]) catMap[p.categoryId] = { total: 0, issues: 0 };
    catMap[p.categoryId].total++;
    if (hasChinese(p.name) || hasChinese(p.description) || hasChinese(p.slug)) {
      catMap[p.categoryId].issues++;
    }
  }
  for (const [catId, stat] of Object.entries(catMap)) {
    console.log(`  分类 ${catId}: ${stat.total} 个产品，${stat.issues} 个有问题`);
  }
  
  await conn.end();
}

main().catch(console.error);
