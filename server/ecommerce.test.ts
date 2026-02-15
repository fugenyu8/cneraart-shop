import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/trpc";

describe("E-commerce Core Functions", () => {
  const mockUserContext: TrpcContext = {
    user: {
      id: 1,
      openId: "test-user-open-id",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "oauth",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  const mockAdminContext: TrpcContext = {
    user: {
      id: 2,
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

  describe("Product Management", () => {
    it("should allow admin to create a product", async () => {
      const caller = appRouter.createCaller(mockAdminContext);

      const result = await caller.admin.products.create({
        name: "Test Blessed Bracelet",
        slug: `test-blessed-bracelet-${Date.now()}`,
        description: "A test product for blessed bracelet",
        shortDescription: "Test product",
        regularPrice: 99.99,
        salePrice: 79.99,
        sku: "TEST-001",
        stock: 100,
        lowStockThreshold: 10,
        status: "published",
        featured: true,
        blessingTemple: "Test Temple",
        blessingMaster: "Test Master",
        blessingDate: new Date(),
        blessingDescription: "Test blessing ceremony",
        images: [
          {
            url: "https://example.com/image1.jpg",
            fileKey: "test/image1.jpg",
            isPrimary: true,
            displayOrder: 0,
          },
        ],
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.productId).toBeGreaterThan(0);
    });

    it("should allow admin to list all products", async () => {
      const caller = appRouter.createCaller(mockAdminContext);

      const products = await caller.admin.products.listAll({});

      expect(Array.isArray(products)).toBe(true);
    });

    it("should deny non-admin from creating products", async () => {
      const caller = appRouter.createCaller(mockUserContext);

      await expect(
        caller.admin.products.create({
          name: "Test Product",
          slug: "test-product",
          regularPrice: 99.99,
          stock: 100,
          status: "published",
        })
      ).rejects.toThrow();
    });
  });

  describe("Shopping Cart", () => {
    it("should allow user to get cart items", async () => {
      const caller = appRouter.createCaller(mockUserContext);

      const cartItems = await caller.cart.get();

      expect(Array.isArray(cartItems)).toBe(true);
    });

    it("should allow user to add product to cart", async () => {
      const caller = appRouter.createCaller(mockUserContext);

      const result = await caller.cart.add({
        productId: 1,
        quantity: 2,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe("Order Management", () => {
    it("should allow user to create an order", async () => {
      const caller = appRouter.createCaller(mockUserContext);

      const result = await caller.orders.create({
        items: [
          {
            productId: 1,
            quantity: 1,
            price: 79.99,
          },
        ],
        subtotal: 79.99,
        discount: 0,
        shipping: 10,
        tax: 6.4,
        total: 96.39,
        shippingAddress: {
          name: "Test User",
          phone: "1234567890",
          addressLine1: "123 Test St",
          city: "Test City",
          state: "CA",
          postalCode: "12345",
          country: "United States",
        },
        paymentMethod: "paypal",
      });

      expect(result).toBeDefined();
      expect(result.orderId).toBeGreaterThan(0);
      expect(result.orderNumber).toBeDefined();
    });

    it("should allow user to list their orders", async () => {
      const caller = appRouter.createCaller(mockUserContext);

      const orders = await caller.orders.list();

      expect(Array.isArray(orders)).toBe(true);
    });

    it("should allow admin to list all orders", async () => {
      const caller = appRouter.createCaller(mockAdminContext);

      const orders = await caller.admin.orders.listAll({});

      expect(Array.isArray(orders)).toBe(true);
    });
  });

  describe("Admin Statistics", () => {
    it("should provide admin dashboard statistics", async () => {
      const caller = appRouter.createCaller(mockAdminContext);

      const stats = await caller.admin.getStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalRevenue");
      expect(stats).toHaveProperty("totalOrders");
      expect(stats).toHaveProperty("totalProducts");
      expect(stats).toHaveProperty("totalCustomers");
      expect(typeof stats.totalRevenue).toBe("number");
      expect(typeof stats.totalOrders).toBe("number");
    });
  });
});
