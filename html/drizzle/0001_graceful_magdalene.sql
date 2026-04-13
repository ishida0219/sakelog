CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sakeRecordId` int NOT NULL,
	`sakeIndex` int NOT NULL DEFAULT 0,
	`stars` int,
	`drinkAgain` enum('yes','maybe','neutral','no'),
	`pairing` enum('fish','meat','cheese','japanese','solo'),
	`impression` enum('aroma','umami','finish','drinkability','surprise'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sake_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`imageUrl` text NOT NULL,
	`identifiedSakes` json NOT NULL,
	`isArchived` boolean NOT NULL DEFAULT false,
	`isPublic` boolean NOT NULL DEFAULT true,
	`shareImageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sake_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `nickname` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `gender` enum('male','female','other','prefer_not_to_say');--> statement-breakpoint
ALTER TABLE `users` ADD `ageGroup` enum('teens','twenties','thirties','forties','fifties','sixties_plus');--> statement-breakpoint
ALTER TABLE `users` ADD `prefecture` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(64) DEFAULT 'Japan';--> statement-breakpoint
ALTER TABLE `users` ADD `isPremium` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_sakeRecordId_sake_records_id_fk` FOREIGN KEY (`sakeRecordId`) REFERENCES `sake_records`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sake_records` ADD CONSTRAINT `sake_records_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `userRecordIdx` ON `ratings` (`userId`,`sakeRecordId`);--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `sake_records` (`userId`);