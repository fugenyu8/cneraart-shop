import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';
import { readFileSync } from 'fs';

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  // 读取星座商品数据
  const constellationData = JSON.parse(
    readFileSync('/home/ubuntu/constellation_products_data.json', 'utf-8')
  );

  console.log(`准备导入 ${constellationData.length} 个星座商品...`);

  for (const product of constellationData) {
    try {
      // 插入商品
      const [result] = await db.insert(schema.products).values({
        name: product.name,
        slug: product.slug,
        description: product.description,
        regularPrice: 55.00,
        salePrice: 45.00,
        stock: 999,
        categoryId: 1, // 开光法物
        status: 'published',
        featured: true,
        tags: JSON.stringify(['开光法物', '星座守护', '五台山', product.zodiacSignZh, product.zodiacSign]),
        blessedAt: '五台山',
        blessedBy: '五台山高僧',
        blessingDescription: '经五台山高僧古法开光加持,融合东方能量仪式与西方星座智慧,注入纯正愿力,调和身心能量,安定心神,为您的星座能量场提供守护。'
      });

      const productId = result.insertId;

      // 插入商品图片
      await db.insert(schema.productImages).values({
        productId: productId,
        url: product.imageUrl,
        fileKey: product.imageUrl.split('/').pop(),
        displayOrder: 0,
        isPrimary: true
      });

      console.log(`✅ 成功导入: ${product.name} (ID: ${productId})`);
    } catch (error) {
      console.error(`❌ 导入失败: ${product.name}`, error.message);
    }
  }

  await connection.end();
  console.log('\n✅ 所有星座商品导入完成!');
}

main().catch(console.error);
