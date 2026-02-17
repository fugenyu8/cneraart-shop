import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { orders, shipmentTrackingEvents, shipmentBatchUploads } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  getShipmentTracking,
  addTrackingEvent,
  updateOrderShipping,
  batchUpdateShipping,
  getBatchUploadHistory,
} from "./shipment";

describe("Shipment Tracking", () => {
  let testOrderId: number;
  let testAdminId = 1; // 假设管理员ID为1

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // 创建测试订单
    const [order] = await db.insert(orders).values({
      orderNumber: `TEST-${Date.now()}`,
      userId: 1,
      subtotal: "100.00",
      total: "100.00",
      shippingName: "Test User",
      shippingAddress: "123 Test St",
      shippingCity: "Test City",
      shippingPostalCode: "12345",
      shippingCountry: "US",
      paymentMethod: "paypal",
    });

    testOrderId = order.insertId;
  });

  it("should add tracking event", async () => {
    const event = await addTrackingEvent({
      orderId: testOrderId,
      carrier: "USPS",
      trackingNumber: "1234567890",
      eventTime: new Date(),
      eventType: "shipped",
      eventDescription: "Package shipped from warehouse",
      location: "Los Angeles, CA",
    });

    expect(event).toBeDefined();
  });

  it("should get shipment tracking events", async () => {
    const events = await getShipmentTracking(testOrderId);
    expect(events).toBeDefined();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0].trackingNumber).toBe("1234567890");
  });

  it("should update order shipping info", async () => {
    await updateOrderShipping(testOrderId, {
      shippingCarrier: "FedEx",
      trackingNumber: "9876543210",
      shippedAt: new Date(),
      status: "shipped",
    });

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, testOrderId))
      .limit(1);

    expect(order.shippingCarrier).toBe("FedEx");
    expect(order.trackingNumber).toBe("9876543210");
    expect(order.status).toBe("shipped");
  });

  it("should batch update shipping info", async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // 创建额外的测试订单
    const [order1] = await db.insert(orders).values({
      orderNumber: `BATCH-TEST-1-${Date.now()}`,
      userId: 1,
      subtotal: "50.00",
      total: "50.00",
      shippingName: "Test User 1",
      shippingAddress: "456 Test Ave",
      shippingCity: "Test City",
      shippingPostalCode: "12345",
      shippingCountry: "US",
      paymentMethod: "paypal",
    });

    const [order2] = await db.insert(orders).values({
      orderNumber: `BATCH-TEST-2-${Date.now()}`,
      userId: 1,
      subtotal: "75.00",
      total: "75.00",
      shippingName: "Test User 2",
      shippingAddress: "789 Test Blvd",
      shippingCity: "Test City",
      shippingPostalCode: "12345",
      shippingCountry: "US",
      paymentMethod: "paypal",
    });

    const orderNumber1 = `BATCH-TEST-1-${Date.now()}`;
    const orderNumber2 = `BATCH-TEST-2-${Date.now()}`;

    // 获取刚创建的订单号
    const [createdOrder1] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, order1.insertId))
      .limit(1);
    const [createdOrder2] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, order2.insertId))
      .limit(1);

    const results = await batchUpdateShipping(testAdminId, [
      {
        orderNumber: createdOrder1.orderNumber,
        trackingNumber: "BATCH-TRACK-1",
        carrier: "USPS",
      },
      {
        orderNumber: createdOrder2.orderNumber,
        trackingNumber: "BATCH-TRACK-2",
        carrier: "FedEx",
      },
      {
        orderNumber: "INVALID-ORDER",
        trackingNumber: "INVALID-TRACK",
        carrier: "UPS",
      },
    ]);

    expect(results.total).toBe(3);
    expect(results.success).toBe(2);
    expect(results.failed).toBe(1);
    expect(results.errors.length).toBe(1);
    expect(results.errors[0].orderNumber).toBe("INVALID-ORDER");
  });

  it("should get batch upload history", async () => {
    const history = await getBatchUploadHistory(testAdminId);
    expect(history).toBeDefined();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].adminId).toBe(testAdminId);
  });
});
