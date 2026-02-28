/**
 * 对 Railway 数据库（gateway03）中评论数量为整数的产品
 * 随机删除部分评论，使数量有零头（47-997之间的随机数）
 * 只修改 reviews 表的行数，不改任何其他字段
 */
import mysql from 'mysql2/promise';

const RAILWAY_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const conn = await mysql.createConnection(RAILWAY_DB);
  console.log('✅ 连接到 Railway 数据库（gateway03）');

  // 找出所有整数数量的产品
  const [products] = await conn.execute(`
    SELECT productId, COUNT(*) as cnt 
    FROM reviews 
    GROUP BY productId 
    HAVING cnt % 1000 = 0
    ORDER BY productId
  `);

  console.log(`需要随机化的产品: ${products.length} 个`);

  let processed = 0;
  for (const p of products) {
    const productId = p.productId;
    const currentCount = Number(p.cnt);
    
    // 零头：47-997 之间的随机数
    const remainder = randInt(47, 997);
    // 要删除的数量 = currentCount - (currentCount - 1000 + remainder)
    // 即保留 (currentCount - 1000 + remainder) 条，删除 (1000 - remainder) 条
    const toDelete = 1000 - remainder;
    
    await conn.execute(`
      DELETE FROM reviews 
      WHERE productId = ? 
      ORDER BY RAND() 
      LIMIT ${toDelete}
    `, [productId]);

    processed++;
    const newCount = currentCount - toDelete;
    if (processed % 20 === 0 || processed <= 5) {
      console.log(`[${processed}/${products.length}] productId=${productId}: ${currentCount} → ${newCount} (删除${toDelete}条)`);
    }
  }

  // 最终验证
  const [check] = await conn.execute(`
    SELECT productId, COUNT(*) as cnt FROM reviews GROUP BY productId HAVING cnt % 1000 = 0
  `);
  
  const [total] = await conn.execute(`SELECT COUNT(*) as total FROM reviews`);
  
  console.log(`\n=== 完成 ===`);
  console.log(`总评论数: ${total[0].total}`);
  console.log(`仍然是整数的产品: ${check.length} 个`);
  if (check.length > 0) {
    check.forEach(r => console.log(`  productId=${r.productId}: ${r.cnt}`));
  }

  await conn.end();
  console.log('✅ 全部完成！');
}

main().catch(console.error);
