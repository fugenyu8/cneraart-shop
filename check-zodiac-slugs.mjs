import { getDb } from "./server/db.ts";
import { products } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

const zodiacProducts = await db.select().from(products).where(eq(products.categoryId, 90001)).limit(3);

console.log("\n生肖守护商品示例:\n");
zodiacProducts.forEach(p => {
  console.log(`名称: ${p.name}`);
  console.log(`Slug: ${p.slug}`);
  console.log(`---`);
});

process.exit(0);
