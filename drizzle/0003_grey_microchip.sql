CREATE TABLE `fortune_bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`serviceType` enum('face','palm','fengshui') NOT NULL,
	`customerName` varchar(100) NOT NULL,
	`customerEmail` varchar(255) NOT NULL,
	`customerPhone` varchar(50),
	`bookingDate` timestamp NOT NULL,
	`questionDescription` text,
	`imageUrls` json,
	`paymentStatus` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentId` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`paidAt` timestamp,
	`status` enum('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
	`reportUrl` varchar(500),
	`completedAt` timestamp,
	`adminNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fortune_bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fortune_service_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int,
	`userId` int NOT NULL,
	`serviceType` enum('face','palm','fengshui') NOT NULL,
	`customerName` varchar(100) NOT NULL,
	`rating` int NOT NULL,
	`reviewText` text NOT NULL,
	`isFeatured` boolean DEFAULT false,
	`isApproved` boolean DEFAULT false,
	`language` varchar(10) DEFAULT 'zh',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fortune_service_reviews_id` PRIMARY KEY(`id`)
);
