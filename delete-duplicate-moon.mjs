import { getDb } from "./server/db.ts";
import { products, productImages } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = await getDb();

const productId = 120006; // Zodiac Moon Crescent Pendant

console.log(`准备删除商品 ID: ${productId} - Zodiac Moon Crescent Pendant\n`);

try {
  // 1. 先删除关联的图片记录
  const deletedImages = await db.delete(productImages).where(eq(productImages.productId, productId));
  console.log(`✓ 已删除关联的图片记录`);
  
  // 2. 删除商品本身
  await db.delete(products).where(eq(products.id, productId));
  console.log(`✓ 已删除商品记录`);
  
  console.log(`\n删除完成!`);
  process.exit(0);
} catch (error) {
  console.error("删除失败:", error);
  process.exit(1);
}
