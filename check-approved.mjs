import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { mode: 'default' });

try {
  // 检查isApproved字段的分布
  const approvedResult = await db.execute(sql`
    SELECT isApproved, COUNT(*) as count
    FROM reviews
    GROUP BY isApproved
  `);
  
  console.log('\n📊 isApproved字段分布:');
  approvedResult[0].forEach(row => {
    console.log(`  isApproved=${row.isApproved}: ${row.count}条`);
  });
  
  // 检查已审核的评价数量
  const approvedCount = await db.execute(sql`
    SELECT COUNT(*) as count FROM reviews WHERE isApproved = 1
  `);
  console.log(`\n✅ 已审核评价: ${approvedCount[0][0].count}条`);
  
  // 检查未审核的评价数量
  const notApprovedCount = await db.execute(sql`
    SELECT COUNT(*) as count FROM reviews WHERE isApproved = 0 OR isApproved IS NULL
  `);
  console.log(`❌ 未审核评价: ${notApprovedCount[0][0].count}条`);
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await connection.end();
  process.exit(0);
}
