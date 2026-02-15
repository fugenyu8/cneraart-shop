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
