import { getDb } from "./server/db.ts";
import { products } from "./drizzle/schema.ts";
import { like } from "drizzle-orm";

const db = await getDb();

// 查询包含fortune/命理相关的商品
const fortuneProducts = await db.select().from(products).where(like(products.name, '%Fortune%'));

console.log(`\n找到 ${fortuneProducts.length} 个Fortune相关商品:\n`);

fortuneProducts.forEach(p => {
  console.log(`ID: ${p.id}`);
  console.log(`名称: ${p.name}`);
  console.log(`Slug: ${p.slug}`);
  console.log(`分类ID: ${p.categoryId}`);
  console.log(`---`);
});

process.exit(0);
