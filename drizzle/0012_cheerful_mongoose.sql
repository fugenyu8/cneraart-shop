ALTER TABLE `reviews` ADD `content` text;--> statement-breakpoint
ALTER TABLE `reviews` ADD `isVerifiedPurchase` boolean DEFAULT false;