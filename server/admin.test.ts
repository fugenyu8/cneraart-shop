import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/trpc";

describe("Admin Access Control", () => {
  it("should allow admin users to access admin.getStats", async () => {
    const mockAdminContext: TrpcContext = {
      user: {
        id: 1,
        openId: "admin-open-id",
        name: "Admin User",
        email: "admin@example.com",
        loginMethod: "oauth",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(mockAdminContext);
    
    // 管理员应该能够访问统计数据
    const stats = await caller.admin.getStats();
    
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalRevenue");
    expect(stats).toHaveProperty("totalOrders");
    expect(stats).toHaveProperty("totalProducts");
    expect(stats).toHaveProperty("totalCustomers");
  });

  it("should deny non-admin users from accessing admin.getStats", async () => {
    const mockUserContext: TrpcContext = {
      user: {
        id: 2,
        openId: "user-open-id",
        name: "Regular User",
        email: "user@example.com",
        loginMethod: "oauth",
        role: "user", // 普通用户
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(mockUserContext);
    
    // 普通用户应该被拒绝访问
    await expect(caller.admin.getStats()).rejects.toThrow();
  });

  it("should allow admin users to list all products", async () => {
    const mockAdminContext: TrpcContext = {
      user: {
        id: 1,
        openId: "admin-open-id",
        name: "Admin User",
        email: "admin@example.com",
        loginMethod: "oauth",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(mockAdminContext);
    
    // 管理员应该能够获取所有产品列表
    const products = await caller.admin.products.listAll({});
    
    expect(Array.isArray(products)).toBe(true);
  });

  it("should deny non-admin users from listing all products", async () => {
    const mockUserContext: TrpcContext = {
      user: {
        id: 2,
        openId: "user-open-id",
        name: "Regular User",
        email: "user@example.com",
        loginMethod: "oauth",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as any,
      res: {} as any,
    };

    const caller = appRouter.createCaller(mockUserContext);
    
    // 普通用户应该被拒绝访问
    await expect(caller.admin.products.listAll({})).rejects.toThrow();
  });
});

describe("Admin Order Management", () => {
  const mockAdminContext: TrpcContext = {
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "Admin User",
      email: "admin@example.com",
      loginMethod: "oauth",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  const mockUserContext: TrpcContext = {
    user: {
      id: 2,
      openId: "user-open-id",
      name: "Regular User",
      email: "user@example.com",
      loginMethod: "oauth",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  it("should allow admin users to list all orders", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    const orders = await caller.admin.orders.listAll({});
    
    expect(Array.isArray(orders)).toBe(true);
  });

  it("should deny non-admin users from listing all orders", async () => {
    const caller = appRouter.createCaller(mockUserContext);
    
    await expect(caller.admin.orders.listAll({})).rejects.toThrow();
  });

  it("should allow admin users to get order by ID", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    // 首先创建一个测试订单
    const userCaller = appRouter.createCaller(mockUserContext);
    const order = await userCaller.orders.create({
      items: [
        {
          productId: 1,
          quantity: 1,
          price: 49.99,
        },
      ],
      subtotal: 49.99,
      discount: 0,
      shipping: 5.00,
      tax: 0,
      total: 54.99,
      shippingAddress: {
        name: "Test User",
        phone: "1234567890",
        addressLine1: "123 Test St",
        city: "Test City",
        state: "Test State",
        postalCode: "12345",
        country: "Test Country",
      },
      paymentMethod: "paypal",
    });

    // 管理员应该能够获取订单详情
    const orderDetail = await caller.admin.orders.getById({ orderId: order.orderId });
    
    expect(orderDetail).toBeDefined();
    expect(orderDetail.id).toBe(order.orderId);
    expect(parseFloat(orderDetail.total)).toBe(54.99);
    expect(orderDetail.status).toBe("pending");
  });

  it("should allow admin users to update order status", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    // 首先创建一个测试订单
    const userCaller = appRouter.createCaller(mockUserContext);
    const order = await userCaller.orders.create({
      items: [
        {
          productId: 1,
          quantity: 1,
          price: 49.99,
        },
      ],
      subtotal: 49.99,
      discount: 0,
      shipping: 5.00,
      tax: 0,
      total: 54.99,
      shippingAddress: {
        name: "Test User",
        phone: "1234567890",
        addressLine1: "123 Test St",
        city: "Test City",
        state: "Test State",
        postalCode: "12345",
        country: "Test Country",
      },
      paymentMethod: "paypal",
    });

    // 管理员应该能够更新订单状态
    await caller.admin.orders.updateStatus({
      orderId: order.orderId,
      status: "processing",
    });

    // 验证状态已更新
    const updatedOrder = await caller.admin.orders.getById({ orderId: order.orderId });
    expect(updatedOrder.status).toBe("processing");
  });

  it("should allow admin users to update tracking info", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    // 首先创建一个测试订单
    const userCaller = appRouter.createCaller(mockUserContext);
    const order = await userCaller.orders.create({
      items: [
        {
          productId: 1,
          quantity: 1,
          price: 49.99,
        },
      ],
      subtotal: 49.99,
      discount: 0,
      shipping: 5.00,
      tax: 0,
      total: 54.99,
      shippingAddress: {
        name: "Test User",
        phone: "1234567890",
        addressLine1: "123 Test St",
        city: "Test City",
        state: "Test State",
        postalCode: "12345",
        country: "Test Country",
      },
      paymentMethod: "paypal",
    });

    // 管理员应该能够更新物流信息
    await caller.admin.orders.updateTracking({
      orderId: order.orderId,
      shippingCarrier: "DHL",
      trackingNumber: "DHL123456789",
    });

    // 验证物流信息已更新
    const updatedOrder = await caller.admin.orders.getById({ orderId: order.orderId });
    expect(updatedOrder.shippingCarrier).toBe("DHL");
    expect(updatedOrder.trackingNumber).toBe("DHL123456789");
  });

  it("should deny non-admin users from updating order status", async () => {
    const caller = appRouter.createCaller(mockUserContext);
    
    await expect(
      caller.admin.orders.updateStatus({
        orderId: 1,
        status: "processing",
      })
    ).rejects.toThrow();
  });

  it("should deny non-admin users from updating tracking info", async () => {
    const caller = appRouter.createCaller(mockUserContext);
    
    await expect(
      caller.admin.orders.updateTracking({
        orderId: 1,
        shippingCarrier: "DHL",
        trackingNumber: "DHL123456789",
      })
    ).rejects.toThrow();
  });
});
