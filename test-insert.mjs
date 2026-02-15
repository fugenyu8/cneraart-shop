import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const result = await db.insert(products).values({
  name: "Test Product",
  slug: "test-product-" + Date.now(),
  regularPrice: "99.99",
  stock: 100,
  status: "draft",
  featured: false,
});

console.log("Result:", result);
console.log("insertId:", result.insertId);
console.log("Type:", typeof result.insertId);
