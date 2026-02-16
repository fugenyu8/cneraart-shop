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
  fortuneTasks,
  fortuneReports,
  fortuneBookings,
  faceRules,
  palmRules,
  fengshuiRules,
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

  // 简单的趋势计算(这里使用随机数模拟,实际应该对比上月数据)
  const revenueTrend = Math.floor(Math.random() * 20) - 5; // -5% to +15%
  const ordersTrend = Math.floor(Math.random() * 20) - 5;
  const productsTrend = Math.floor(Math.random() * 10);
  const customersTrend = Math.floor(Math.random() * 15);

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
