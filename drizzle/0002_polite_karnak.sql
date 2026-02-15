CREATE TABLE `face_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`palaceName` varchar(64) NOT NULL,
	`featureName` varchar(64) NOT NULL,
	`conditionOperator` varchar(16) NOT NULL,
	`conditionValue` varchar(64) NOT NULL,
	`score` int NOT NULL,
	`interpretation` text NOT NULL,
	`category` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `face_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fengshui_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomType` varchar(32) NOT NULL,
	`category` varchar(32) NOT NULL,
	`ruleName` varchar(100) NOT NULL,
	`conditionType` varchar(32) NOT NULL,
	`conditionValue` varchar(100) NOT NULL,
	`score` int NOT NULL,
	`interpretation` text NOT NULL,
	`suggestion` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fengshui_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fortune_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`serviceType` enum('face','palm','fengshui') NOT NULL,
	`overallSummary` text NOT NULL,
	`sectionsJson` json NOT NULL,
	`score` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fortune_reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `fortune_reports_taskId_unique` UNIQUE(`taskId`)
);
--> statement-breakpoint
CREATE TABLE `fortune_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskId` varchar(64) NOT NULL,
	`orderId` int NOT NULL,
	`userId` int NOT NULL,
	`serviceType` enum('face','palm','fengshui') NOT NULL,
	`imageUrl` text,
	`imagesJson` json,
	`roomType` varchar(32),
	`status` enum('created','processing','completed','failed') NOT NULL DEFAULT 'created',
	`progress` int NOT NULL DEFAULT 0,
	`featuresJson` json,
	`calculationJson` json,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fortune_tasks_id` PRIMARY KEY(`id`),
	CONSTRAINT `fortune_tasks_taskId_unique` UNIQUE(`taskId`)
);
--> statement-breakpoint
CREATE TABLE `palm_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lineName` varchar(64),
	`hillName` varchar(64),
	`featureName` varchar(64) NOT NULL,
	`conditionOperator` varchar(16) NOT NULL,
	`conditionValue` varchar(64) NOT NULL,
	`score` int NOT NULL,
	`interpretation` text NOT NULL,
	`category` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `palm_rules_id` PRIMARY KEY(`id`)
);
