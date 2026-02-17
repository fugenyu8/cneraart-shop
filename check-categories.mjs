import { getDb } from './server/db.ts';
import { categories, products } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = await getDb();
const allCategories = await db.select().from(categories).orderBy(categories.id);
console.log('=== 所有分类及商品分布 ===\n');

for (const cat of allCategories) {
  const catProducts = await db.select({
    id: products.id,
    name: products.name
  }).from(products).where(eq(products.categoryId, cat.id)).orderBy(products.name);
  
  console.log(`【${cat.name}】(ID: ${cat.id}) - ${catProducts.length}个商品`);
  catProducts.forEach(p => {
    console.log(`  - ${p.name} (ID: ${p.id})`);
  });
  console.log('');
}

process.exit(0);
