import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products, categories } from './drizzle/schema.ts';
import { eq, like } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// 获取新创建的分类ID
const cats = await db.select().from(categories).where(eq(categories.parentId, 8));
const catMap = {};
cats.forEach(cat => {
  catMap[cat.slug] = cat.id;
});

console.log('分类ID映射:', catMap);

// 1. 将12个生肖守护商品分配到"生肖守护"分类
const zodiacNames = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
for (const zodiac of zodiacNames) {
  await db.update(products)
    .set({ categoryId: catMap['zodiac-guardians'] })
    .where(like(products.name, `%${zodiac} Guardian Pendant%`));
}
console.log('✓ 12个生肖守护商品已分配到分类:', catMap['zodiac-guardians']);

// 2. 将12个太阳星座商品分配到"太阳星座守护"分类(不包含Moon Crescent)
const sunSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
for (const sign of sunSigns) {
  const result = await db.update(products)
    .set({ categoryId: catMap['sun-sign-guardians'] })
    .where(like(products.name, `%${sign} Guardian Pendant%`));
}
console.log('✓ 12个太阳星座商品已分配到分类:', catMap['sun-sign-guardians']);

// 3. 将12个月亮星座商品分配到"月亮星座守护"分类
for (const sign of sunSigns) {
  await db.update(products)
    .set({ categoryId: catMap['moon-sign-guardians'] })
    .where(like(products.name, `%${sign} Zodiac Moon Crescent Pendant%`));
}
console.log('✓ 12个月亮星座商品已分配到分类:', catMap['moon-sign-guardians']);

// 4. 招财旺运: 黄财神手链、七星吊坠
await db.update(products)
  .set({ categoryId: catMap['wealth-fortune'] })
  .where(like(products.name, '%Yellow Jambhala Bracelet%'));
await db.update(products)
  .set({ categoryId: catMap['wealth-fortune'] })
  .where(like(products.name, '%Seven-Star Pendant%'));
console.log('✓ 2个招财旺运商品已分配到分类:', catMap['wealth-fortune']);

// 5. 平安健康: 大悲咒手链、阿弥陀佛手链
await db.update(products)
  .set({ categoryId: catMap['health-safety'] })
  .where(like(products.name, '%Great Compassion Mantra Bracelet%'));
await db.update(products)
  .set({ categoryId: catMap['health-safety'] })
  .where(like(products.name, '%Amitabha Bracelet%'));
console.log('✓ 2个平安健康商品已分配到分类:', catMap['health-safety']);

// 6. 智慧学业: 楞严咒手链、东方智慧经文吊坠
await db.update(products)
  .set({ categoryId: catMap['wisdom-study'] })
  .where(like(products.name, '%Shurangama Mantra Bracelet%'));
await db.update(products)
  .set({ categoryId: catMap['wisdom-study'] })
  .where(like(products.name, '%Eastern Ancient Wisdom Text Pendant%'));
console.log('✓ 2个智慧学业商品已分配到分类:', catMap['wisdom-study']);

// 7. 心灵平和: 心经手链
await db.update(products)
  .set({ categoryId: catMap['inner-peace'] })
  .where(like(products.name, '%Heart Sutra Bracelet%'));
console.log('✓ 1个心灵平和商品已分配到分类:', catMap['inner-peace']);

// 验证分配结果
console.log('\n=== 分配结果验证 ===');
for (const [slug, id] of Object.entries(catMap)) {
  const count = await db.select().from(products).where(eq(products.categoryId, id));
  const cat = cats.find(c => c.id === id);
  console.log(`${cat.name} (ID: ${id}): ${count.length}个商品`);
}

await connection.end();
console.log('\n✓ 商品重新分配完成!');
