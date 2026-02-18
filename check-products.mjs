import { getDb } from "./server/db.js";
import { products, categories } from "./drizzle/schema.js";

const db = await getDb();

console.log("=== Categories ===");
const cats = await db.select().from(categories);
console.log(JSON.stringify(cats, null, 2));

console.log("\n=== Products (first 10) ===");
const prods = await db.select({
  id: products.id,
  name: products.name,
  slug: products.slug,
  categoryId: products.categoryId,
  status: products.status,
  regularPrice: products.regularPrice
}).from(products).limit(10);
console.log(JSON.stringify(prods, null, 2));

process.exit(0);
