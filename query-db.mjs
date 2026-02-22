import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(
    'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpIofT46rxSignU?ssl={"rejectUnauthorized":true}'
  );

  // Get categories
  const [categories] = await conn.query('SELECT * FROM categories ORDER BY id');
  console.log('=== CATEGORIES ===');
  categories.forEach(c => console.log(`  id=${c.id} | parent=${c.parentId} | ${c.name} (${c.slug})`));

  // Get all published products
  const [products] = await conn.query(`
    SELECT p.id, p.name, p.slug, p.categoryId, c.name as catName,
           p.regularPrice, p.salePrice, p.status
    FROM products p 
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE p.status = 'published'
    ORDER BY p.categoryId, p.id
  `);

  // Get all product images
  const [images] = await conn.query(
    'SELECT id, productId, url, isPrimary, displayOrder FROM product_images ORDER BY productId, displayOrder'
  );

  const imgMap = {};
  for (const img of images) {
    if (!imgMap[img.productId]) imgMap[img.productId] = [];
    imgMap[img.productId].push(img);
  }

  console.log('\n=== PRODUCTS ===');
  for (const p of products) {
    const imgs = imgMap[p.id] || [];
    const primaryImg = imgs.find(i => i.isPrimary) || imgs[0];
    const primaryUrl = primaryImg ? primaryImg.url.substring(0, 100) : 'NO IMAGE';
    console.log(`[cat:${p.categoryId}] ${(p.catName || 'N/A').padEnd(30)} | pid=${String(p.id).padStart(5)} | $${p.salePrice || p.regularPrice} | ${p.name.substring(0, 60)}`);
    console.log(`  primary: ${primaryUrl}`);
    console.log(`  total images: ${imgs.length}`);
  }

  console.log(`\nTotal products: ${products.length}`);
  console.log(`Total images: ${images.length}`);

  // Export as JSON for later use
  const fs = await import('fs');
  fs.writeFileSync('/home/ubuntu/db_products.json', JSON.stringify({ categories, products, images }, null, 2));
  console.log('\nExported to /home/ubuntu/db_products.json');

  await conn.end();
}

main().catch(console.error);
