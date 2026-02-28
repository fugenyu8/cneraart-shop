import mysql from 'mysql2/promise';

const DB_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

const hasChinese = (str) => /[\u4e00-\u9fff]/.test(str || '');

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  const [products] = await conn.execute(`
    SELECT id, name, description, slug
    FROM products 
    WHERE id >= 630001
    ORDER BY id
  `);
  
  const issues = [];
  for (const p of products) {
    const nameHasChinese = hasChinese(p.name);
    const descHasChinese = hasChinese(p.description);
    
    if (nameHasChinese || descHasChinese) {
      // 找出具体的中文片段
      const chineseInName = (p.name || '').match(/[\u4e00-\u9fff].{0,20}/g) || [];
      const chineseInDesc = (p.description || '').match(/[\u4e00-\u9fff].{0,30}/g) || [];
      
      issues.push({
        id: p.id,
        name: p.name,
        nameIssues: chineseInName,
        descIssues: chineseInDesc.slice(0, 3),
        descIsJson: p.description?.startsWith('{')
      });
    }
  }
  
  if (issues.length === 0) {
    console.log('🎉 所有新增产品（ID >= 630001）语言完全一致，无中文残留！');
  } else {
    console.log(`⚠️ 仍有 ${issues.length} 个产品有中文：`);
    for (const issue of issues) {
      console.log(`\nID ${issue.id}: ${issue.name}`);
      if (issue.nameIssues.length > 0) {
        console.log(`  名称中文: ${issue.nameIssues.join(', ')}`);
      }
      if (issue.descIsJson) {
        console.log(`  描述是JSON格式（多语言），需要提取英文`);
      } else if (issue.descIssues.length > 0) {
        console.log(`  描述中文片段: ${issue.descIssues.join(' | ')}`);
      }
    }
  }
  
  // 同时检查描述是JSON格式的产品
  const jsonDesc = products.filter(p => p.description?.startsWith('{'));
  if (jsonDesc.length > 0) {
    console.log(`\n📋 描述是JSON格式的产品（${jsonDesc.length}个）：`);
    for (const p of jsonDesc) {
      console.log(`  ID ${p.id}: ${p.name}`);
    }
  }
  
  await conn.end();
}

main().catch(console.error);
