import { getDb } from "./server/db.ts";
import { products } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

// 更新基础版商品图片为黑色八卦图
await db.update(products)
  .set({ imageUrl: '/fortune-black.jpg' })
  .where(eq(products.id, 510060));

console.log('✅ 已更新商品510060(基础版)图片为黑色八卦图');

// 更新升级版商品图片为金色八卦图
await db.update(products)
  .set({ imageUrl: '/fortune-gold.jpg' })
  .where(eq(products.id, 510061));

console.log('✅ 已更新商品510061(升级版)图片为金色八卦图');

// 验证更新
const updated = await db.select().from(products).where(eq(products.categoryId, 1));
console.log('\n验证结果:');
updated.forEach(p => {
  console.log(`${p.name}: ${p.imageUrl}`);
});

process.exit(0);
