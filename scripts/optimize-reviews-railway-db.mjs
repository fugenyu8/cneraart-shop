/**
 * 优化 Railway 数据库（gateway03）的评论数据：
 * 1. 随机化整数评论数量（删除部分或新增部分，使数量有零头）
 * 2. 调整评分分布：5星75%、4星18%、3星5%、2星1.5%、1星0.5%
 * 3. 分散评论日期：14个月内随机分布
 */
import mysql from 'mysql2/promise';

const RAILWAY_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

// 目标评分分布
const RATING_DIST = [
  { rating: 5, pct: 0.75 },
  { rating: 4, pct: 0.18 },
  { rating: 3, pct: 0.05 },
  { rating: 2, pct: 0.015 },
  { rating: 1, pct: 0.005 },
];

// 生成14个月内的随机时间戳（毫秒）
function randomDateIn14Months() {
  const now = Date.now();
  const monthsAgo14 = now - 14 * 30 * 24 * 60 * 60 * 1000;
  return new Date(monthsAgo14 + Math.random() * (now - monthsAgo14));
}

// 随机整数 [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const conn = await mysql.createConnection(RAILWAY_DB);
  console.log('✅ 连接到 Railway 数据库');

  // 获取所有产品的评论数
  const [allProducts] = await conn.execute(`
    SELECT productId, COUNT(*) as cnt 
    FROM reviews 
    GROUP BY productId 
    ORDER BY productId
  `);

  console.log(`共 ${allProducts.length} 个产品有评论`);

  // 找出需要随机化的产品（整千整万）
  const needRandomize = allProducts.filter(r => Number(r.cnt) % 1000 === 0);
  console.log(`需要随机化数量的产品: ${needRandomize.length} 个`);

  let processed = 0;

  for (const product of allProducts) {
    const productId = product.productId;
    const currentCount = Number(product.cnt);

    // === 步骤1：随机化数量（只对整数产品操作）===
    if (currentCount % 1000 === 0) {
      // 目标数量：在当前数量基础上随机增减 -3000 到 +3000，但保留零头
      const delta = randInt(-2800, 2800);
      const targetCount = currentCount + delta;
      const remainder = randInt(47, 997); // 零头
      const finalTarget = Math.floor(targetCount / 1000) * 1000 + remainder;

      if (finalTarget < currentCount) {
        // 需要删除一些评论
        const toDelete = currentCount - finalTarget;
        await conn.execute(`
          DELETE FROM reviews 
          WHERE productId = ? 
          ORDER BY RAND() 
          LIMIT ${toDelete}
        `, [productId]);
      }
      // 如果 finalTarget > currentCount，我们只删减不新增（避免内容重复问题，后续步骤3会处理内容）
      // 这里只做减法，让数量有零头即可
    }

    // === 步骤2：调整评分分布 ===
    // 获取当前实际评论数（可能已被步骤1修改）
    const [[{ cnt: actualCount }]] = await conn.execute(
      `SELECT COUNT(*) as cnt FROM reviews WHERE productId = ?`, [productId]
    );
    const total = Number(actualCount);

    // 计算各星级目标数量
    const targets = RATING_DIST.map(d => ({
      rating: d.rating,
      target: Math.round(total * d.pct)
    }));
    // 修正四舍五入误差，确保总和等于total
    const sum = targets.reduce((s, t) => s + t.target, 0);
    targets[0].target += (total - sum); // 差额加到5星

    // 获取当前各星级数量
    const [currentRatings] = await conn.execute(
      `SELECT rating, COUNT(*) as cnt FROM reviews WHERE productId = ? GROUP BY rating`,
      [productId]
    );
    const currentMap = {};
    currentRatings.forEach(r => { currentMap[r.rating] = Number(r.cnt); });

    for (const { rating, target } of targets) {
      const current = currentMap[rating] || 0;
      if (current > target) {
        // 删除多余的
        const toDelete = current - target;
        await conn.execute(`
          DELETE FROM reviews 
          WHERE productId = ? AND rating = ? 
          ORDER BY RAND() 
          LIMIT ${toDelete}
        `, [productId, rating]);
      } else if (current < target) {
        // 需要增加，但先跳过（后续内容多样化时一起处理）
        // 暂时通过修改现有评论的rating来平衡
        // 找多余的5星评论改成目标星级
        const toAdd = target - current;
        // 从5星中随机选一些改成当前星级（只在5星有富余时）
        if (rating !== 5) {
          await conn.execute(`
            UPDATE reviews 
            SET rating = ?
            WHERE productId = ? AND rating = 5
            ORDER BY RAND()
            LIMIT ${toAdd}
          `, [rating, productId]);
        }
      }
    }

    // === 步骤3：分散日期（14个月内随机分布）===
    // 批量更新所有评论的日期
    // 用随机时间戳更新，分批处理避免超时
    const batchSize = 5000;
    let offset = 0;
    while (true) {
      const [ids] = await conn.execute(
        `SELECT id FROM reviews WHERE productId = ? LIMIT ${batchSize} OFFSET ${offset}`,
        [productId]
      );
      if (ids.length === 0) break;

      // 生成随机日期
      const now = Date.now();
      const monthsAgo14 = now - 14 * 30 * 24 * 60 * 60 * 1000;
      
      // 批量更新，每条记录用不同的随机日期
      for (const row of ids) {
        const randomTs = new Date(monthsAgo14 + Math.random() * (now - monthsAgo14));
        await conn.execute(
          `UPDATE reviews SET createdAt = ? WHERE id = ?`,
          [randomTs, row.id]
        );
      }
      offset += batchSize;
    }

    processed++;
    if (processed % 10 === 0) {
      console.log(`进度: ${processed}/${allProducts.length} 个产品处理完成`);
    }
  }

  // 最终验证
  const [finalStats] = await conn.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as star5,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as star4,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as star3,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as star2,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as star1,
      MIN(createdAt) as oldest,
      MAX(createdAt) as newest
    FROM reviews
  `);
  const s = finalStats[0];
  const t = Number(s.total);
  console.log('\n=== 最终统计 ===');
  console.log(`总评论数: ${t}`);
  console.log(`5星: ${s.star5} (${(Number(s.star5)/t*100).toFixed(1)}%)`);
  console.log(`4星: ${s.star4} (${(Number(s.star4)/t*100).toFixed(1)}%)`);
  console.log(`3星: ${s.star3} (${(Number(s.star3)/t*100).toFixed(1)}%)`);
  console.log(`2星: ${s.star2} (${(Number(s.star2)/t*100).toFixed(1)}%)`);
  console.log(`1星: ${s.star1} (${(Number(s.star1)/t*100).toFixed(1)}%)`);
  console.log(`最早日期: ${s.oldest}`);
  console.log(`最新日期: ${s.newest}`);

  // 检查还有没有整数
  const [intCheck] = await conn.execute(`
    SELECT productId, COUNT(*) as cnt FROM reviews GROUP BY productId HAVING cnt % 1000 = 0
  `);
  console.log(`\n仍然是整数的产品: ${intCheck.length} 个`);

  await conn.end();
  console.log('\n✅ 全部完成！');
}

main().catch(console.error);
