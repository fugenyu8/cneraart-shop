import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [newProducts] = await conn.execute('SELECT id, name FROM products WHERE id >= 600000 ORDER BY id');
console.log('新增商品总数:', newProducts.length);

const [reviewCounts] = await conn.execute(
  'SELECT productId, COUNT(*) as cnt FROM reviews WHERE productId >= 600000 GROUP BY productId ORDER BY productId'
);
console.log('有评论的商品数:', reviewCounts.length);
console.log('各商品评论数:', reviewCounts.map(r => `ID ${r.productId}: ${r.cnt}条`));

const withReviewIds = new Set(reviewCounts.map(r => r.productId));
const noReviewProducts = newProducts.filter(p => !withReviewIds.has(p.id));
console.log('\n缺少评论的商品数:', noReviewProducts.length);
if (noReviewProducts.length > 0) {
  console.log('缺少评论的商品:');
  noReviewProducts.forEach(p => console.log(`  ID ${p.id}: ${p.name.substring(0,50)}`));
}

// 检查700xxx范围的商品
const [newProducts2] = await conn.execute('SELECT id, name FROM products WHERE id >= 700000 ORDER BY id');
console.log('\n700xxx范围商品总数:', newProducts2.length);
const [reviewCounts2] = await conn.execute(
  'SELECT productId, COUNT(*) as cnt FROM reviews WHERE productId >= 700000 GROUP BY productId ORDER BY productId'
);
console.log('700xxx有评论的商品数:', reviewCounts2.length);
const withReviewIds2 = new Set(reviewCounts2.map(r => r.productId));
const noReviewProducts2 = newProducts2.filter(p => !withReviewIds2.has(p.id));
console.log('700xxx缺少评论的商品数:', noReviewProducts2.length);
if (noReviewProducts2.length > 0) {
  noReviewProducts2.forEach(p => console.log(`  ID ${p.id}: ${p.name.substring(0,50)}`));
}

await conn.end();
