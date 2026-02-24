/**
 * Fortune Booking 辅助函数
 */

import { getDb } from "./db";
import { fortuneBookings, fortuneReports, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * 获取待处理的fortune bookings
 */
export async function getPendingFortuneBookings() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(fortuneBookings)
    .where(eq(fortuneBookings.status, "pending"));
}

/**
 * 更新fortune booking状态
 */
export async function updateFortuneBookingStatus(
  bookingId: number,
  status: "pending" | "in_progress" | "completed" | "cancelled"
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(fortuneBookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(fortuneBookings.id, bookingId));
}

/**
 * 获取用户信息
 */
export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

/**
 * 保存命理分析报告到数据库
 */
export async function createFortuneReport(data: {
  taskId: string;
  userId: number;
  serviceType: "face" | "palm" | "fengshui";
  overallSummary: string;
  sectionsJson: any;
  score: number;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(fortuneReports).values({
    taskId: data.taskId,
    userId: data.userId,
    serviceType: data.serviceType,
    overallSummary: data.overallSummary,
    sectionsJson: data.sectionsJson,
    score: data.score,
  });

  return result;
}

/**
 * 根据 taskId 获取报告
 */
export async function getFortuneReportByTaskId(taskId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(fortuneReports)
    .where(eq(fortuneReports.taskId, taskId))
    .limit(1);

  return result[0] || null;
}
