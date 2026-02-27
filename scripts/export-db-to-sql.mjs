/**
 * 导出数据库数据为SQL迁移文件
 * 生成 seeds/products-and-images.sql 和 seeds/reviews.sql
 */
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// 确保 seeds 目录存在
const seedsDir = path.join(process.cwd(), 'seeds');
if (!fs.existsSync(seedsDir)) fs.mkdirSync(seedsDir, { recursive: true });

function escapeValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
  // string
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
}

function buildInsert(table, rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const lines = [];
  // batch insert 100 rows at a time
  for (let i = 0; i < rows.length; i += 100) {
    const batch = rows.slice(i, i + 100);
    const values = batch.map(row => `(${cols.map(c => escapeValue(row[c])).join(', ')})`).join(',\n  ');
    lines.push(`INSERT INTO \`${table}\` (\`${cols.join('`, `')}\`) VALUES\n  ${values};`);
  }
  return lines.join('\n');
}

// ===== 1. 导出 categories =====
console.log('导出 categories...');
const [cats] = await conn.execute('SELECT * FROM categories ORDER BY id');
console.log(`  ${cats.length} 条分类`);

// ===== 2. 导出 products =====
console.log('导出 products...');
const [products] = await conn.execute('SELECT * FROM products ORDER BY id');
console.log(`  ${products.length} 个产品`);

// ===== 3. 导出 product_images =====
console.log('导出 product_images...');
const [images] = await conn.execute('SELECT * FROM product_images ORDER BY productId, displayOrder');
console.log(`  ${images.length} 张图片`);

// ===== 写入 products-and-images.sql =====
const productsSQL = `-- ============================================================
-- 源・华渡商城 产品数据迁移文件
-- 生成时间: ${new Date().toISOString()}
-- 产品数量: ${products.length}
-- 图片数量: ${images.length}
-- 分类数量: ${cats.length}
-- 使用方法: mysql -u root -p your_database < seeds/products-and-images.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 分类数据
-- ------------------------------------------------------------
${buildInsert('categories', cats)}

-- ------------------------------------------------------------
-- 产品数据
-- ------------------------------------------------------------
${buildInsert('products', products)}

-- ------------------------------------------------------------
-- 产品图片数据
-- ------------------------------------------------------------
${buildInsert('product_images', images)}

SET FOREIGN_KEY_CHECKS = 1;
`;

fs.writeFileSync(path.join(seedsDir, 'products-and-images.sql'), productsSQL, 'utf8');
console.log('✅ 已写入 seeds/products-and-images.sql');

// ===== 4. 导出 reviews (分批处理) =====
console.log('导出 reviews...');
const [revCount] = await conn.execute('SELECT COUNT(*) as cnt FROM reviews');
const total = revCount[0].cnt;
console.log(`  共 ${total} 条评论，分批导出...`);

const reviewsFile = path.join(seedsDir, 'reviews.sql');
fs.writeFileSync(reviewsFile, `-- ============================================================
-- 源・华渡商城 评论数据迁移文件
-- 生成时间: ${new Date().toISOString()}
-- 评论数量: ${total}
-- 使用方法: mysql -u root -p your_database < seeds/reviews.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

`, 'utf8');

const batchSize = 5000;
let offset = 0;
let batchNum = 0;
while (offset < total) {
  const [reviews] = await conn.execute(`SELECT * FROM reviews ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`);
  if (!reviews.length) break;
  const sql = buildInsert('reviews', reviews) + '\n';
  fs.appendFileSync(reviewsFile, sql, 'utf8');
  offset += reviews.length;
  batchNum++;
  if (batchNum % 10 === 0) process.stdout.write(`  已导出 ${offset}/${total} 条...\n`);
}

fs.appendFileSync(reviewsFile, '\nSET FOREIGN_KEY_CHECKS = 1;\n', 'utf8');
console.log(`✅ 已写入 seeds/reviews.sql (${total} 条评论)`);

await conn.end();
console.log('\n🎉 导出完成！');
console.log('文件位置:');
console.log('  seeds/products-and-images.sql');
console.log('  seeds/reviews.sql');
