import { getDb } from "../server/db.ts";
import { products, productImages, cartItems, orderItems, reviews } from "../drizzle/schema.ts";
import { eq, inArray, and, isNull } from "drizzle-orm";

const db = await getDb();

// 这4个无分类商品的原始 ID（早期创建的测试商品）
// 1. Zodiac Moon Crescent Pendant (ID: 6)
// 2. Zodiac Constellation Guardian Pendant (ID: 5)
// 3. Chinese Zodiac Guardian Pendant (ID: 3)
// 4. Master-Infused Energy Bracelet (ID: 4)

// 先查询确认哪些商品没有被分配到子分类
console.log("=== 查找无分类商品 ===\n");

const allProducts = await db.select({
  id: products.id,
  name: products.name,
  categoryId: products.categoryId,
}).from(products);

// 查找所有子分类 ID
const { categories } = await import("../drizzle/schema.ts");
const allCategories = await db.select({
  id: categories.id,
  name: categories.name,
  parentId: categories.parentId,
}).from(categories);

const subcategoryIds = allCategories
  .filter(c => c.parentId !== null)
  .map(c => c.id);

console.log(`子分类 ID 列表: ${subcategoryIds.join(', ')}\n`);

// 找出 categoryId 为 null 或不在子分类列表中的商品
const uncategorized = allProducts.filter(p => 
  p.categoryId === null || !subcategoryIds.includes(p.categoryId)
);

console.log(`找到 ${uncategorized.length} 个无子分类商品:\n`);
for (const p of uncategorized) {
  const catName = allCategories.find(c => c.id === p.categoryId)?.name || '无分类';
  console.log(`  ID: ${p.id} | ${p.name} | categoryId: ${p.categoryId} (${catName})`);
}

if (uncategorized.length === 0) {
  console.log("\n没有需要删除的商品。");
  process.exit(0);
}

const idsToDelete = uncategorized.map(p => p.id);
console.log(`\n准备删除商品 ID: ${idsToDelete.join(', ')}\n`);

try {
  // 1. 删除购物车中的关联记录
  const deletedCart = await db.delete(cartItems).where(inArray(cartItems.productId, idsToDelete));
  console.log(`✓ 已清理购物车关联记录`);

  // 2. 删除评价记录
  const deletedReviews = await db.delete(reviews).where(inArray(reviews.productId, idsToDelete));
  console.log(`✓ 已清理评价记录`);

  // 3. 删除商品图片记录
  const deletedImages = await db.delete(productImages).where(inArray(productImages.productId, idsToDelete));
  console.log(`✓ 已删除商品图片记录`);

  // 4. 删除商品本身
  const deletedProducts = await db.delete(products).where(inArray(products.id, idsToDelete));
  console.log(`✓ 已删除 ${idsToDelete.length} 个商品`);

  // 5. 验证
  const remaining = await db.select({ id: products.id, name: products.name })
    .from(products)
    .where(inArray(products.id, idsToDelete));
  
  if (remaining.length === 0) {
    console.log(`\n✅ 删除完成！所有 ${idsToDelete.length} 个无分类商品已成功删除。`);
  } else {
    console.log(`\n⚠️ 仍有 ${remaining.length} 个商品未删除:`, remaining);
  }

  process.exit(0);
} catch (error) {
  console.error("\n❌ 删除失败:", error);
  process.exit(1);
}
