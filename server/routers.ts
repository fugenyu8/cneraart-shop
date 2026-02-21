import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { sql } from "drizzle-orm";

// 管理员权限中间件
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "需要管理员权限" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  // TEMP: Debug endpoint to check legacy tables
  debug: router({
    checkLegacy: publicProcedure.query(async () => {
      const database = await db.getDb();
      if (!database) return { error: 'no db' };
      try {
        const tables = await database.execute(sql`SHOW TABLES LIKE '%product%'`);
        let legacyCount = null;
        let legacyCats = null;
        try {
          legacyCount = await database.execute(sql`SELECT COUNT(*) as cnt FROM products_legacy`);
          legacyCats = await database.execute(sql`SELECT categoryId, COUNT(*) as cnt FROM products_legacy GROUP BY categoryId ORDER BY categoryId`);
        } catch(e) { legacyCount = 'table not found'; }
        const currentCount = await database.execute(sql`SELECT COUNT(*) as cnt FROM products`);
        const currentCats = await database.execute(sql`SELECT categoryId, COUNT(*) as cnt FROM products GROUP BY categoryId ORDER BY categoryId`);
        const allCats = await database.execute(sql`SELECT id, name, slug, parentId FROM categories ORDER BY id`);
        return { tables, legacyCount, legacyCats, currentCount, currentCats, allCats };
      } catch(e: any) {
        return { error: e.message };
      }
    }),
  }),
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============= 产品相关 =============
  products: router({
    // 获取产品列表(公开)
    list: publicProcedure
      .input(
        z.object({
          categoryId: z.number().optional(),
          search: z.string().optional(),
          featured: z.boolean().optional(),
          blessedOnly: z.boolean().optional(), // 只显示开光法物
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        const products = await db.getPublishedProducts(input);
        
        // 获取每个产品的图片
        const productsWithImages = await Promise.all(
          products.map(async (product) => {
            const images = await db.getProductImages(product.id);
            return { ...product, images };
          })
        );
        
        return productsWithImages;
      }),

    // 获取产品详情(公开)
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        if (!product) {
          throw new TRPCError({ code: "NOT_FOUND", message: "产品不存在" });
        }

        const images = await db.getProductImages(product.id);
        const reviews = await db.getProductReviews(product.id);
        const averageRating = await db.getProductAverageRating(product.id);

        return { ...product, images, reviews, averageRating };
      }),

    // 获取精选产品(公开)
    featured: publicProcedure.query(async () => {
      const products = await db.getPublishedProducts({ featured: true, limit: 6 });
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const images = await db.getProductImages(product.id);
          return { ...product, images };
        })
      );
      return productsWithImages;
    }),

    // 提交评价(需要登录)
    submitReview: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          rating: z.number().min(1).max(5),
          comment: z.string().min(20).max(500),
          title: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const reviewId = await db.createReview({
          productId: input.productId,
          userId: ctx.user.id,
          userName: ctx.user.name,
          rating: input.rating,
          comment: input.comment,
          title: input.title,
          isApproved: false, // 默认未审核
        });
        
        return { success: true, reviewId };
      }),
    
    // 根据生日推荐守护吊坠(公开)
    getGuardianRecommendations: publicProcedure
      .input(z.object({ birthdate: z.string() })) // YYYY-MM-DD格式
      .query(async ({ input }) => {
        const date = new Date(input.birthdate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 0-11 -> 1-12
        const day = date.getDate();

        // 计算生肖(简化版:按公历年份计算,实际应该按农历)
        const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        const zodiacIndex = (year - 4) % 12; // 1900年是鼠年
        const zodiacSign = zodiacAnimals[zodiacIndex];

        // 计算星座
        const constellations = [
          { name: 'Aries', zhName: '白羊座', start: [3, 21], end: [4, 19] },
          { name: 'Taurus', zhName: '金牛座', start: [4, 20], end: [5, 20] },
          { name: 'Gemini', zhName: '双子座', start: [5, 21], end: [6, 21] },
          { name: 'Cancer', zhName: '巨蟹座', start: [6, 22], end: [7, 22] },
          { name: 'Leo', zhName: '狮子座', start: [7, 23], end: [8, 22] },
          { name: 'Virgo', zhName: '处女座', start: [8, 23], end: [9, 22] },
          { name: 'Libra', zhName: '天秤座', start: [9, 23], end: [10, 23] },
          { name: 'Scorpio', zhName: '天蝎座', start: [10, 24], end: [11, 22] },
          { name: 'Sagittarius', zhName: '射手座', start: [11, 23], end: [12, 21] },
          { name: 'Capricorn', zhName: '摩羯座', start: [12, 22], end: [1, 19] },
          { name: 'Aquarius', zhName: '水瓶座', start: [1, 20], end: [2, 18] },
          { name: 'Pisces', zhName: '双鱼座', start: [2, 19], end: [3, 20] },
        ];

        let constellationSign = '';
        for (const c of constellations) {
          const [startMonth, startDay] = c.start;
          const [endMonth, endDay] = c.end;
          
          if (startMonth === endMonth) {
            if (month === startMonth && day >= startDay && day <= endDay) {
              constellationSign = c.name;
              break;
            }
          } else {
            if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
              constellationSign = c.name;
              break;
            }
          }
        }

        // 查询对应的生肖商品
        const zodiacProducts = await db.getPublishedProducts({ search: zodiacSign, limit: 3 });
        const zodiacWithImages = await Promise.all(
          zodiacProducts.map(async (product) => {
            const images = await db.getProductImages(product.id);
            return { ...product, images };
          })
        );

        // 查询对应的星座商品
        const constellationProducts = await db.getPublishedProducts({ search: constellationSign, limit: 3 });
        const constellationWithImages = await Promise.all(
          constellationProducts.map(async (product) => {
            const images = await db.getProductImages(product.id);
            return { ...product, images };
          })
        );

        return {
          zodiacSign,
          constellationSign,
          zodiac: zodiacWithImages,
          constellation: constellationWithImages,
        };
      }),
  }),

  // ============= 分类相关 =============
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const category = await db.getCategoryBySlug(input.slug);
        if (!category) {
          throw new TRPCError({ code: "NOT_FOUND", message: "分类不存在" });
        }
        return category;
      }),
  }),

  // ============= 购物车相关 =============
  cart: router({
    // 获取购物车
    get: protectedProcedure.query(async ({ ctx }) => {
      const items = await db.getCartItems(ctx.user.id);
      
      // 获取产品详情
      const cartWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await db.getProductById(item.productId);
          const images = product ? await db.getProductImages(product.id) : [];
          return { ...item, product, images };
        })
      );
      
      return cartWithDetails;
    }),

    // 添加到购物车
    add: protectedProcedure
      .input(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1).default(1),
          serviceData: z.object({
            imageUrls: z.array(z.string()),
            questionDescription: z.string().optional(),
            serviceType: z.enum(["face", "palm", "fengshui"]),
          }).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.addToCart(ctx.user.id, input.productId, input.quantity, input.serviceData);
        return { success: true };
      }),

    // 更新数量
    updateQuantity: protectedProcedure
      .input(
        z.object({
          cartItemId: z.number(),
          quantity: z.number().min(0),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateCartItemQuantity(input.cartItemId, input.quantity);
        return { success: true };
      }),

    // 删除商品
    remove: protectedProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(async ({ input }) => {
        await db.removeFromCart(input.cartItemId);
        return { success: true };
      }),

    // 清空购物车
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await db.clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============= 优惠券相关 =============
  coupons: router({
    // 验证优惠券
    validate: protectedProcedure
      .input(
        z.object({
          code: z.string(),
          cartTotal: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await db.validateCoupon(input.code, ctx.user.id, input.cartTotal);
      }),
  }),

  // ============= 地址相关 =============
  addresses: router({
    // 获取用户地址列表
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserAddresses(ctx.user.id);
    }),

    // 获取默认地址
    getDefault: protectedProcedure.query(async ({ ctx }) => {
      return await db.getDefaultAddress(ctx.user.id);
    }),

    // 创建地址
    create: protectedProcedure
      .input(
        z.object({
          fullName: z.string(),
          phone: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          city: z.string(),
          state: z.string().optional(),
          postalCode: z.string(),
          country: z.string(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const addressId = await db.createAddress({
          userId: ctx.user.id,
          ...input,
        });
        return { addressId };
      }),

    // 更新地址
    update: protectedProcedure
      .input(
        z.object({
          addressId: z.number(),
          fullName: z.string().optional(),
          phone: z.string().optional(),
          addressLine1: z.string().optional(),
          addressLine2: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          postalCode: z.string().optional(),
          country: z.string().optional(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { addressId, ...addressData } = input;
        await db.updateAddress(addressId, ctx.user.id, addressData);
        return { success: true };
      }),

    // 删除地址
    delete: protectedProcedure
      .input(z.object({ addressId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteAddress(input.addressId, ctx.user.id);
        return { success: true };
      }),

    // 设置默认地址
    setDefault: protectedProcedure
      .input(z.object({ addressId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.setDefaultAddress(input.addressId, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============= 订单相关 =============
  orders: router({
    // 创建订单
    create: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.number(),
            })
          ),
          subtotal: z.number(),
          discount: z.number().default(0),
          shipping: z.number().default(0),
          tax: z.number().default(0),
          total: z.number(),
          couponCode: z.string().optional(),
          shippingAddress: z.object({
            name: z.string(),
            phone: z.string().optional(),
            addressLine1: z.string(),
            city: z.string(),
            state: z.string().optional(),
            postalCode: z.string(),
            country: z.string(),
          }),
          paymentMethod: z.string(),
          customerNote: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // 生成订单号
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // 获取优惠券ID
        let couponId: number | undefined;
        if (input.couponCode) {
          const coupon = await db.getCouponByCode(input.couponCode);
          couponId = coupon?.id;
        }

        const orderId = await db.createOrder({
          userId: ctx.user.id,
          orderNumber,
          items: input.items,
          subtotal: input.subtotal,
          discount: input.discount,
          shipping: input.shipping,
          tax: input.tax,
          total: input.total,
          couponId,
          couponCode: input.couponCode,
          shippingAddress: input.shippingAddress,
          paymentMethod: input.paymentMethod,
          customerNote: input.customerNote,
        });

        // 检测是否包含命理服务产品,自动创建fortune_bookings记录
        try {
          // 获取购物车项以获取serviceData
          const cartItems = await db.getCartItems(ctx.user.id);
          
          for (const item of input.items) {
            const product = await db.getProductById(item.productId);
            // 检查是否为命理服务(根据slug判断)
            if (product && (product.slug.includes('reading') || product.slug.includes('feng-shui'))) {
              // 从购物车中获取serviceData
              const cartItem = cartItems.find(ci => ci.productId === item.productId);
              const serviceData = cartItem?.serviceData as any;
              
              if (serviceData && serviceData.imageUrls && serviceData.serviceType) {
                await db.createFortuneBooking({
                  orderId: Number(orderId),
                  userId: ctx.user.id,
                  serviceType: serviceData.serviceType,
                  questionDescription: serviceData.questionDescription || undefined,
                  imageUrls: serviceData.imageUrls,
                });
              }
            }
          }
        } catch (error) {
          console.error("Failed to create fortune bookings:", error);
        }

        // 清空购物车
        await db.clearCart(ctx.user.id);

        // 发送订单确认邮件
        try {
          const { sendEmail, getOrderConfirmationEmail } = await import("./email");
          const orderItems = await db.getOrderItems(Number(orderId));
          const emailHtml = getOrderConfirmationEmail({
            orderNumber,
            total: input.total.toString(),
            customerName: input.shippingAddress.name,
            items: orderItems.map((item: any) => ({
              productName: item.product?.name || "Product",
              quantity: item.quantity,
              price: item.price,
            })),
          });
          await sendEmail({
            to: ctx.user.email || "",
            subject: `订单确认 - ${orderNumber}`,
            html: emailHtml,
          });
        } catch (error) {
          console.error("Failed to send order confirmation email:", error);
        }

        return { orderId: Number(orderId), orderNumber };
      }),

    // 获取用户订单列表
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserOrders(ctx.user.id);
    }),

    // 获取订单详情
    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "订单不存在" });
        }

        // 验证订单所有权
        if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此订单" });
        }

        const items = await db.getOrderItems(input.orderId);
        return { ...order, items };
      }),

    // 更新支付状态(内部使用)
    updatePaymentStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
          paymentId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.updateOrderPaymentStatus(
          input.orderId,
          input.paymentStatus,
          input.paymentId
        );
        return { success: true };
      }),

    // 获取订单物流跟踪信息
    getTracking: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.orderId);
        
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "订单不存在" });
        }

        // 验证订单所有权
        if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此订单" });
        }

        const { getShipmentTracking } = await import("./shipment");
        const trackingEvents = await getShipmentTracking(input.orderId);
        
        return {
          order: {
            trackingNumber: order.trackingNumber,
            shippingCarrier: order.shippingCarrier,
            shippedAt: order.shippedAt,
            status: order.status,
          },
          events: trackingEvents,
        };
      }),
  }),

  // ============= 管理员功能 =============
  admin: router({
    // 获取统计数据
    getStats: adminProcedure.query(async () => {
      const stats = await db.getAdminStats();
      return stats;
    }),
    // 产品管理
    products: router({
      // 获取所有产品(包括草稿)
      listAll: adminProcedure
        .input(
          z.object({
            status: z.enum(["draft", "published", "archived"]).optional(),
            limit: z.number().min(1).max(100).default(50),
            offset: z.number().min(0).default(0),
          })
        )
        .query(async ({ input }) => {
          const products = await db.getAllProductsForAdmin(input);
          
          // 获取每个产品的图片
          const productsWithImages = await Promise.all(
            products.map(async (product) => {
              const images = await db.getProductImages(product.id);
              return { ...product, images };
            })
          );
          
          return productsWithImages;
        }),

      // 创建产品
      create: adminProcedure
        .input(
          z.object({
            name: z.string(),
            slug: z.string(),
            description: z.string().optional(),
            shortDescription: z.string().optional(),
            regularPrice: z.number(),
            salePrice: z.number().optional(),
            categoryId: z.number().optional(),
            sku: z.string().optional(),
            stock: z.number().default(0),
            lowStockThreshold: z.number().optional(),
            status: z.enum(["draft", "published", "archived"]).default("draft"),
            featured: z.boolean().optional(),
            blessingTemple: z.string().optional(),
            blessingMaster: z.string().optional(),
            blessingDate: z.date().optional(),
            blessingDescription: z.string().optional(),
            images: z.array(
              z.object({
                url: z.string(),
                fileKey: z.string(),
                isPrimary: z.boolean(),
                displayOrder: z.number(),
              })
            ).optional(),
          })
        )
        .mutation(async ({ input }) => {
          // 创建产品
          const productId = await db.createProduct({
            name: input.name,
            slug: input.slug,
            description: input.description,
            shortDescription: input.shortDescription,
            regularPrice: input.regularPrice,
            salePrice: input.salePrice,
            sku: input.sku,
            stock: input.stock,
            lowStockThreshold: input.lowStockThreshold,
            categoryId: input.categoryId,
            status: input.status,
            featured: input.featured,
            blessingTemple: input.blessingTemple,
            blessingMaster: input.blessingMaster,
            blessingDate: input.blessingDate,
            blessingDescription: input.blessingDescription,
          });

          // 创建产品图片
          if (input.images && input.images.length > 0) {
            await db.createProductImages(
              input.images.map((img) => ({
                productId,
                url: img.url,
                fileKey: img.fileKey,
                isPrimary: img.isPrimary,
                displayOrder: img.displayOrder,
              }))
            );
          }

          return { success: true, productId };
        }),

      // 更新产品
      update: adminProcedure
        .input(
          z.object({
            productId: z.number(),
            name: z.string().optional(),
            slug: z.string().optional(),
            description: z.string().optional(),
            shortDescription: z.string().optional(),
            regularPrice: z.number().optional(),
            salePrice: z.number().optional(),
            categoryId: z.number().optional(),
            sku: z.string().optional(),
            stock: z.number().optional(),
            lowStockThreshold: z.number().optional(),
            status: z.enum(["draft", "published", "archived"]).optional(),
            featured: z.boolean().optional(),
            blessingTemple: z.string().optional(),
            blessingMaster: z.string().optional(),
            blessingDate: z.date().optional(),
            blessingDescription: z.string().optional(),
            images: z.array(
              z.object({
                url: z.string(),
                fileKey: z.string(),
                isPrimary: z.boolean(),
                displayOrder: z.number(),
              })
            ).optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { productId, images, ...updateData } = input;

          // 更新产品基本信息
          await db.updateProduct(productId, updateData);

          // 如果提供了图片,先删除旧图片再创建新图片
          if (images) {
            await db.deleteProductImages(productId);
            if (images.length > 0) {
              await db.createProductImages(
                images.map((img) => ({
                  productId,
                  url: img.url,
                  fileKey: img.fileKey,
                  isPrimary: img.isPrimary,
                  displayOrder: img.displayOrder,
                }))
              );
            }
          }

          return { success: true };
        }),

      // 删除产品
      delete: adminProcedure
        .input(
          z.object({
            productId: z.number(),
          })
        )
        .mutation(async ({ input }) => {
          // 先删除产品图片
          await db.deleteProductImages(input.productId);
          // 再删除产品
          await db.deleteProduct(input.productId);
          return { success: true };
        }),
    }),

    // 订单管理
    orders: router({
      // 获取所有订单
      listAll: adminProcedure
        .input(
          z.object({
            status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
            limit: z.number().min(1).max(100).default(50),
            offset: z.number().min(0).default(0),
          })
        )
        .query(async ({ input }) => {
          const orders = await db.getAllOrdersForAdmin(input);
          
          // 获取每个订单的用户和订单项
          const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
              const user = await db.getUserById(order.userId);
              const items = await db.getOrderItems(order.id);
              return { ...order, user, items };
            })
          );
          
          return ordersWithDetails;
        }),

      // 获取订单详情
      getById: adminProcedure
        .input(
          z.object({
            orderId: z.number(),
          })
        )
        .query(async ({ input }) => {
          const order = await db.getOrderById(input.orderId);
          if (!order) {
            throw new TRPCError({ code: "NOT_FOUND", message: "订单不存在" });
          }
          
          const user = await db.getUserById(order.userId);
          const items = await db.getOrderItems(order.id);
          
          // 获取每个订单项的产品信息
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await db.getProductById(item.productId);
              const images = product ? await db.getProductImages(product.id) : [];
              return { ...item, product: product ? { ...product, images } : null };
            })
          );
          
          return { ...order, user, items: itemsWithProducts };
        }),

      // 更新订单状态
      updateStatus: adminProcedure
        .input(
          z.object({
            orderId: z.number(),
            status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
          })
        )
        .mutation(async ({ input }) => {
          await db.updateOrderStatus(input.orderId, input.status);
          
          // 发送邮件通知
          try {
            const order = await db.getOrderById(input.orderId);
            if (!order) return { success: true };
            
            const user = await db.getUserById(order.userId);
            if (!user?.email) return { success: true };
            
            const { sendEmail, getShippingNotificationEmail, getDeliveryNotificationEmail } = await import("./email");
            
            if (input.status === "shipped" && order.shippingCarrier && order.trackingNumber) {
              const emailHtml = getShippingNotificationEmail({
                orderNumber: order.orderNumber,
                customerName: typeof order.shippingAddress === 'string' ? 'Customer' : (order.shippingAddress as any).name,
                shippingCarrier: order.shippingCarrier,
                trackingNumber: order.trackingNumber,
              });
              await sendEmail({
                to: user.email,
                subject: `发货通知 - ${order.orderNumber}`,
                html: emailHtml,
              });
            } else if (input.status === "delivered") {
              const emailHtml = getDeliveryNotificationEmail({
                orderNumber: order.orderNumber,
                customerName: typeof order.shippingAddress === 'string' ? 'Customer' : (order.shippingAddress as any).name,
              });
              await sendEmail({
                to: user.email,
                subject: `送达通知 - ${order.orderNumber}`,
                html: emailHtml,
              });
            }
          } catch (error) {
            console.error("Failed to send status update email:", error);
          }
          
          return { success: true };
        }),

      // 更新物流信息
      updateTracking: adminProcedure
        .input(
          z.object({
            orderId: z.number(),
            shippingCarrier: z.string(),
            trackingNumber: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          await db.updateOrderTracking(
            input.orderId,
            input.shippingCarrier,
            input.trackingNumber
          );
          return { success: true };
        }),

      // 批量上传运单号
      batchUpdateTracking: adminProcedure
        .input(
          z.object({
            records: z.array(
              z.object({
                orderNumber: z.string(),
                trackingNumber: z.string(),
                carrier: z.string().optional(),
              })
            ),
          })
        )
        .mutation(async ({ ctx, input }) => {
          const { batchUpdateShipping } = await import("./shipment");
          const results = await batchUpdateShipping(ctx.user.id, input.records);
          return results;
        }),

      // 获取批量上传历史
      getBatchHistory: adminProcedure.query(async ({ ctx }) => {
        const { getBatchUploadHistory } = await import("./shipment");
        const history = await getBatchUploadHistory(ctx.user.id);
        return history;
      }),
    }),

    // 优惠券管理
    coupons: router({
      // 获取所有优惠券
      listAll: adminProcedure.query(async () => {
        // TODO: 实现优惠券列表查询
        return [];
      }),

      // 创建优惠券
      create: adminProcedure
        .input(
          z.object({
            code: z.string(),
            description: z.string().optional(),
            discountType: z.enum(["percentage", "fixed", "buy_x_get_y"]),
            discountValue: z.number(),
            minPurchase: z.number().optional(),
            usageLimit: z.number().optional(),
            startDate: z.date().optional(),
            endDate: z.date().optional(),
          })
        )
        .mutation(async () => {
          // TODO: 实现优惠券创建
          return { success: true };
        }),
    }),

    // 服务订单管理
    serviceOrders: router({
      // 获取服务订单列表
      list: adminProcedure
        .input(
          z.object({
            status: z.string().optional(),
            limit: z.number().min(1).max(100).default(50),
            offset: z.number().min(0).default(0),
          })
        )
        .query(async ({ input }) => {
          const orders = await db.getServiceOrders(input);
          return orders;
        }),

      // 获取服务订单详情
      getDetail: adminProcedure
        .input(z.object({ orderId: z.number() }))
        .query(async ({ input }) => {
          const detail = await db.getServiceOrderDetail(input.orderId);
          if (!detail) {
            throw new TRPCError({ code: "NOT_FOUND", message: "订单不存在" });
          }
          return detail;
        }),

      // 上传报告
      uploadReport: adminProcedure
        .input(
          z.object({
            orderId: z.number(),
            reportUrl: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const success = await db.updateServiceReport(input.orderId, input.reportUrl);
          if (!success) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "报告上传失败" });
          }
          
          // 发送报告邮件给用户
          try {
            const orderDetail = await db.getServiceOrderDetail(input.orderId);
            if (orderDetail && orderDetail.userEmail) {
              const { sendEmail, getServiceReportEmail } = await import("./email");
              const emailHtml = getServiceReportEmail({
                serviceName: orderDetail.productName,
                customerName: orderDetail.userName,
                reportUrl: input.reportUrl,
                orderNumber: orderDetail.orderNumber,
              });
              await sendEmail({
                to: orderDetail.userEmail,
                subject: `您的${orderDetail.productName}报告已完成 - ${orderDetail.orderNumber}`,
                html: emailHtml,
              });
            }
          } catch (error) {
            console.error("Failed to send service report email:", error);
          }
          
          return { success: true };
        }),
    }),
    
    // 评价管理
    reviews: router({
      // 获取所有评价
      listAll: adminProcedure
        .input(
          z.object({
            productId: z.number().optional(),
            status: z.enum(["pending", "approved", "rejected"]).optional(),
            limit: z.number().min(1).max(100).default(50),
            offset: z.number().min(0).default(0),
          })
        )
        .query(async ({ input }) => {
          const reviews = await db.getAllReviewsForAdmin(input);
          return reviews;
        }),
      
      // 审核评价
      approve: adminProcedure
        .input(z.object({ reviewId: z.number() }))
        .mutation(async ({ input }) => {
          await db.approveReview(input.reviewId);
          return { success: true };
        }),
      
      // 拒绝评价
      reject: adminProcedure
        .input(z.object({ reviewId: z.number() }))
        .mutation(async ({ input }) => {
          await db.rejectReview(input.reviewId);
          return { success: true };
        }),
      
      // 删除评价
      delete: adminProcedure
        .input(z.object({ reviewId: z.number() }))
        .mutation(async ({ input }) => {
          await db.deleteReview(input.reviewId);
          return { success: true };
        }),
    }),
  }),

  // ============= 命理测算服务 =============
  fortune: router({
    // 提交命理运势请求
    submitDestiny: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          gender: z.string().optional(),
          birthYear: z.string(),
          birthMonth: z.string(),
          birthDay: z.string(),
          birthHour: z.string().optional(),
          birthMinute: z.string().optional(),
          question: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: 实现紫微斗数分析逻辑
        // 目前先返回成功，后续实现报告生成
        console.log("收到命理运势请求:", input);
        return { success: true, message: "您的请求已提交，报告将在48小时内发送至您的邮箱" };
      }),

    // 提交代祈福请求
    submitPrayer: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          serviceType: z.enum(["lamp", "incense"]),
          prayerFor: z.string(),
          wish: z.string().optional(),
          quantity: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // TODO: 实现祈福服务逻辑
        // 目前先返回成功，后续实现证书生成
        console.log("收到代祈福请求:", input);
        return { success: true, message: "您的祈福请求已提交，我们将为您诚心祈福" };
      }),

    // 获取用户的fortune bookings
    getMyBookings: protectedProcedure.query(async ({ ctx }) => {
      const { getPendingFortuneBookings } = await import("./db-fortune-helpers");
      const allBookings = await getPendingFortuneBookings();
      return allBookings.filter(b => b.userId === ctx.user.id);
    }),

    // 获取单个booking详情
    getBooking: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input, ctx }) => {
        const { getUserById } = await import("./db-fortune-helpers");
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "数据库不可用" });
        
        const [booking] = await db.select().from((await import("../drizzle/schema")).fortuneBookings)
          .where((await import("drizzle-orm")).eq((await import("../drizzle/schema")).fortuneBookings.id, input.bookingId))
          .limit(1);
        
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Booking不存在" });
        }
        if (booking.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问" });
        }
        
        return booking;
      }),

    // 手动触发报告生成(仅用于测试)
    generateReport: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { getUserById } = await import("./db-fortune-helpers");
        const { processFortuneReport } = await import("./fortuneEngines/reportProcessor");
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "数据库不可用" });
        
        const [booking] = await db.select().from((await import("../drizzle/schema")).fortuneBookings)
          .where((await import("drizzle-orm")).eq((await import("../drizzle/schema")).fortuneBookings.id, input.bookingId))
          .limit(1);
        
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Booking不存在" });
        }
        if (booking.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问" });
        }
        
        const user = await getUserById(booking.userId);
        
        const result = await processFortuneReport({
          bookingId: booking.id,
          serviceType: booking.serviceType as any,
          imageUrls: booking.imageUrls as string[],
          questionDescription: booking.questionDescription || undefined,
          userName: user?.name || undefined,
        });
        
        return result;
      }),

    // 创建测算任务(需要已支付订单)
    createTask: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          serviceType: z.enum(["face", "palm", "fengshui"]),
          roomType: z.enum(["bedroom", "living_room", "study", "kitchen"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // 验证订单是否存在且已支付
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "订单不存在" });
        }
        if (order.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此订单" });
        }
        if (order.paymentStatus !== "paid") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "订单未支付" });
        }

        // 生成任务ID
        const taskId = `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 创建测算任务
        await db.createFortuneTask({
          taskId,
          orderId: input.orderId,
          userId: ctx.user.id,
          serviceType: input.serviceType,
          roomType: input.roomType,
        });

        return { taskId, status: "created" };
      }),

    // 上传图片并开始分析
    uploadImage: protectedProcedure
      .input(
        z.object({
          taskId: z.string(),
          imageBase64: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { taskId, imageBase64, mimeType } = input;

        // 验证任务
        const task = await db.getFortuneTask(taskId);
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND", message: "任务不存在" });
        }
        if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此任务" });
        }

        // 上传图片到S3
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(imageBase64.split(",")[1] || imageBase64, "base64");
        const fileKey = `fortune/${taskId}/${Date.now()}.${mimeType.split("/")[1]}`;
        const { url } = await storagePut(fileKey, buffer, mimeType);

        // 更新任务状态
        await db.updateFortuneTaskStatus(taskId, {
          status: "processing",
          progress: 20,
          imageUrl: url,
        });

        // 异步处理分析(不阻塞响应)
        if (task.serviceType !== 'fengshui') {
          processFortuneAnalysis(taskId, url, task.serviceType).catch(console.error);
        }

        return { taskId, status: "processing", imageUrl: url };
      }),

    // 上传多张图片(风水专用)
    uploadImages: protectedProcedure
      .input(
        z.object({
          taskId: z.string(),
          images: z.array(
            z.object({
              imageBase64: z.string(),
              mimeType: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { taskId, images } = input;

        // 验证任务
        const task = await db.getFortuneTask(taskId);
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND", message: "任务不存在" });
        }
        if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此任务" });
        }

        // 上传所有图片到S3
        const { storagePut } = await import("./storage");
        const uploadedUrls = [];

        for (let i = 0; i < images.length; i++) {
          const { imageBase64, mimeType } = images[i];
          const buffer = Buffer.from(imageBase64.split(",")[1] || imageBase64, "base64");
          const fileKey = `fortune/${taskId}/${Date.now()}-${i}.${mimeType.split("/")[1]}`;
          const { url } = await storagePut(fileKey, buffer, mimeType);
          uploadedUrls.push(url);
        }

        // 更新任务状态
        await db.updateFortuneTaskStatus(taskId, {
          status: "processing",
          progress: 20,
          imagesJson: uploadedUrls,
        });

        // 异步处理分析
        processFengshuiAnalysis(taskId, uploadedUrls, task.roomType!).catch(console.error);

        return { taskId, status: "processing", imageUrls: uploadedUrls };
      }),

    // 查询任务状态
    getTaskStatus: protectedProcedure
      .input(z.object({ taskId: z.string() }))
      .query(async ({ input, ctx }) => {
        const task = await db.getFortuneTask(input.taskId);
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND", message: "任务不存在" });
        }
        if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此任务" });
        }

        return {
          taskId: task.taskId,
          status: task.status,
          progress: task.progress,
          errorMessage: task.errorMessage,
        };
      }),

    // 获取测算报告
    getReport: protectedProcedure
      .input(z.object({ taskId: z.string() }))
      .query(async ({ input, ctx }) => {
        const task = await db.getFortuneTask(input.taskId);
        if (!task) {
          throw new TRPCError({ code: "NOT_FOUND", message: "任务不存在" });
        }
        if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "无权访问此任务" });
        }

        const report = await db.getFortuneReport(input.taskId);
        if (!report) {
          throw new TRPCError({ code: "NOT_FOUND", message: "报告尚未生成" });
        }

        return {
          taskId: report.taskId,
          serviceType: report.serviceType,
          overallSummary: report.overallSummary,
          sections: report.sectionsJson,
          score: report.score,
          createdAt: report.createdAt,
        };
      }),

    // 获取用户的所有测算记录
    getMyTasks: protectedProcedure
      .input(
        z.object({
          serviceType: z.enum(["face", "palm", "fengshui"]).optional(),
          limit: z.number().min(1).max(50).default(10),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        // 这里需要在db.ts中添加相应的查询函数
        // 暂时返回空数组
        return [];
      }),
  }),
});

export type AppRouter = typeof appRouter;

// ============= 异步分析处理函数 =============

/**
 * 处理面相/手相分析
 */
async function processFortuneAnalysis(
  taskId: string,
  imageUrl: string,
  serviceType: "face" | "palm"
) {
  try {
    // 1. 图像识别 - 提取特征
    await db.updateFortuneTaskStatus(taskId, { progress: 40 });
    const { extractFaceFeatures, extractPalmFeatures } = await import("./image-recognition");
    const features =
      serviceType === "face"
        ? await extractFaceFeatures(imageUrl)
        : await extractPalmFeatures(imageUrl);

    // 2. 命理计算
    await db.updateFortuneTaskStatus(taskId, { progress: 60, featuresJson: features });
    const { calculateFacePhysiognomy, calculatePalmPhysiognomy } = await import(
      "./physiognomy-engine"
    );
    const calculationResult =
      serviceType === "face"
        ? await calculateFacePhysiognomy(features as any)
        : await calculatePalmPhysiognomy(features as any);

    // 3. AI解读
    await db.updateFortuneTaskStatus(taskId, { progress: 80, calculationJson: calculationResult });
    const { generateAIInterpretation } = await import("./ai-interpretation");
    const interpretation = await generateAIInterpretation(calculationResult, serviceType);

    // 4. 保存报告
    const task = await db.getFortuneTask(taskId);
    await db.createFortuneReport({
      taskId,
      userId: task!.userId,
      serviceType,
      overallSummary: interpretation.overallSummary,
      sectionsJson: interpretation.sections,
      score: typeof calculationResult.overallScore === 'number' ? calculationResult.overallScore : undefined,
    });

    // 5. 更新任务状态为完成
    await db.updateFortuneTaskStatus(taskId, { status: "completed", progress: 100 });
  } catch (error: any) {
    console.error(`Fortune analysis failed for task ${taskId}:`, error);
    await db.updateFortuneTaskStatus(taskId, {
      status: "failed",
      errorMessage: error.message || "分析失败",
    });
  }
}

/**
 * 处理风水分析
 */
async function processFengshuiAnalysis(taskId: string, imageUrls: string[], roomType: string) {
  try {
    // 1. 图像识别 - 提取房间特征
    await db.updateFortuneTaskStatus(taskId, { progress: 40 });
    const { extractRoomFeatures } = await import("./fengshui-recognition");
    const features = await extractRoomFeatures(imageUrls, roomType);

    // 2. 风水计算
    await db.updateFortuneTaskStatus(taskId, { progress: 60, featuresJson: features });
    const { calculateRoomFengshui } = await import("./fengshui-engine");
    const calculationResult = await calculateRoomFengshui(features);

    // 3. AI解读
    await db.updateFortuneTaskStatus(taskId, { progress: 80, calculationJson: calculationResult });
    const { generateFengshuiAIInterpretation } = await import("./fengshui-ai-interpretation");
    const interpretation = await generateFengshuiAIInterpretation(calculationResult, roomType);

    // 4. 保存报告
    const task = await db.getFortuneTask(taskId);
    await db.createFortuneReport({
      taskId,
      userId: task!.userId,
      serviceType: "fengshui",
      overallSummary: interpretation.overallSummary,
      sectionsJson: interpretation.sections,
      score: typeof calculationResult.overallScore === 'number' ? calculationResult.overallScore : undefined,
    });

    // 5. 更新任务状态为完成
    await db.updateFortuneTaskStatus(taskId, { status: "completed", progress: 100 });
  } catch (error: any) {
    console.error(`Fengshui analysis failed for task ${taskId}:`, error);
    await db.updateFortuneTaskStatus(taskId, {
      status: "failed",
      errorMessage: error.message || "分析失败",
    });
  }
}
