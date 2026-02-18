/**
 * Fortune Booking 辅助函数
 */

import { getDb } from "./db";
import { fortuneBookings, users } from "../drizzle/schema";
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
