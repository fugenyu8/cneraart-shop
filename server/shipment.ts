import { getDb } from "./db";
import { shipmentTrackingEvents, shipmentBatchUploads, orders } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * 获取订单的物流跟踪事件
 */
export async function getShipmentTracking(orderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(shipmentTrackingEvents)
    .where(eq(shipmentTrackingEvents.orderId, orderId))
    .orderBy(desc(shipmentTrackingEvents.eventTime));
}

/**
 * 添加物流跟踪事件
 */
export async function addTrackingEvent(data: {
  orderId: number;
  carrier?: string;
  trackingNumber: string;
  eventTime: Date;
  eventType: string;
  eventDescription: string;
  location?: string;
  rawData?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [event] = await db.insert(shipmentTrackingEvents).values(data);
  return event;
}

/**
 * 更新订单物流信息
 */
export async function updateOrderShipping(
  orderId: number,
  data: {
    shippingCarrier?: string;
    trackingNumber?: string;
    shippedAt?: Date;
    status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set(data).where(eq(orders.id, orderId));
}

/**
 * 批量更新订单物流信息
 * @param records 格式: [{ orderNumber, trackingNumber, carrier }]
 */
export async function batchUpdateShipping(
  adminId: number,
  records: Array<{
    orderNumber: string;
    trackingNumber: string;
    carrier?: string;
  }>
) {
  const results = {
    total: records.length,
    success: 0,
    failed: 0,
    errors: [] as Array<{ orderNumber: string; error: string }>,
  };

  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // 创建批量上传记录
  const [batchUpload] = await db.insert(shipmentBatchUploads).values({
    adminId,
    fileName: `batch_${Date.now()}.csv`,
    totalRecords: records.length,
    status: "processing",
  });

  const batchId = batchUpload.insertId;

  for (const record of records) {
    try {
      // 查找订单
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, record.orderNumber))
        .limit(1);

      if (!order) {
        results.failed++;
        results.errors.push({
          orderNumber: record.orderNumber,
          error: "订单不存在",
        });
        continue;
      }

      // 更新订单物流信息
      await db
        .update(orders)
        .set({
          trackingNumber: record.trackingNumber,
          shippingCarrier: record.carrier || order.shippingCarrier,
          shippedAt: new Date(),
          status: "shipped",
        })
        .where(eq(orders.id, order.id));

      // 添加物流跟踪事件
      await db.insert(shipmentTrackingEvents).values({
        orderId: order.id,
        carrier: record.carrier || order.shippingCarrier || "Unknown",
        trackingNumber: record.trackingNumber,
        eventTime: new Date(),
        eventType: "shipped",
        eventDescription: "包裹已发货",
        location: "Warehouse",
      });

      results.success++;
    } catch (error: any) {
      results.failed++;
      results.errors.push({
        orderNumber: record.orderNumber,
        error: error.message || "未知错误",
      });
    }
  }

  // 更新批量上传记录
  await db
    .update(shipmentBatchUploads)
    .set({
      successCount: results.success,
      failureCount: results.failed,
      errorLog: results.errors,
      status: results.failed === 0 ? "completed" : "failed",
      completedAt: new Date(),
    })
    .where(eq(shipmentBatchUploads.id, batchId));

  return results;
}

/**
 * 获取批量上传历史记录
 */
export async function getBatchUploadHistory(adminId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const query = db.select().from(shipmentBatchUploads).orderBy(desc(shipmentBatchUploads.createdAt));
  
  if (adminId) {
    return await query.where(eq(shipmentBatchUploads.adminId, adminId));
  }
  
  return await query;
}
