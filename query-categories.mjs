import { getDb } from "./server/db.ts";
import { categories, products } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

const cats = await db.select().from(categories);
console.log("\n所有分类:");
for (const cat of cats) {
  const prods = await db.select().from(products).where(eq(products.categoryId, cat.id));
  if (prods.length > 0) {
    console.log(`ID: ${cat.id}, 名称: ${cat.name}, 商品数: ${prods.length}`);
  }
}
process.exit(0);
