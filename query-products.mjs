import mysql from 'mysql2/promise';

const DATABASE_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpIofT46rxSignU?ssl={"rejectUnauthorized":true}';

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // 1. List all categories
    console.log("=== CATEGORIES ===");
    const [cats] = await connection.execute('SELECT id, name, slug, parentId, displayOrder FROM categories ORDER BY parentId, displayOrder');
    console.table(cats);
    
    // 2. List all products with their category and image info
    console.log("\n=== PRODUCTS (id, name, categoryId, status) ===");
    const [prods] = await connection.execute(`
      SELECT p.id, p.name, p.categoryId, p.status, p.slug,
             c.name as categoryName
      FROM products p 
      LEFT JOIN categories c ON p.categoryId = c.id
      ORDER BY p.categoryId, p.id
    `);
    console.table(prods);
    
    // 3. List all product images
    console.log("\n=== PRODUCT IMAGES ===");
    const [imgs] = await connection.execute(`
      SELECT pi.id, pi.productId, pi.url, pi.isPrimary, pi.fileKey,
             p.name as productName
      FROM product_images pi
      LEFT JOIN products p ON pi.productId = p.id
      ORDER BY pi.productId, pi.displayOrder
    `);
    console.table(imgs);
    
    // 4. Count summary
    console.log("\n=== SUMMARY ===");
    const [prodCount] = await connection.execute('SELECT COUNT(*) as total FROM products');
    const [imgCount] = await connection.execute('SELECT COUNT(*) as total FROM product_images');
    const [prodWithImg] = await connection.execute('SELECT COUNT(DISTINCT productId) as total FROM product_images');
    console.log(`Total products: ${prodCount[0].total}`);
    console.log(`Total images: ${imgCount[0].total}`);
    console.log(`Products with images: ${prodWithImg[0].total}`);
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
