import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

try {
  console.log('🗑️  Deleting all reviews with NULL or empty content...');
  
  const result = await db.execute(sql`
    DELETE FROM reviews WHERE content IS NULL OR content = ''
  `);
  
  console.log(`✅ Deleted ${result[0].affectedRows} reviews`);
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await connection.end();
  process.exit(0);
}
