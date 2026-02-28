ALTER TABLE `orders` ADD `directPayProof` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `directPayConfirmedAt` timestamp;--> statement-breakpoint
ALTER TABLE `orders` ADD `directPayNote` text;