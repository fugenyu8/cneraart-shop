import { getDb } from "./server/db.ts";
import { products } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

// 查询月亮星座守护商品(分类90003)
const moonProducts = await db.select().from(products).where(eq(products.categoryId, 90003));

console.log(`\n月亮星座守护分类共有 ${moonProducts.length} 个商品:\n`);

moonProducts.forEach((product, index) => {
  console.log(`${index + 1}. ID: ${product.id}, 名称: ${product.name}, Slug: ${product.slug}`);
});

process.exit(0);
