import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

try {
  const result = await db.execute(sql`
    SELECT userName, rating, comment, location 
    FROM reviews 
    WHERE comment IS NOT NULL AND comment != ''
    LIMIT 5
  `);
  
  console.log('\n✅ 评价内容样本 (使用comment字段):');
  result[0].forEach((row, idx) => {
    console.log(`\n${idx + 1}. ${row.userName} (${row.location}) - ${row.rating}星`);
    console.log(`   ${row.comment.substring(0, 200)}...`);
  });
  
  const count = await db.execute(sql`SELECT COUNT(*) as count FROM reviews WHERE comment IS NOT NULL AND comment != ''`);
  console.log(`\n📊 当前有效评价数: ${count[0][0].count}`);
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await connection.end();
  process.exit(0);
}
