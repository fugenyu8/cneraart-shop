import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import fs from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// 读取商品数据
const productsData = JSON.parse(fs.readFileSync('/home/ubuntu/zodiac_products_data.json', 'utf-8'));

// 获取"开光法物"分类ID
const BLESSED_ITEMS_CATEGORY_ID = 1;

console.log(`开始导入${productsData.length}个生肖商品...`);

for (const product of productsData) {
  const nameZh = `五台山开光${product.zodiac}守护吊坠`;
  
  try {
    const result = await db.insert(schema.products).values({
      name: nameZh,  // 使用中文名称
      slug: product.slug,
      description: product.descriptionZh,  // 使用中文描述
      regularPrice: product.regularPrice.toString(),
      salePrice: product.salePrice.toString(),
      stock: 999,
      categoryId: BLESSED_ITEMS_CATEGORY_ID,
      tags: JSON.stringify(['开光法物', '生肖守护', '五台山', product.zodiac, product.zodiacEn]),
      status: 'published',
      featured: true,
      blessingTemple: '五台山',
      blessingMaster: '五台山高僧',
      blessingDescription: '经五台山高僧古法开光加持,注入纯正愿力,调和身心能量,安定心神'
    });
    
    // 插入商品图片
    const productId = Number(result[0].insertId);
    // 从URL中提取fileKey (最后一部分)
    const fileKey = product.imageUrl.split('/').pop() || 'default.jpg';
    
    await db.insert(schema.productImages).values({
      productId: productId,
      url: product.imageUrl,
      fileKey: fileKey,
      displayOrder: 1,
      altText: nameZh,
      isPrimary: true
    });
    
    console.log(`✅ 成功导入: ${nameZh} (ID: ${productId})`);
  } catch (error) {
    console.error(`❌ 导入失败: ${nameZh}`, error.message);
  }
}

console.log('\n导入完成!');
await connection.end();
