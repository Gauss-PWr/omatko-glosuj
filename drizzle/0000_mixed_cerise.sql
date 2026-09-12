CREATE TABLE `app_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`event` text NOT NULL,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `app_settings` (
	`voting_ends_at` integer
);
--> statement-breakpoint
CREATE TABLE `current_slots` (
	`user_id` integer,
	`slot_id` integer,
	`presentation_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`presentation_id`) REFERENCES `presentations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `current_slots_user_id_slot_id_presentation_id_unique` ON `current_slots` (`user_id`,`slot_id`,`presentation_id`);--> statement-breakpoint
CREATE TABLE `current_votes` (
	`user_id` integer,
	`presenation_id` integer,
	`category` text,
	`vote_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`presenation_id`) REFERENCES `presentations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vote_id`) REFERENCES `votes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `current_votes_user_id_presenation_id_category_vote_id_unique` ON `current_votes` (`user_id`,`presenation_id`,`category`,`vote_id`);--> statement-breakpoint
CREATE TABLE `presentations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`slot_id` integer,
	`track` text,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`abstract` text,
	FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` blob PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`role` text NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp_start` integer NOT NULL,
	`timestamp_end` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`access_code` blob NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`presentation_id` integer NOT NULL,
	`category` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`timestamp` integer DEFAULT (unixepoch() * 1000),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`presentation_id`) REFERENCES `presentations`(`id`) ON UPDATE no action ON DELETE no action
);
