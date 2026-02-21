import mysql from 'mysql2/promise';

// Use the same DATABASE_URL from the environment
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await mysql.createConnection(url);

// Query 1: All categories
console.log("=== CATEGORIES ===");
const [cats] = await conn.execute("SELECT id, name, slug, parentId, displayOrder FROM categories ORDER BY id");
for (const c of cats) {
  console.log(`  ID=${c.id} name="${c.name}" slug="${c.slug}" parentId=${c.parentId} order=${c.displayOrder}`);
}

// Query 2: Product count by category
console.log("\n=== PRODUCTS BY CATEGORY ===");
const [counts] = await conn.execute(`
  SELECT c.id, c.name, c.slug, COUNT(p.id) as cnt 
  FROM categories c 
  LEFT JOIN products p ON p.categoryId = c.id AND p.status = 'published'
  GROUP BY c.id, c.name, c.slug 
  ORDER BY c.id
`);
for (const r of counts) {
  console.log(`  Category ${r.id} (${r.name} / ${r.slug}): ${r.cnt} published products`);
}

// Query 3: Total products
const [total] = await conn.execute("SELECT COUNT(*) as cnt, status FROM products GROUP BY status");
console.log("\n=== TOTAL PRODUCTS BY STATUS ===");
for (const r of total) {
  console.log(`  Status "${r.status}": ${r.cnt}`);
}

// Query 4: All products list
console.log("\n=== ALL PRODUCTS ===");
const [allProds] = await conn.execute("SELECT id, name, categoryId, status, regularPrice FROM products ORDER BY categoryId, id");
for (const p of allProds) {
  console.log(`  ID=${p.id} cat=${p.categoryId} status=${p.status} price=${p.regularPrice} name="${p.name}"`);
}

await conn.end();
process.exit(0);
