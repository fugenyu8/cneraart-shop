import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

try {
  // 检查content字段的实际值
  const result = await db.execute(sql`
    SELECT id, userName, rating, content, CHAR_LENGTH(content) as content_length, location 
    FROM reviews 
    LIMIT 10
  `);
  
  console.log('\n📝 前10条评价的content字段检查:');
  result[0].forEach((row, idx) => {
    console.log(`\n${idx + 1}. ID: ${row.id}, ${row.userName} (${row.location}) - ${row.rating}星`);
    console.log(`   Content Length: ${row.content_length}`);
    console.log(`   Content: ${row.content ? row.content.substring(0, 150) : 'NULL'}`);
  });
  
  // 统计NULL和非NULL
  const stats = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN content IS NULL THEN 1 ELSE 0 END) as null_count,
      SUM(CASE WHEN content IS NOT NULL AND content != '' THEN 1 ELSE 0 END) as valid_count,
      SUM(CASE WHEN content = '' THEN 1 ELSE 0 END) as empty_count
    FROM reviews
  `);
  
  console.log('\n📊 Content字段统计:');
  console.log(`   总评价数: ${stats[0][0].total}`);
  console.log(`   NULL: ${stats[0][0].null_count}`);
  console.log(`   空字符串: ${stats[0][0].empty_count}`);
  console.log(`   有效内容: ${stats[0][0].valid_count}`);
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await connection.end();
  process.exit(0);
}
