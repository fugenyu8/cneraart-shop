import mysql from 'mysql2/promise';
import { writeFileSync } from 'fs';

const DATABASE_URL = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpIofT46rxSignU?ssl={"rejectUnauthorized":true}';

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Get all categories
    const [cats] = await connection.execute('SELECT id, name, slug, parentId FROM categories ORDER BY id');
    
    // Get all products
    const [prods] = await connection.execute(`
      SELECT p.id, p.name, p.slug, p.categoryId, p.status, p.regularPrice, p.salePrice,
             c.name as categoryName
      FROM products p 
      LEFT JOIN categories c ON p.categoryId = c.id
      ORDER BY p.categoryId, p.id
    `);
    
    // Get all product images
    const [imgs] = await connection.execute(`
      SELECT pi.id, pi.productId, pi.url, pi.isPrimary, pi.fileKey
      FROM product_images pi
      ORDER BY pi.productId, pi.displayOrder
    `);
    
    const data = { categories: cats, products: prods, images: imgs };
    writeFileSync('/home/ubuntu/shop-data.json', JSON.stringify(data, null, 2));
    console.log(`Exported: ${cats.length} categories, ${prods.length} products, ${imgs.length} images`);
    
    // Analyze image URL types
    const urlTypes = {};
    for (const img of imgs) {
      if (img.url.includes('manuscdn.com')) urlTypes['manuscdn'] = (urlTypes['manuscdn'] || 0) + 1;
      else if (img.url.includes('wp-content')) urlTypes['wp-content'] = (urlTypes['wp-content'] || 0) + 1;
      else urlTypes['other'] = (urlTypes['other'] || 0) + 1;
    }
    console.log('Image URL types:', urlTypes);
    
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
