import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

try {
  // 检查content字段
  const result = await db.execute(sql`
    SELECT id, userName, rating, content, location 
    FROM reviews 
    WHERE content IS NOT NULL AND content != ''
    LIMIT 5
  `);
  
  console.log('\n📝 评价内容样本:');
  if (result[0].length === 0) {
    console.log('❌ 没有找到有效的评价内容!所有content字段都是NULL或空字符串!');
  } else {
    result[0].forEach((row, idx) => {
      console.log(`\n${idx + 1}. ${row.userName} (${row.location}) - ${row.rating}星`);
      console.log(`   内容: ${row.content.substring(0, 150)}...`);
    });
  }
  
  // 检查NULL数量
  const nullCount = await db.execute(sql`
    SELECT COUNT(*) as count FROM reviews WHERE content IS NULL OR content = ''
  `);
  console.log(`\n❌ NULL或空内容数量: ${nullCount[0][0].count}`);
  
  const validCount = await db.execute(sql`
    SELECT COUNT(*) as count FROM reviews WHERE content IS NOT NULL AND content != ''
  `);
  console.log(`✅ 有效内容数量: ${validCount[0][0].count}`);
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await connection.end();
  process.exit(0);
}
