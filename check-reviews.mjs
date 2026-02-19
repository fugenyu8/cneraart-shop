import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

try {
  // 总评价数
  const totalResult = await db.execute(sql`SELECT COUNT(*) as total FROM reviews`);
  console.log('\n📊 评价总数:', totalResult[0][0].total);
  
  // 评分分布
  const ratingResult = await db.execute(sql`
    SELECT rating, COUNT(*) as count, 
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews), 2) as percentage
    FROM reviews 
    GROUP BY rating 
    ORDER BY rating DESC
  `);
  console.log('\n⭐ 评分分布:');
  ratingResult[0].forEach(row => {
    console.log(`  ${row.rating}星: ${row.count} 条 (${row.percentage}%)`);
  });
  
  // 前5个商品的评价数
  const productResult = await db.execute(sql`
    SELECT p.name, COUNT(r.id) as review_count, ROUND(AVG(r.rating), 2) as avg_rating
    FROM products p
    LEFT JOIN reviews r ON p.id = r.productId
    GROUP BY p.id, p.name
    ORDER BY p.id
    LIMIT 5
  `);
  console.log('\n📦 前5个商品评价数:');
  productResult[0].forEach(row => {
    console.log(`  ${row.name}: ${row.review_count} 条评价, 平均${row.avg_rating}星`);
  });
  
  // 语言分布
  const langResult = await db.execute(sql`
    SELECT 
      CASE 
        WHEN location LIKE '%China%' OR location LIKE '%中国%' THEN 'Chinese'
        WHEN location LIKE '%Germany%' THEN 'German'
        WHEN location LIKE '%France%' THEN 'French'
        WHEN location LIKE '%Italy%' THEN 'Italian'
        WHEN location LIKE '%Spain%' THEN 'Spanish'
        ELSE 'English'
      END as language,
      COUNT(*) as count,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews), 2) as percentage
    FROM reviews
    GROUP BY language
    ORDER BY count DESC
  `);
  console.log('\n🌍 语言分布:');
  langResult[0].forEach(row => {
    console.log(`  ${row.language}: ${row.count} 条 (${row.percentage}%)`);
  });
  
  // 随机样本
  const sampleResult = await db.execute(sql`
    SELECT userName, rating, LEFT(comment, 80) as content_preview, location
    FROM reviews
    ORDER BY RAND()
    LIMIT 3
  `);
  console.log('\n📝 随机样本评价:');
  sampleResult[0].forEach((row, idx) => {
    console.log(`\n  ${idx + 1}. ${row.userName} (${row.location}) - ${row.rating}星`);
    console.log(`     "${row.content_preview}..."`);
  });
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await connection.end();
  process.exit(0);
}
