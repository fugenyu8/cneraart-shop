import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products, categories } from './drizzle/schema.ts';
import { eq, like, inArray, and } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Step 1: Create 7 subcategories under category 1 (开光护佑法物)
const subcats = [
  { name: '生肖守护', slug: 'zodiac-guardians', description: '根据您的出生年份,为您提供专属的生肖守护法物', parentId: 1, displayOrder: 11 },
  { name: '太阳星座守护', slug: 'sun-sign-guardians', description: '根据您的出生日期,守护您的外在性格与人生方向', parentId: 1, displayOrder: 12 },
  { name: '月亮星座守护', slug: 'moon-sign-guardians', description: '守护您的情感世界与内心需求,加强情感能量', parentId: 1, displayOrder: 13 },
  { name: '招财旺运', slug: 'wealth-fortune', description: '助力事业发展,招财纳福,提升财运', parentId: 1, displayOrder: 14 },
  { name: '平安健康', slug: 'health-safety', description: '祛病消灾,保佑平安,增强体质', parentId: 1, displayOrder: 15 },
  { name: '智慧学业', slug: 'wisdom-study', description: '开启智慧,学业进步,考试顺利', parentId: 1, displayOrder: 16 },
  { name: '心灵平和', slug: 'inner-peace', description: '平复内心,消除烦恼,心灵宁静', parentId: 1, displayOrder: 17 },
];

// Check if subcategories already exist
const existingCats = await db.select().from(categories);
const existingSlugs = new Set(existingCats.map(c => c.slug));

for (const sub of subcats) {
  if (existingSlugs.has(sub.slug)) {
    console.log(`子分类 "${sub.name}" (${sub.slug}) 已存在，跳过`);
  } else {
    await db.insert(categories).values(sub);
    console.log(`✓ 创建子分类: ${sub.name} (${sub.slug})`);
  }
}

// Re-fetch categories to get IDs
const allCats = await db.select().from(categories);
const catMap = {};
allCats.forEach(c => { catMap[c.slug] = c.id; });
console.log('\n分类ID映射:', catMap);

// Step 2: Reassign products to subcategories
// 2a. 生肖守护 (12 Chinese Zodiac animals) - IDs 30001-30012
const zodiacIds = [];
for (let i = 30001; i <= 30012; i++) zodiacIds.push(i);
// Also include ID:1 Chinese Zodiac Guardian Pendant
zodiacIds.push(1);
await db.update(products)
  .set({ categoryId: catMap['zodiac-guardians'] })
  .where(inArray(products.id, zodiacIds));
console.log(`✓ 生肖守护: ${zodiacIds.length}个产品已分配`);

// 2b. 太阳星座守护 (12 constellation pendants, Chinese names) - IDs 30013-30024
const sunSignIds = [];
for (let i = 30013; i <= 30024; i++) sunSignIds.push(i);
// Also include ID:5 Zodiac Constellation Guardian Pendant
sunSignIds.push(5);
await db.update(products)
  .set({ categoryId: catMap['sun-sign-guardians'] })
  .where(inArray(products.id, sunSignIds));
console.log(`✓ 太阳星座守护: ${sunSignIds.length}个产品已分配`);

// 2c. 月亮星座守护 (12 Moon Crescent Pendants, English names) - IDs 30025-30036
const moonSignIds = [];
for (let i = 30025; i <= 30036; i++) moonSignIds.push(i);
// Also include ID:6 Zodiac Moon Crescent Pendant
moonSignIds.push(6);
await db.update(products)
  .set({ categoryId: catMap['moon-sign-guardians'] })
  .where(inArray(products.id, moonSignIds));
console.log(`✓ 月亮星座守护: ${moonSignIds.length}个产品已分配`);

// 2d. 招财旺运: 黄财神手链(30040) + 七星吊坠(3)
await db.update(products)
  .set({ categoryId: catMap['wealth-fortune'] })
  .where(inArray(products.id, [30040, 3]));
console.log('✓ 招财旺运: 2个产品已分配');

// 2e. 平安健康: 大悲咒手链(30038) + 阿弥陀佛手链(30041)
await db.update(products)
  .set({ categoryId: catMap['health-safety'] })
  .where(inArray(products.id, [30038, 30041]));
console.log('✓ 平安健康: 2个产品已分配');

// 2f. 智慧学业: 楞严咒手链(30039) + 东方智慧经文吊坠(2)
await db.update(products)
  .set({ categoryId: catMap['wisdom-study'] })
  .where(inArray(products.id, [30039, 2]));
console.log('✓ 智慧学业: 2个产品已分配');

// 2g. 心灵平和: 心经手链(30037) + 能量手链(4)
await db.update(products)
  .set({ categoryId: catMap['inner-peace'] })
  .where(inArray(products.id, [30037, 4]));
console.log('✓ 心灵平和: 2个产品已分配');

// Step 3: Verify
console.log('\n=== 分配结果验证 ===');
const updatedCats = await db.select().from(categories).where(eq(categories.parentId, 1));
for (const cat of updatedCats) {
  const prods = await db.select().from(products).where(eq(products.categoryId, cat.id));
  console.log(`${cat.name} (ID: ${cat.id}): ${prods.length}个产品`);
  prods.forEach(p => console.log(`  - ${p.id}: ${p.name}`));
}

// Also check remaining in category 1
const remaining = await db.select().from(products).where(eq(products.categoryId, 1));
console.log(`\n开光护佑法物(ID:1)剩余: ${remaining.length}个产品`);
remaining.forEach(p => console.log(`  - ${p.id}: ${p.name}`));

await connection.end();
console.log('\n✓ 子分类创建和产品重新分配完成!');
