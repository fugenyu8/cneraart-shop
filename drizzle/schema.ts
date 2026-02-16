import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * 用户表 - 核心认证和权限管理
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("zh").notNull(), // 用户语言偏好(zh/en/de/fr/es/it/pt/ru/ja/ko/ar/hi/th/vi/id)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 产品分类表
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  parentId: int("parentId"), // 支持子分类
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * 产品表
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("shortDescription"),
  
  // 价格信息
  regularPrice: decimal("regularPrice", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("salePrice", { precision: 10, scale: 2 }),
  costPrice: decimal("costPrice", { precision: 10, scale: 2 }), // 成本价,仅管理员可见
  
  // 库存管理
  sku: varchar("sku", { length: 100 }),
  stock: int("stock").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(10),
  
  // 分类和标签
  categoryId: int("categoryId"),
  tags: text("tags"), // JSON数组存储标签
  
  // 开光信息(特色功能)
  blessingTemple: varchar("blessingTemple", { length: 100 }), // 开光寺庙
  blessingMaster: varchar("blessingMaster", { length: 100 }), // 开光大师
  blessingDate: timestamp("blessingDate"), // 开光日期
  blessingDescription: text("blessingDescription"), // 仪式说明
  
  // SEO
  metaTitle: varchar("metaTitle", { length: 200 }),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  
  // 状态
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  featured: boolean("featured").default(false), // 是否精选产品
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * 产品图片表
 */
export const productImages = mysqlTable("product_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  url: text("url").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3文件键
  altText: varchar("altText", { length: 200 }),
  displayOrder: int("displayOrder").default(0),
  isPrimary: boolean("isPrimary").default(false), // 是否主图
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

/**
 * 购物车表
 */
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  serviceData: json("serviceData"), // 服务产品的额外信息: {imageUrls, questionDescription, bookingDate}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * 收货地址表
 */
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  fullName: varchar("fullName", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  addressLine1: varchar("addressLine1", { length: 200 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 200 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

/**
 * 优惠券表
 */
export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  
  // 折扣类型和值
  discountType: mysqlEnum("discountType", ["percentage", "fixed", "buy_x_get_y"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  
  // 使用条件
  minPurchase: decimal("minPurchase", { precision: 10, scale: 2 }),
  maxDiscount: decimal("maxDiscount", { precision: 10, scale: 2 }), // 最大折扣金额(用于百分比折扣)
  applicableProducts: text("applicableProducts"), // JSON数组,适用产品ID
  applicableCategories: text("applicableCategories"), // JSON数组,适用分类ID
  
  // 使用限制
  usageLimit: int("usageLimit"), // 总使用次数限制
  usageCount: int("usageCount").default(0), // 已使用次数
  perUserLimit: int("perUserLimit"), // 每用户使用次数限制
  
  // 有效期
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  
  // 状态
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;

/**
 * 订单表
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: int("userId").notNull(),
  
  // 订单金额
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // 优惠券
  couponId: int("couponId"),
  couponCode: varchar("couponCode", { length: 50 }),
  
  // 收货信息
  shippingName: varchar("shippingName", { length: 100 }).notNull(),
  shippingPhone: varchar("shippingPhone", { length: 50 }),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
  shippingState: varchar("shippingState", { length: 100 }),
  shippingPostalCode: varchar("shippingPostalCode", { length: 20 }).notNull(),
  shippingCountry: varchar("shippingCountry", { length: 100 }).notNull(),
  
  // 支付信息
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  paymentId: varchar("paymentId", { length: 200 }), // PayPal交易ID
  paidAt: timestamp("paidAt"),
  
  // 物流信息
  shippingCarrier: varchar("shippingCarrier", { length: 100 }),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  shippedAt: timestamp("shippedAt"),
  
  // 订单状态
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  
  // 备注
  customerNote: text("customerNote"),
  adminNote: text("adminNote"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * 订单商品表
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 200 }).notNull(),
  productSku: varchar("productSku", { length: 100 }),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // 购买时的价格
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * 产品评价表
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId"), // 关联订单,确保购买后才能评价
  rating: int("rating").notNull(), // 1-5星
  title: varchar("title", { length: 200 }),
  content: text("content"),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false),
  isApproved: boolean("isApproved").default(false), // 管理员审核
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * 优惠券使用记录表
 */
export const couponUsages = mysqlTable("coupon_usages", {
  id: int("id").autoincrement().primaryKey(),
  couponId: int("couponId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CouponUsage = typeof couponUsages.$inferSelect;
export type InsertCouponUsage = typeof couponUsages.$inferInsert;

// ============= 命理测算系统表 =============

/**
 * 命理测算任务表 - 存储面相、手相、风水分析任务
 */
export const fortuneTasks = mysqlTable("fortune_tasks", {
  id: int("id").autoincrement().primaryKey(),
  taskId: varchar("taskId", { length: 64 }).notNull().unique(),
  orderId: int("orderId").notNull(), // 关联orders表
  userId: int("userId").notNull(), // 关联users表
  serviceType: mysqlEnum("serviceType", ["face", "palm", "fengshui"]).notNull(),
  imageUrl: text("imageUrl"), // 单图服务(面相/手相)
  imagesJson: json("imagesJson"), // 多图服务(风水)
  roomType: varchar("roomType", { length: 32 }), // 风水专用:卧室/客厅/书房/厨房
  status: mysqlEnum("status", ["created", "processing", "completed", "failed"]).default("created").notNull(),
  progress: int("progress").default(0).notNull(),
  featuresJson: json("featuresJson"), // 提取的特征数据
  calculationJson: json("calculationJson"), // 计算结果
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FortuneTask = typeof fortuneTasks.$inferSelect;
export type InsertFortuneTask = typeof fortuneTasks.$inferInsert;

/**
 * 命理测算报告表 - 存储AI生成的解读报告
 */
export const fortuneReports = mysqlTable("fortune_reports", {
  id: int("id").autoincrement().primaryKey(),
  taskId: varchar("taskId", { length: 64 }).notNull().unique(),
  userId: int("userId").notNull(),
  serviceType: mysqlEnum("serviceType", ["face", "palm", "fengshui"]).notNull(),
  overallSummary: text("overallSummary").notNull(), // 总体概述
  sectionsJson: json("sectionsJson").notNull(), // 分段解读
  score: int("score"), // 综合评分(0-100)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FortuneReport = typeof fortuneReports.$inferSelect;
export type InsertFortuneReport = typeof fortuneReports.$inferInsert;

/**
 * 面相规则表 - 基于传统面相学的规则库
 */
export const faceRules = mysqlTable("face_rules", {
  id: int("id").autoincrement().primaryKey(),
  palaceName: varchar("palaceName", { length: 64 }).notNull(), // 十二宫位名称
  featureName: varchar("featureName", { length: 64 }).notNull(), // 特征名称
  conditionOperator: varchar("conditionOperator", { length: 16 }).notNull(), // 条件操作符: >, <, ==, !=
  conditionValue: varchar("conditionValue", { length: 64 }).notNull(), // 条件值
  score: int("score").notNull(), // 评分(-10到+10)
  interpretation: text("interpretation").notNull(), // 解读文本
  category: varchar("category", { length: 32 }).notNull(), // 类别:事业/财运/感情/健康
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FaceRule = typeof faceRules.$inferSelect;
export type InsertFaceRule = typeof faceRules.$inferInsert;

/**
 * 手相规则表 - 基于传统手相学的规则库
 */
export const palmRules = mysqlTable("palm_rules", {
  id: int("id").autoincrement().primaryKey(),
  lineName: varchar("lineName", { length: 64 }), // 掌纹名称:生命线/智慧线/感情线等
  hillName: varchar("hillName", { length: 64 }), // 丘陵名称:金星丘/木星丘等
  featureName: varchar("featureName", { length: 64 }).notNull(), // 特征名称
  conditionOperator: varchar("conditionOperator", { length: 16 }).notNull(),
  conditionValue: varchar("conditionValue", { length: 64 }).notNull(),
  score: int("score").notNull(),
  interpretation: text("interpretation").notNull(),
  category: varchar("category", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PalmRule = typeof palmRules.$inferSelect;
export type InsertPalmRule = typeof palmRules.$inferInsert;

/**
 * 风水规则表 - 基于传统风水学的规则库
 */
export const fengshuiRules = mysqlTable("fengshui_rules", {
  id: int("id").autoincrement().primaryKey(),
  roomType: varchar("roomType", { length: 32 }).notNull(), // 房间类型:bedroom/living_room/study/kitchen
  category: varchar("category", { length: 32 }).notNull(), // 类别:layout/color/decoration/environment
  ruleName: varchar("ruleName", { length: 100 }).notNull(), // 规则名称
  conditionType: varchar("conditionType", { length: 32 }).notNull(), // 条件类型
  conditionValue: varchar("conditionValue", { length: 100 }).notNull(), // 条件值
  score: int("score").notNull(), // 评分
  interpretation: text("interpretation").notNull(), // 解读
  suggestion: text("suggestion"), // 改善建议
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FengshuiRule = typeof fengshuiRules.$inferSelect;
export type InsertFengshuiRule = typeof fengshuiRules.$inferInsert;

// ============= 服务预约系统表 =============

/**
 * 命理服务预约表 - 独立的预约和支付系统
 */
export const fortuneBookings = mysqlTable("fortune_bookings", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(), // 关联orders表
  userId: int("userId").notNull(),
  serviceType: mysqlEnum("serviceType", ["face", "palm", "fengshui"]).notNull(),
  
  // 服务专属信息(订单表中没有的字段)
  bookingDate: timestamp("bookingDate"), // 预约日期(可选)
  questionDescription: text("questionDescription"), // 问题描述
  imageUrls: json("imageUrls"), // 存储上传的图片URL数组
  
  // 服务状态和报告
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  reportUrl: varchar("reportUrl", { length: 500 }), // 生成的报告URL
  reportSentAt: timestamp("reportSentAt"), // 报告发送时间
  completedAt: timestamp("completedAt"),
  
  // 备注
  adminNote: text("adminNote"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FortuneBooking = typeof fortuneBookings.$inferSelect;
export type InsertFortuneBooking = typeof fortuneBookings.$inferInsert;

/**
 * 命理服务评价表 - 独立于产品评价的服务评价系统
 */
export const fortuneServiceReviews = mysqlTable("fortune_service_reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId"), // 关联预约记录
  userId: int("userId").notNull(),
  serviceType: mysqlEnum("serviceType", ["face", "palm", "fengshui"]).notNull(),
  
  // 评价内容
  customerName: varchar("customerName", { length: 100 }).notNull(), // 用于匿名显示
  rating: int("rating").notNull(), // 1-5星
  reviewText: text("reviewText").notNull(),
  
  // 管理
  isFeatured: boolean("isFeatured").default(false), // 是否精选展示
  isApproved: boolean("isApproved").default(false), // 管理员审核
  language: varchar("language", { length: 10 }).default("zh"), // 评价语言
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FortuneServiceReview = typeof fortuneServiceReviews.$inferSelect;
export type InsertFortuneServiceReview = typeof fortuneServiceReviews.$inferInsert;
