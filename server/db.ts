import { eq, desc, and, or, gte, lte, like, inArray, sql } from "drizzle-orm";
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
  fortuneTasks,
  fortuneReports,
  fortuneBookings,
  faceRules,
  palmRules,
  fengshuiRules,
  fortuneServiceReviews,
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

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEmailUser(data: { email: string; passwordHash: string; name: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const openId = `email:${data.email}`;
  await db.insert(users).values({
    openId,
    email: data.email,
    name: data.name,
    passwordHash: data.passwordHash,
    loginMethod: "email",
    lastSignedIn: new Date(),
  });
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
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
  blessedOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(products.status, "published")];

  // 如果只显示启蕴信物,排除服务类分类(categoryId=1-7是服务类)
  if (params?.blessedOnly) {
    conditions.push(sql`${products.categoryId} > 7`);
  }

  if (params?.categoryId) {
    // 当查询启蕴守护信物(categoryId=1)时，同时返回其所有子分类的产品
    if (params.categoryId === 1) {
      // 查询所有parentId=1的子分类
      const subCats = await db.select().from(categories).where(eq(categories.parentId, 1));
      const subCatIds = subCats.map(c => c.id);
      const allCatIds = [1, ...subCatIds];
      conditions.push(inArray(products.categoryId, allCatIds));
    } else {
      conditions.push(eq(products.categoryId, params.categoryId));
    }
  }

  if (params?.featured !== undefined) {
    conditions.push(eq(products.featured, params.featured));
  }

  if (params?.search) {
    conditions.push(like(products.name, `%${params.search}%`));
  }

  // 优先展示启蕴信物(categoryId=1),然后按创建时间倒序
  let query = db.select().from(products).where(and(...conditions))
    .orderBy(
      sql`CASE WHEN ${products.categoryId} = 1 THEN 0 ELSE 1 END`,
      desc(products.createdAt)
    ).$dynamic();

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

export async function addToCart(
  userId: number, 
  productId: number, 
  quantity: number = 1,
  serviceData?: any
) {
  const db = await getDb();
  if (!db) return;

  // 检查是否已存在
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    // 更新数量和serviceData
    const updateData: any = { quantity: existing[0].quantity + quantity };
    if (serviceData) {
      updateData.serviceData = serviceData;
    }
    await db
      .update(cartItems)
      .set(updateData)
      .where(eq(cartItems.id, existing[0].id));
  } else {
    // 新增
    await db.insert(cartItems).values({ 
      userId, 
      productId, 
      quantity,
      serviceData: serviceData || null,
    });
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

export async function createAddress(addressData: {
  userId: number;
  fullName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 如果设置为默认地址,先取消其他默认地址
  if (addressData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, addressData.userId));
  }

  const result = await db.insert(addresses).values(addressData);
  return Number((result as any).insertId);
}

export async function updateAddress(
  addressId: number,
  userId: number,
  addressData: {
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
  }
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 如果设置为默认地址,先取消其他默认地址
  if (addressData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));
  }

  await db
    .update(addresses)
    .set(addressData)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
}

export async function deleteAddress(addressId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
}

export async function setDefaultAddress(addressId: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 取消其他默认地址
  await db
    .update(addresses)
    .set({ isDefault: false })
    .where(eq(addresses.userId, userId));

  // 设置新的默认地址
  await db
    .update(addresses)
    .set({ isDefault: true })
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
}

export async function getAddressById(addressId: number, userId: number): Promise<Address | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
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

  // 记录优惠券使用，确保优惠券不会被重复使用
  if (orderData.couponId) {
    // 插入使用记录
    await db.insert(couponUsages).values({
      couponId: orderData.couponId,
      userId: orderData.userId,
      orderId: Number(orderId),
      discountAmount: orderData.discount ? orderData.discount.toString() : '0',
    });
    // 增加优惠券已使用次数
    await db.update(coupons)
      .set({ usageCount: sql`usageCount + 1` })
      .where(eq(coupons.id, orderData.couponId));
  }

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

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function updateOrderTracking(
  orderId: number,
  shippingCarrier: string,
  trackingNumber: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(orders).set({
    shippingCarrier,
    trackingNumber,
    shippedAt: new Date(),
    status: "shipped", // 添加物流信息时自动更新为已发货
  }).where(eq(orders.id, orderId));
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

export async function getProductReviews(productId: number, limit: number = 50): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

export async function getProductReviewsPaginated(productId: number, opts: { limit: number; offset: number; language?: string; rating?: number }): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [eq(reviews.productId, productId), eq(reviews.isApproved, true)];
  if (opts.language) conditions.push(eq(reviews.language, opts.language));
  if (opts.rating) conditions.push(eq(reviews.rating, opts.rating));

  return await db
    .select()
    .from(reviews)
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt))
    .limit(opts.limit)
    .offset(opts.offset);
}

export async function getProductReviewStats(productId: number): Promise<{ total: number; byRating: Record<number, number>; byLanguage: Record<string, number>; avgRating: number }> {
  const db = await getDb();
  if (!db) return { total: 0, byRating: {}, byLanguage: {}, avgRating: 0 };

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`, avg: sql<number>`AVG(rating)` })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));
  const total = Number(countResult?.count ?? 0);
  const avgRating = Number(countResult?.avg ?? 0);

  const ratingRows = await db
    .select({ rating: reviews.rating, count: sql<number>`COUNT(*)` })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .groupBy(reviews.rating);
  const byRating: Record<number, number> = {};
  ratingRows.forEach(r => { byRating[r.rating] = Number(r.count); });

  const langRows = await db
    .select({ language: reviews.language, count: sql<number>`COUNT(*)` })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)))
    .groupBy(reviews.language);
  const byLanguage: Record<string, number> = {};
  langRows.forEach(r => { byLanguage[r.language || 'en'] = Number(r.count); });

  return { total, byRating, byLanguage, avgRating };
}

export async function getProductAverageRating(productId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ avg: sql<number>`AVG(${reviews.rating})` })
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));

  const avgRating = result[0]?.avg;
  return avgRating ? Number(avgRating) : 0;
}

export async function createReview(data: {
  productId: number;
  userId: number;
  userName: string | null;
  rating: number;
  comment: string;
  title?: string;
  isApproved: boolean;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("数据库连接失败");

  const result = await db.insert(reviews).values({
    productId: data.productId,
    userId: data.userId,
    userName: data.userName,
    rating: data.rating,
    comment: data.comment,
    title: data.title || null,
    isApproved: data.isApproved,
    isVerified: true, // 默认验证购买
  });

  return Number((result as any).insertId || 0);
}

export async function getAllReviewsForAdmin(params: {
  productId?: number;
  status?: "pending" | "approved" | "rejected";
  limit?: number;
  offset?: number;
}): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  
  if (params.productId) {
    conditions.push(eq(reviews.productId, params.productId));
  }
  
  if (params.status === "approved") {
    conditions.push(eq(reviews.isApproved, true));
  } else if (params.status === "pending" || params.status === "rejected") {
    conditions.push(eq(reviews.isApproved, false));
  }

  return await db
    .select()
    .from(reviews)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(reviews.createdAt))
    .limit(params.limit || 50)
    .offset(params.offset || 0);
}

export async function approveReview(reviewId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("数据库连接失败");

  await db
    .update(reviews)
    .set({ isApproved: true })
    .where(eq(reviews.id, reviewId));
}

export async function rejectReview(reviewId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("数据库连接失败");

  await db
    .update(reviews)
    .set({ isApproved: false })
    .where(eq(reviews.id, reviewId));
}

export async function deleteReview(reviewId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("数据库连接失败");

  await db
    .delete(reviews)
    .where(eq(reviews.id, reviewId));
}

// ============= 后台管理统计 =============

export async function getAdminStats() {
  const db = await getDb();
  if (!db) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      revenueTrend: 0,
      ordersTrend: 0,
      productsTrend: 0,
      customersTrend: 0,
      recentOrders: [],
      topProducts: [],
    };
  }

  // 获取总销售额(已支付订单)
  const revenueResult = await db
    .select({ total: sql<number>`SUM(CAST(${orders.total} AS DECIMAL(10,2)))` })
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"));
  const totalRevenue = revenueResult[0]?.total || 0;

  // 获取订单总数
  const ordersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders);
  const totalOrders = ordersResult[0]?.count || 0;

  // 获取产品总数
  const productsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(products);
  const totalProducts = productsResult[0]?.count || 0;

  // 获取客户总数
  const customersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users);
  const totalCustomers = customersResult[0]?.count || 0;

  // 获取最近5个订单
  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  // 获取热销产品(根据订单商品统计)
  const topProductsResult = await db
    .select({
      productId: orderItems.productId,
      productName: orderItems.productName,
      salesCount: sql<number>`SUM(${orderItems.quantity})`,
      price: orderItems.price,
    })
    .from(orderItems)
    .groupBy(orderItems.productId, orderItems.productName, orderItems.price)
    .orderBy(desc(sql<number>`SUM(${orderItems.quantity})`))
    .limit(5);

  const topProducts = topProductsResult.map((item) => ({
    id: item.productId,
    name: item.productName,
    salesCount: item.salesCount,
    price: parseFloat(item.price),
  }));

  // 真实趋势计算：对比本月和上月数据
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // 本月营收
  const thisMonthRevenueResult = await db
    .select({ total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL(10,2))), 0)` })
    .from(orders)
    .where(and(gte(orders.createdAt, thisMonthStart), eq(orders.paymentStatus, "paid")));
  const thisMonthRevenue = thisMonthRevenueResult[0]?.total || 0;

  // 上月营收
  const lastMonthRevenueResult = await db
    .select({ total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL(10,2))), 0)` })
    .from(orders)
    .where(and(gte(orders.createdAt, lastMonthStart), lte(orders.createdAt, lastMonthEnd), eq(orders.paymentStatus, "paid")));
  const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

  // 本月订单数
  const thisMonthOrdersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(gte(orders.createdAt, thisMonthStart));
  const thisMonthOrders = thisMonthOrdersResult[0]?.count || 0;

  // 上月订单数
  const lastMonthOrdersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(and(gte(orders.createdAt, lastMonthStart), lte(orders.createdAt, lastMonthEnd)));
  const lastMonthOrders = lastMonthOrdersResult[0]?.count || 0;

  // 本月新客户
  const thisMonthCustomersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(gte(users.createdAt, thisMonthStart));
  const thisMonthCustomers = thisMonthCustomersResult[0]?.count || 0;

  // 上月新客户
  const lastMonthCustomersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(and(gte(users.createdAt, lastMonthStart), lte(users.createdAt, lastMonthEnd)));
  const lastMonthCustomers = lastMonthCustomersResult[0]?.count || 0;

  // 计算趋势百分比
  const calcTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const revenueTrend = calcTrend(thisMonthRevenue, lastMonthRevenue);
  const ordersTrend = calcTrend(thisMonthOrders, lastMonthOrders);
  const productsTrend = 0; // 产品数量不需要趋势
  const customersTrend = calcTrend(thisMonthCustomers, lastMonthCustomers);

  // ====== 命理服务统计 ======
  // 命理预约总数
  const fortuneBookingsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings);
  const totalFortuneBookings = fortuneBookingsResult[0]?.count || 0;

  // 命理预约按状态统计
  const fortunePendingResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(eq(fortuneBookings.status, "pending"));
  const fortunePending = fortunePendingResult[0]?.count || 0;

  const fortuneCompletedResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(eq(fortuneBookings.status, "completed"));
  const fortuneCompleted = fortuneCompletedResult[0]?.count || 0;

  const fortuneInProgressResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(eq(fortuneBookings.status, "in_progress"));
  const fortuneInProgress = fortuneInProgressResult[0]?.count || 0;

  // 命理预约按类型统计
  const fortuneByTypeResult = await db
    .select({
      serviceType: fortuneBookings.serviceType,
      count: sql<number>`COUNT(*)`,
    })
    .from(fortuneBookings)
    .groupBy(fortuneBookings.serviceType);
  const fortuneByType = {
    face: 0,
    palm: 0,
    fengshui: 0,
  };
  fortuneByTypeResult.forEach((r) => {
    if (r.serviceType in fortuneByType) {
      fortuneByType[r.serviceType as keyof typeof fortuneByType] = r.count;
    }
  });

  // 命理服务评价统计
  const fortuneReviewsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneServiceReviews);
  const totalFortuneReviews = fortuneReviewsResult[0]?.count || 0;

  // ====== 待确认线下付款统计 ======
  const pendingOfflineResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(
      and(
        eq(orders.paymentStatus, "pending"),
        or(
          eq(orders.paymentMethod, "bank_transfer"),
          eq(orders.paymentMethod, "alipay")
        )
      )
    );
  const pendingOfflinePayments = pendingOfflineResult[0]?.count || 0;

  // 获取待确认付款的订单列表（最新5条）
  const pendingOfflineOrders = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.paymentStatus, "pending"),
        or(
          eq(orders.paymentMethod, "bank_transfer"),
          eq(orders.paymentMethod, "alipay")
        )
      )
    )
    .orderBy(desc(orders.createdAt))
    .limit(5);

  // ====== 能量报告统计 ======
  let destinyReportStats = { total: 0, todayCount: 0, statusCounts: {} as Record<string, number> };
  try {
    destinyReportStats = await getDestinyReportStats();
  } catch (e) {
    // destiny_reports 表可能不存在
  }

  // ====== 跨系统数据获取 ======
  const adminKey = process.env.ADMIN_STATS_KEY || "cneraart-admin-2024";

  // 客服系统统计
  let serviceStats = null;
  try {
    const serviceRes = await fetch("https://service.cneraart.com/api/admin-stats", {
      headers: { "x-admin-key": adminKey },
    });
    if (serviceRes.ok) {
      serviceStats = await serviceRes.json();
    }
  } catch (e) {
    console.warn("[Dashboard] Failed to fetch service stats:", e);
  }

  // VIP系统统计
  let vipStats = null;
  try {
    const vipRes = await fetch("https://vip.cneraart.com/api/admin-stats", {
      headers: { "x-admin-key": adminKey },
    });
    if (vipRes.ok) {
      vipStats = await vipRes.json();
    }
  } catch (e) {
    console.warn("[Dashboard] Failed to fetch VIP stats:", e);
  }

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    revenueTrend,
    ordersTrend,
    productsTrend,
    customersTrend,
    recentOrders,
    topProducts,
    // 命理服务
    fortuneStats: {
      totalBookings: totalFortuneBookings,
      pending: fortunePending,
      completed: fortuneCompleted,
      inProgress: fortuneInProgress,
      byType: fortuneByType,
      totalReviews: totalFortuneReviews,
    },
    // 能量报告
    destinyStats: destinyReportStats,
    // 待确认线下付款
    pendingOfflinePayments,
    pendingOfflineOrders,
    // 客服系统
    serviceStats,
    // VIP系统
    vipStats,
  };
}

// ============= 管理员产品管理 =============

export async function getAllProductsForAdmin(options?: {
  status?: "draft" | "published" | "archived";
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(products);

  if (options?.status) {
    query = query.where(eq(products.status, options.status)) as any;
  }

  query = query.orderBy(desc(products.createdAt)) as any;

  if (options?.limit) {
    query = query.limit(options.limit) as any;
  }

  if (options?.offset) {
    query = query.offset(options.offset) as any;
  }

  return await query;
}

export async function createProduct(productData: {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  regularPrice: number;
  salePrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold?: number;
  categoryId?: number;
  status: "draft" | "published" | "archived";
  featured?: boolean;
  blessingTemple?: string;
  blessingMaster?: string;
  blessingDate?: Date;
  blessingDescription?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(products).values({
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    shortDescription: productData.shortDescription,
    regularPrice: productData.regularPrice.toString(),
    salePrice: productData.salePrice?.toString(),
    sku: productData.sku,
    stock: productData.stock,
    lowStockThreshold: productData.lowStockThreshold,
    categoryId: productData.categoryId,
    status: productData.status,
    featured: productData.featured || false,
    blessingTemple: productData.blessingTemple,
    blessingMaster: productData.blessingMaster,
    blessingDate: productData.blessingDate,
    blessingDescription: productData.blessingDescription,
  });

  return Number(result.insertId);
}

export async function createProductImages(images: Array<{
  productId: number;
  url: string;
  fileKey: string;
  isPrimary: boolean;
  displayOrder: number;
}>): Promise<void> {
  const db = await getDb();
  if (!db) return;

  for (const image of images) {
    await db.insert(productImages).values({
      productId: image.productId,
      url: image.url,
      fileKey: image.fileKey,
      isPrimary: image.isPrimary,
      displayOrder: image.displayOrder,
    });
  }
}

export async function updateProduct(
  productId: number,
  productData: Partial<{
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    regularPrice: number;
    salePrice: number;
    sku: string;
    stock: number;
    lowStockThreshold: number;
    categoryId: number;
    status: "draft" | "published" | "archived";
    featured: boolean;
    blessingTemple: string;
    blessingMaster: string;
    blessingDate: Date;
    blessingDescription: string;
  }>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // 转换price为字符串
  const updateData: any = { ...productData };
  if (updateData.regularPrice !== undefined) {
    updateData.regularPrice = updateData.regularPrice.toString();
  }
  if (updateData.salePrice !== undefined) {
    updateData.salePrice = updateData.salePrice.toString();
  }

  await db
    .update(products)
    .set(updateData)
    .where(eq(products.id, productId));
}

export async function deleteProduct(productId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(products).where(eq(products.id, productId));
}

export async function deleteProductImages(productId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.delete(productImages).where(eq(productImages.productId, productId));
}

// ============= 管理员订单管理 =============

export async function getAllOrdersForAdmin(options?: {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  limit?: number;
  offset?: number;
}): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(orders);

  if (options?.status) {
    query = query.where(eq(orders.status, options.status)) as any;
  }

  query = query.orderBy(desc(orders.createdAt)) as any;

  if (options?.limit) {
    query = query.limit(options.limit) as any;
  }

  if (options?.offset) {
    query = query.offset(options.offset) as any;
  }

  return await query;
}


// ============= 命理测算系统数据库操作 =============

/**
 * 获取面相规则
 */
export async function getFaceRules(palaceName?: string, category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(faceRules);
  
  // 可选的筛选条件
  if (palaceName) {
    query = query.where(eq(faceRules.palaceName, palaceName)) as any;
  }
  if (category) {
    query = query.where(eq(faceRules.category, category)) as any;
  }
  
  return await query;
}

/**
 * 获取手相规则
 */
export async function getPalmRules(lineName?: string, category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(palmRules);
  
  if (lineName) {
    query = query.where(eq(palmRules.lineName, lineName)) as any;
  }
  if (category) {
    query = query.where(eq(palmRules.category, category)) as any;
  }
  
  return await query;
}

/**
 * 获取风水规则
 */
export async function getFengshuiRules(roomType?: string, category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(fengshuiRules);
  
  if (roomType) {
    query = query.where(eq(fengshuiRules.roomType, roomType)) as any;
  }
  if (category) {
    query = query.where(eq(fengshuiRules.category, category)) as any;
  }
  
  return await query;
}

/**
 * 创建命理测算任务
 */
export async function createFortuneTask(data: {
  taskId: string;
  orderId: number;
  userId: number;
  serviceType: "face" | "palm" | "fengshui";
  roomType?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(fortuneTasks).values({
    taskId: data.taskId,
    orderId: data.orderId,
    userId: data.userId,
    serviceType: data.serviceType,
    roomType: data.roomType,
    status: "created",
    progress: 0,
  });
}

/**
 * 获取命理测算任务
 */
export async function getFortuneTask(taskId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [task] = await db.select().from(fortuneTasks).where(eq(fortuneTasks.taskId, taskId));
  return task || null;
}

/**
 * 更新命理测算任务状态
 */
export async function updateFortuneTaskStatus(taskId: string, data: {
  status?: "created" | "processing" | "completed" | "failed";
  progress?: number;
  imageUrl?: string;
  imagesJson?: any;
  featuresJson?: any;
  calculationJson?: any;
  errorMessage?: string;
}) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(fortuneTasks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(fortuneTasks.taskId, taskId));
}

/**
 * 创建命理测算报告
 */
export async function createFortuneReport(data: {
  taskId: string;
  userId: number;
  serviceType: "face" | "palm" | "fengshui";
  overallSummary: string;
  sectionsJson: any;
  score?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(fortuneReports).values(data);
}

/**
 * 获取命理测算报告
 */
export async function getFortuneReport(taskId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const [report] = await db.select().from(fortuneReports).where(eq(fortuneReports.taskId, taskId));
  return report || null;
}


// ============= 服务订单管理 =============

/**
 * 获取所有服务类订单
 * 服务类产品的categoryId为特定值(需要从数据库查询"命理服务"分类)
 */
export async function getServiceOrders(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    // 首先获取"命理服务"分类ID
    const serviceCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "fortune-services"))
      .limit(1);

    if (serviceCategory.length === 0) return [];

    const categoryId = serviceCategory[0].id;

    // 查询包含服务类产品的订单
    let query = db
      .select({
        order: orders,
        user: users,
        items: orderItems,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(products.categoryId, categoryId));

  // 注意: 此处的status过滤需要在query构建时添加
  // 由于Drizzle ORM的限制,暂时移除过滤逻辑

    const results = await query
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);

    return results;
  } catch (error) {
    console.error("[DB] Error fetching service orders:", error);
    return [];
  }
}

/**
 * 获取服务订单详情(包含fortune_bookings信息)
 */
export async function getServiceOrderDetail(orderId: number): Promise<any | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) return null;

    // 获取订单项
    const items = await db
      .select({
        orderItem: orderItems,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    // 获取用户信息
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);

    // 获取fortune_bookings信息(如果存在)
    const [booking] = await db
      .select()
      .from(fortuneBookings)
      .where(eq(fortuneBookings.orderId, orderId))
      .limit(1);

    return {
      order,
      items,
      user,
      booking,
    };
  } catch (error) {
    console.error("[DB] Error fetching service order detail:", error);
    return null;
  }
}

/**
 * 更新服务订单报告
 */
export async function updateServiceReport(
  orderId: number,
  reportUrl: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // 更新fortune_bookings表
    await db
      .update(fortuneBookings)
      .set({
        reportUrl,
        reportSentAt: new Date(),
      })
      .where(eq(fortuneBookings.orderId, orderId));

    // 更新订单状态为已交付
    await db
      .update(orders)
      .set({ status: "delivered" })
      .where(eq(orders.id, orderId));

    return true;
  } catch (error) {
    console.error("[DB] Error updating service report:", error);
    return false;
  }
}

/**
 * 创建服务预约记录
 */
export async function createFortuneBooking(data: {
  orderId: number;
  userId: number;
  serviceType: "face" | "palm" | "fengshui";
  questionDescription?: string;
  imageUrls?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(fortuneBookings).values({
    orderId: data.orderId,
    userId: data.userId,
    serviceType: data.serviceType,
    questionDescription: data.questionDescription,
    imageUrls: data.imageUrls,
    status: "pending",
  });

  return result.insertId;
}


/**
 * 获取每日商城统计数据
 */
export async function getDailyShopStats(startOfDay: Date, endOfDay: Date) {
  const db = await getDb();
  if (!db) {
    return { newOrders: 0, revenue: 0, newUsers: 0, paidOrders: 0, pendingOrders: 0, serviceBookings: 0 };
  }

  // 当日新订单数
  const ordersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(and(gte(orders.createdAt, startOfDay), lte(orders.createdAt, endOfDay)));
  const newOrders = ordersResult[0]?.count || 0;

  // 当日营收(已支付)
  const revenueResult = await db
    .select({ total: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL(10,2))), 0)` })
    .from(orders)
    .where(and(
      gte(orders.createdAt, startOfDay),
      lte(orders.createdAt, endOfDay),
      eq(orders.paymentStatus, "paid")
    ));
  const revenue = revenueResult[0]?.total || 0;

  // 当日新注册用户
  const usersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(and(gte(users.createdAt, startOfDay), lte(users.createdAt, endOfDay)));
  const newUsers = usersResult[0]?.count || 0;

  // 当日已支付订单数
  const paidResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(and(
      gte(orders.createdAt, startOfDay),
      lte(orders.createdAt, endOfDay),
      eq(orders.paymentStatus, "paid")
    ));
  const paidOrders = paidResult[0]?.count || 0;

  // 当日待处理订单
  const pendingResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(and(
      gte(orders.createdAt, startOfDay),
      lte(orders.createdAt, endOfDay),
      eq(orders.status, "pending")
    ));
  const pendingOrders = pendingResult[0]?.count || 0;

  // 当日命理服务预约
  const bookingsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(and(gte(fortuneBookings.createdAt, startOfDay), lte(fortuneBookings.createdAt, endOfDay)));
  const serviceBookings = bookingsResult[0]?.count || 0;

  return { newOrders, revenue, newUsers, paidOrders, pendingOrders, serviceBookings };
}

// ============= 管理后台 - 用户管理 =============

export async function getAllUsersForAdmin(options?: {
  search?: string;
  role?: "user" | "admin";
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (options?.role) {
    conditions.push(eq(users.role, options.role));
  }
  if (options?.search) {
    conditions.push(
      or(
        like(users.name, `%${options.search}%`),
        like(users.email, `%${options.search}%`)
      )!
    );
  }

  const query = db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);

  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }
  return query;
}

export async function getUserCount(role?: "user" | "admin") {
  const db = await getDb();
  if (!db) return 0;

  const conditions = [];
  if (role) {
    conditions.push(eq(users.role, role));
  }

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return result[0]?.count || 0;
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

// ============= 管理后台 - 优惠券管理 =============

export async function getAllCouponsForAdmin(options?: {
  isActive?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (options?.isActive !== undefined) {
    conditions.push(eq(coupons.isActive, options.isActive));
  }

  const query = db
    .select()
    .from(coupons)
    .orderBy(desc(coupons.createdAt))
    .limit(options?.limit || 50)
    .offset(options?.offset || 0);

  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }
  return query;
}

export async function getCouponCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(coupons);
  return result[0]?.count || 0;
}

export async function createCoupon(data: {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed" | "buy_x_get_y";
  discountValue: string;
  minPurchase?: string;
  maxDiscount?: string;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(coupons).values({
    code: data.code,
    description: data.description,
    discountType: data.discountType,
    discountValue: data.discountValue,
    minPurchase: data.minPurchase,
    maxDiscount: data.maxDiscount,
    usageLimit: data.usageLimit,
    perUserLimit: data.perUserLimit,
    startDate: data.startDate,
    endDate: data.endDate,
    isActive: true,
  });
}

export async function updateCoupon(couponId: number, data: {
  description?: string;
  discountValue?: string;
  minPurchase?: string;
  maxDiscount?: string;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.update(coupons).set(data).where(eq(coupons.id, couponId));
}

export async function toggleCouponActive(couponId: number, isActive: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(coupons).set({ isActive }).where(eq(coupons.id, couponId));
}

export async function getCouponUsages(couponId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: couponUsages.id,
      userId: couponUsages.userId,
      orderId: couponUsages.orderId,
      discountAmount: couponUsages.discountAmount,
      createdAt: couponUsages.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(couponUsages)
    .leftJoin(users, eq(couponUsages.userId, users.id))
    .where(eq(couponUsages.couponId, couponId))
    .orderBy(desc(couponUsages.createdAt));
}

// ============= 管理后台 - 能量报告管理 =============

export async function getDestinyReportsForAdmin(options?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  // destiny_reports 表在同一个数据库中，直接用原生SQL查询
  const mysql2 = await import('mysql2/promise');
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
  try {
    let query = 'SELECT id, userId, email, name, birthDate, birthTime, birthLocation, status, segment1Status, segment1RetryCount, segment2Status, segment2RetryCount, segment3Status, segment3RetryCount, segment4Status, segment4RetryCount, segment5Status, segment5RetryCount, integrityCheckPassed, reportContentPath, deliveredAt, followUpEmailSentAt, createdAt, updatedAt FROM destiny_reports';
    const params: any[] = [];
    const conditions: string[] = [];

    if (options?.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }
    if (options?.search) {
      conditions.push('(email LIKE ? OR name LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY createdAt DESC';
    query += ` LIMIT ${options?.limit || 50} OFFSET ${options?.offset || 0}`;

    const [rows] = await conn.query(query, params);
    return rows;
  } finally {
    await conn.end();
  }
}

export async function getDestinyReportCount(status?: string) {
  const mysql2 = await import('mysql2/promise');
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
  try {
    let query = 'SELECT COUNT(*) as cnt FROM destiny_reports';
    const params: any[] = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    const [rows] = await conn.query(query, params) as any;
    return rows[0]?.cnt || 0;
  } finally {
    await conn.end();
  }
}

export async function getDestinyReportStats() {
  const mysql2 = await import('mysql2/promise');
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
  try {
    const [statusRows] = await conn.query('SELECT status, COUNT(*) as cnt FROM destiny_reports GROUP BY status') as any;
    const statusCounts: Record<string, number> = {};
    statusRows.forEach((r: any) => { statusCounts[r.status] = r.cnt; });

    const [totalRows] = await conn.query('SELECT COUNT(*) as cnt FROM destiny_reports') as any;
    const total = totalRows[0]?.cnt || 0;

    // 今日新增
    const today = new Date().toISOString().split('T')[0];
    const [todayRows] = await conn.query('SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(createdAt) = ?', [today]) as any;
    const todayCount = todayRows[0]?.cnt || 0;

    return { total, todayCount, statusCounts };
  } finally {
    await conn.end();
  }
}

export async function getDestinyReportDetail(reportId: number) {
  const mysql2 = await import('mysql2/promise');
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
  try {
    const [rows] = await conn.query('SELECT * FROM destiny_reports WHERE id = ?', [reportId]) as any;
    return rows[0] || null;
  } finally {
    await conn.end();
  }
}

// ============= 增强统计 - 跨系统每日数据 =============

export async function getDailyReviewStats(startOfDay: Date, endOfDay: Date) {
  const db = await getDb();
  if (!db) return { newReviews: 0, pendingReviews: 0, approvedReviews: 0 };

  const newResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(reviews)
    .where(and(gte(reviews.createdAt, startOfDay), lte(reviews.createdAt, endOfDay)));
  const newReviews = newResult[0]?.count || 0;

  const pendingResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(reviews)
    .where(eq(reviews.isApproved, false));
  const pendingReviews = pendingResult[0]?.count || 0;

  const approvedResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(reviews)
    .where(and(gte(reviews.createdAt, startOfDay), lte(reviews.createdAt, endOfDay), eq(reviews.isApproved, true)));
  const approvedReviews = approvedResult[0]?.count || 0;

  return { newReviews, pendingReviews, approvedReviews };
}

export async function getDailyCouponStats(startOfDay: Date, endOfDay: Date) {
  const db = await getDb();
  if (!db) return { usedToday: 0, activeCoupons: 0, totalDiscount: 0 };

  const usedResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(couponUsages)
    .where(and(gte(couponUsages.createdAt, startOfDay), lte(couponUsages.createdAt, endOfDay)));
  const usedToday = usedResult[0]?.count || 0;

  const activeResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(coupons)
    .where(eq(coupons.isActive, true));
  const activeCoupons = activeResult[0]?.count || 0;

  const discountResult = await db
    .select({ total: sql<number>`COALESCE(SUM(CAST(${couponUsages.discountAmount} AS DECIMAL(10,2))), 0)` })
    .from(couponUsages)
    .where(and(gte(couponUsages.createdAt, startOfDay), lte(couponUsages.createdAt, endOfDay)));
  const totalDiscount = discountResult[0]?.total || 0;

  return { usedToday, activeCoupons, totalDiscount };
}

export async function getDailyDestinyReportStats(startOfDay: Date, endOfDay: Date) {
  // destiny_reports 表直接用原生SQL查询
  const mysql2 = await import('mysql2/promise');
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
  try {
    const dateStr = startOfDay.toISOString().split('T')[0];

    const [newRows] = await conn.query(
      'SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(createdAt) = ?', [dateStr]
    ) as any;
    const newReports = newRows[0]?.cnt || 0;

    const [completedRows] = await conn.query(
      'SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(updatedAt) = ? AND status = ?', [dateStr, 'completed']
    ) as any;
    const completedReports = completedRows[0]?.cnt || 0;

    const [failedRows] = await conn.query(
      'SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(updatedAt) = ? AND status = ?', [dateStr, 'failed']
    ) as any;
    const failedReports = failedRows[0]?.cnt || 0;

    const [processingRows] = await conn.query(
      'SELECT COUNT(*) as cnt FROM destiny_reports WHERE status = ?', ['processing']
    ) as any;
    const processingReports = processingRows[0]?.cnt || 0;

    const [totalRows] = await conn.query('SELECT COUNT(*) as cnt FROM destiny_reports') as any;
    const totalReports = totalRows[0]?.cnt || 0;

    return { newReports, completedReports, failedReports, processingReports, totalReports };
  } finally {
    await conn.end();
  }
}

export async function getWeeklyDestinyReportTrend() {
  const mysql2 = await import('mysql2/promise');
  const conn = await mysql2.createConnection(process.env.DATABASE_URL!);
  try {
    const days: Array<{ date: string; newReports: number; completedReports: number; failedReports: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const [newRows] = await conn.query(
        'SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(createdAt) = ?', [dateStr]
      ) as any;
      const [completedRows] = await conn.query(
        'SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(updatedAt) = ? AND status = ?', [dateStr, 'completed']
      ) as any;
      const [failedRows] = await conn.query(
        'SELECT COUNT(*) as cnt FROM destiny_reports WHERE DATE(updatedAt) = ? AND status = ?', [dateStr, 'failed']
      ) as any;

      days.push({
        date: dateStr,
        newReports: newRows[0]?.cnt || 0,
        completedReports: completedRows[0]?.cnt || 0,
        failedReports: failedRows[0]?.cnt || 0,
      });
    }
    return days;
  } finally {
    await conn.end();
  }
}

// ============= 命理服务每日统计 =============

export async function getDailyFortuneStats(startOfDay: Date, endOfDay: Date) {
  const db = await getDb();
  if (!db) {
    return {
      newBookings: 0,
      completedBookings: 0,
      inProgressBookings: 0,
      cancelledBookings: 0,
      byType: { face: 0, palm: 0, fengshui: 0 },
      totalPendingAll: 0,
      totalInProgressAll: 0,
      newReviews: 0,
    };
  }

  // 当日新预约
  const newResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(and(gte(fortuneBookings.createdAt, startOfDay), lte(fortuneBookings.createdAt, endOfDay)));
  const newBookings = newResult[0]?.count || 0;

  // 当日完成
  const completedResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(and(
      gte(fortuneBookings.updatedAt, startOfDay),
      lte(fortuneBookings.updatedAt, endOfDay),
      eq(fortuneBookings.status, "completed")
    ));
  const completedBookings = completedResult[0]?.count || 0;

  // 当日进行中
  const inProgressResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(and(
      gte(fortuneBookings.updatedAt, startOfDay),
      lte(fortuneBookings.updatedAt, endOfDay),
      eq(fortuneBookings.status, "in_progress")
    ));
  const inProgressBookings = inProgressResult[0]?.count || 0;

  // 当日取消
  const cancelledResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(and(
      gte(fortuneBookings.updatedAt, startOfDay),
      lte(fortuneBookings.updatedAt, endOfDay),
      eq(fortuneBookings.status, "cancelled")
    ));
  const cancelledBookings = cancelledResult[0]?.count || 0;

  // 当日按类型统计
  const byTypeResult = await db
    .select({
      serviceType: fortuneBookings.serviceType,
      count: sql<number>`COUNT(*)`,
    })
    .from(fortuneBookings)
    .where(and(gte(fortuneBookings.createdAt, startOfDay), lte(fortuneBookings.createdAt, endOfDay)))
    .groupBy(fortuneBookings.serviceType);
  const byType = { face: 0, palm: 0, fengshui: 0 };
  byTypeResult.forEach((r) => {
    if (r.serviceType in byType) {
      byType[r.serviceType as keyof typeof byType] = r.count;
    }
  });

  // 全局待处理
  const totalPendingResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(eq(fortuneBookings.status, "pending"));
  const totalPendingAll = totalPendingResult[0]?.count || 0;

  // 全局进行中
  const totalInProgressResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneBookings)
    .where(eq(fortuneBookings.status, "in_progress"));
  const totalInProgressAll = totalInProgressResult[0]?.count || 0;

  // 当日新服务评价
  const reviewResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(fortuneServiceReviews)
    .where(and(gte(fortuneServiceReviews.createdAt, startOfDay), lte(fortuneServiceReviews.createdAt, endOfDay)));
  const newReviews = reviewResult[0]?.count || 0;

  return {
    newBookings,
    completedBookings,
    inProgressBookings,
    cancelledBookings,
    byType,
    totalPendingAll,
    totalInProgressAll,
    newReviews,
  };
}

// 命理服务7天趋势
export async function getWeeklyFortuneTrend() {
  const days: Array<{ date: string; newBookings: number; completedBookings: number; face: number; palm: number; fengshui: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const startOfDay = new Date(dateStr + 'T00:00:00Z');
    const endOfDay = new Date(dateStr + 'T23:59:59Z');
    const stats = await getDailyFortuneStats(startOfDay, endOfDay);
    days.push({
      date: dateStr,
      newBookings: stats.newBookings,
      completedBookings: stats.completedBookings,
      face: stats.byType.face,
      palm: stats.byType.palm,
      fengshui: stats.byType.fengshui,
    });
  }
  return days;
}


// ============= 线下支付管理 =============

export async function getOrdersByPaymentStatus(
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  page: number = 1,
  pageSize: number = 20
) {
  const db = await getDb();
  if (!db) return { orders: [], total: 0 };

  const offset = (page - 1) * pageSize;

  const [orderList, countResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(eq(orders.paymentStatus, paymentStatus))
      .orderBy(desc(orders.createdAt))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.paymentStatus, paymentStatus)),
  ]);

  return {
    orders: orderList,
    total: countResult[0]?.count ?? 0,
  };
}

// ============= 付款凭证 =============
export async function updateOrderPaymentProof(
  orderId: number,
  userId: number,
  proofUrl: string,
  proofFileKey: string
) {
  const db = await getDb();
  if (!db) return false;
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order[0] || order[0].userId !== userId) return false;
  await db.update(orders).set({
    directPayProof: proofUrl,
    directPayNote: proofFileKey,
  }).where(eq(orders.id, orderId));
  return true;
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return null;
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order[0]) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
  const user = await db.select().from(users).where(eq(users.id, order[0].userId)).limit(1);
  return { order: order[0], items, user: user[0] || null };
}

// ============= 密码重置 =============
export async function updateUserPasswordHash(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) return false;
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
  return true;
}

// ============= 社交证明统计 =============
export async function getDeliveredOrderCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(orders)
    .where(eq(orders.status, "delivered"));
  return result[0]?.count || 0;
}

export async function getTotalReviewCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(reviews)
    .where(eq(reviews.isApproved, true));
  return result[0]?.count || 0;
}
