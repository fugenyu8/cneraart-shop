import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';
import fs from 'fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('📖 读取SQL文件...');
const sql = fs.readFileSync('./expand-services-rules.sql', 'utf-8');

console.log('🚀 执行SQL语句...');
const statements = sql.split(';').filter(s => s.trim().length > 0);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i].trim();
  if (stmt.startsWith('--') || !stmt) continue;
  
  try {
    console.log(`执行第 ${i + 1}/${statements.length} 条语句...`);
    await connection.query(stmt);
  } catch (error) {
    console.error(`执行失败: ${error.message}`);
    console.error(`语句: ${stmt.substring(0, 100)}...`);
  }
}

console.log('✅ SQL执行完成!');

// 验证插入结果
const [faceRules] = await connection.query('SELECT COUNT(*) as count FROM face_rules');
const [palmRules] = await connection.query('SELECT COUNT(*) as count FROM palm_rules');
const [fengshuiRules] = await connection.query('SELECT COUNT(*) as count FROM fengshui_rules');

console.log(`\n📊 数据统计:`);
console.log(`面相规则: ${faceRules[0].count} 条`);
console.log(`手相规则: ${palmRules[0].count} 条`);
console.log(`风水规则: ${fengshuiRules[0].count} 条`);

await connection.end();
