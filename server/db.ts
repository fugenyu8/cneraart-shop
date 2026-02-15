import { eq, desc, and, gte, lte, like, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  productImages,
  cartItems,
  addresses,
  coupons,
  orders,
  orderItems,
  reviews,
  couponUsages,
  type Category,
  type Product,
  type ProductImage,
  type CartItem,
  type Address,
  type Coupon,
  type Order,
  type OrderItem,
  type Review,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= 用户管理 =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= 分类管理 =============

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(categories).orderBy(categories.displayOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============= 产品管理 =============

export async function getPublishedProducts(params?: {
  categoryId?: number;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(products.status, "published")];

  if (params?.categoryId) {
    conditions.push(eq(products.categoryId, params.categoryId));
  }

  if (params?.featured !== undefined) {
    conditions.push(eq(products.featured, params.featured));
  }

  if (params?.search) {
    conditions.push(like(products.name, `%${params.search}%`));
  }

  let query = db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt)).$dynamic();

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.offset(params.offset);
  }

  return await query;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "published")))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductImages(productId: number): Promise<ProductImage[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.displayOrder);
}

// ============= 购物车管理 =============

export async function getCartItems(userId: number): Promise<CartItem[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number = 1) {
  const db = await getDb();
  if (!db) return;

  // 检查是否已存在
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    // 更新数量
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    // 新增
    await db.insert(cartItems).values({ userId, productId, quantity });
  }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const db = await getDb();
  if (!db) return;

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId));
  }
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) return;

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// ============= 地址管理 =============

export async function getUserAddresses(userId: number): Promise<Address[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function getDefaultAddress(userId: number): Promise<Address | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= 优惠券管理 =============

export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.isActive, true)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function validateCoupon(
  code: string,
  userId: number,
  cartTotal: number
): Promise<{ valid: boolean; error?: string; discount?: number }> {
  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, error: "优惠券不存在或已失效" };
  }

  // 检查有效期
  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return { valid: false, error: "优惠券尚未生效" };
  }
  if (coupon.endDate && now > coupon.endDate) {
    return { valid: false, error: "优惠券已过期" };
  }

  // 检查使用次数限制
  if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
    return { valid: false, error: "优惠券已达使用上限" };
  }

  // 检查最低消费
  if (coupon.minPurchase && cartTotal < parseFloat(coupon.minPurchase)) {
    return { valid: false, error: `最低消费金额为 $${coupon.minPurchase}` };
  }

  // 检查每用户使用次数
  if (coupon.perUserLimit) {
    const db = await getDb();
    if (db) {
      const usageCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(couponUsages)
        .where(and(eq(couponUsages.couponId, coupon.id), eq(couponUsages.userId, userId)));

      if (usageCount[0]?.count >= coupon.perUserLimit) {
        return { valid: false, error: "您已达到该优惠券的使用上限" };
      }
    }
  }

  // 计算折扣
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = cartTotal * (parseFloat(coupon.discountValue) / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, parseFloat(coupon.maxDiscount));
    }
  } else if (coupon.discountType === "fixed") {
    discount = parseFloat(coupon.discountValue);
  }

  return { valid: true, discount };
}

// ============= 订单管理 =============

export async function createOrder(orderData: {
  userId: number;
  orderNumber: string;
  items: Array<{ productId: number; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponId?: number;
  couponCode?: string;
  shippingAddress: {
    name: string;
    phone?: string;
    addressLine1: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  customerNote?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 创建订单
  const [order] = await db.insert(orders).values({
    userId: orderData.userId,
    orderNumber: orderData.orderNumber,
    subtotal: orderData.subtotal.toString(),
    discount: orderData.discount.toString(),
    shipping: orderData.shipping.toString(),
    tax: orderData.tax.toString(),
    total: orderData.total.toString(),
    couponId: orderData.couponId,
    couponCode: orderData.couponCode,
    shippingName: orderData.shippingAddress.name,
    shippingPhone: orderData.shippingAddress.phone,
    shippingAddress: orderData.shippingAddress.addressLine1,
    shippingCity: orderData.shippingAddress.city,
    shippingState: orderData.shippingAddress.state,
    shippingPostalCode: orderData.shippingAddress.postalCode,
    shippingCountry: orderData.shippingAddress.country,
    paymentMethod: orderData.paymentMethod,
    customerNote: orderData.customerNote,
  });

  const orderId = order.insertId;

  // 创建订单商品
  for (const item of orderData.items) {
    const product = await getProductById(item.productId);
    if (product) {
      await db.insert(orderItems).values({
        orderId: Number(orderId),
        productId: item.productId,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        price: item.price.toString(),
        subtotal: (item.price * item.quantity).toString(),
      });
    }
  }

  return orderId;
}

export async function getUserOrders(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(orderId: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrderPaymentStatus(
  orderId: number,
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  paymentId?: string
) {
  const db = await getDb();
  if (!db) return;

  const updateData: any = { paymentStatus };
  if (paymentId) {
    updateData.paymentId = paymentId;
  }
  if (paymentStatus === "paid") {
    updateData.paidAt = new Date();
    updateData.status = "processing";
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
}

// ============= 产品评价 =============

export async function getProductReviews(productId: number): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt));
}

export async function getProductAverageRating(productId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ avg: sql<number>`AVG(${reviews.rating})` })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));

  return result[0]?.avg || 0;
}
