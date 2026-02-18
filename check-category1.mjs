import { getDb } from "./server/db.ts";
import { products } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

const category1Products = await db.select().from(products).where(eq(products.categoryId, 1));

console.log(`\n分类1(命理运势)共有 ${category1Products.length} 个商品:\n`);

category1Products.forEach(p => {
  console.log(`ID: ${p.id}`);
  console.log(`名称: ${p.name}`);
  console.log(`Slug: ${p.slug}`);
  console.log(`---`);
});

process.exit(0);
