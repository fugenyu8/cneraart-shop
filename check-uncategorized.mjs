import { getDb } from './server/db.ts';
import { products } from './drizzle/schema.ts';
import { or, isNull, notInArray } from 'drizzle-orm';

const db = await getDb();
const uncategorized = await db.select({
  id: products.id,
  name: products.name,
  categoryId: products.categoryId
}).from(products).where(
  or(
    isNull(products.categoryId),
    notInArray(products.categoryId, [1, 6, 7])
  )
).orderBy(products.id);

console.log('=== 未正确分类的商品 ===');
console.log('总数:', uncategorized.length);
console.log('');
uncategorized.forEach(p => {
  console.log(`ID: ${p.id} | 分类ID: ${p.categoryId || '无'} | 名称: ${p.name}`);
});
process.exit(0);
