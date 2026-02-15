import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// 管理员权限中间件
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "需要管理员权限" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
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
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.addToCart(ctx.user.id, input.productId, input.quantity);
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

        // 清空购物车
        await db.clearCart(ctx.user.id);

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

      // 更新订单状态
      updateStatus: adminProcedure
        .input(
          z.object({
            orderId: z.number(),
            status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
          })
        )
        .mutation(async () => {
          // TODO: 实现订单状态更新
          return { success: true };
        }),

      // 更新物流信息
      updateShipping: adminProcedure
        .input(
          z.object({
            orderId: z.number(),
            carrier: z.string(),
            trackingNumber: z.string(),
          })
        )
        .mutation(async () => {
          // TODO: 实现物流信息更新
          return { success: true };
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
  }),
});

export type AppRouter = typeof appRouter;
