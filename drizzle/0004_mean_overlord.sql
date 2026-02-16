ALTER TABLE `fortune_bookings` MODIFY COLUMN `bookingDate` timestamp;--> statement-breakpoint
ALTER TABLE `fortune_bookings` MODIFY COLUMN `status` enum('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `fortune_bookings` ADD `orderId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `fortune_bookings` ADD `reportSentAt` timestamp;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `customerName`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `customerEmail`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `customerPhone`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `paymentStatus`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `paymentId`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `amount`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `currency`;--> statement-breakpoint
ALTER TABLE `fortune_bookings` DROP COLUMN `paidAt`;