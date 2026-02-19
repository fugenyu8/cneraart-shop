ALTER TABLE `reviews` MODIFY COLUMN `userId` int;--> statement-breakpoint
ALTER TABLE `reviews` ADD `userName` varchar(100);--> statement-breakpoint
ALTER TABLE `reviews` ADD `comment` text;--> statement-breakpoint
ALTER TABLE `reviews` ADD `ipAddress` varchar(45);--> statement-breakpoint
ALTER TABLE `reviews` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `reviews` ADD `isVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `reviews` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `reviews` DROP COLUMN `isVerifiedPurchase`;