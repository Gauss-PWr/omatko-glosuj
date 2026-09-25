CREATE TABLE `app_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer,
	`event` text NOT NULL,
	`timestamp` integer NOT NULL,
	CONSTRAINT `fk_app_events_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `app_settings` (
	`voting_ends_at` integer
);
--> statement-breakpoint
CREATE TABLE `picks` (
	`user_id` integer NOT NULL,
	`slot_id` integer NOT NULL,
	`presentation_id` integer NOT NULL,
	CONSTRAINT `picks_pk` PRIMARY KEY(`user_id`, `slot_id`),
	CONSTRAINT `fk_picks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_picks_slot_id_slots_id_fk` FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`),
	CONSTRAINT `fk_picks_presentation_id_presentations_id_fk` FOREIGN KEY (`presentation_id`) REFERENCES `presentations`(`id`)
);
--> statement-breakpoint
CREATE TABLE `presentations` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`type` text NOT NULL,
	`slot_id` integer,
	`track` text,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`abstract` text,
	CONSTRAINT `fk_presentations_slot_id_slots_id_fk` FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` blob PRIMARY KEY,
	`user_id` integer NOT NULL,
	`role` text NOT NULL,
	`expiresAt` integer NOT NULL,
	CONSTRAINT `fk_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`timestamp_start` integer NOT NULL,
	`timestamp_end` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`access_code_hash` blob NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vote_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`user_id` integer NOT NULL,
	`kind` text NOT NULL,
	`presentation_id` integer NOT NULL,
	`slot_id` integer,
	`category` text,
	`score` integer,
	`prev_score` integer,
	`at` integer NOT NULL,
	CONSTRAINT `fk_vote_events_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_vote_events_presentation_id_presentations_id_fk` FOREIGN KEY (`presentation_id`) REFERENCES `presentations`(`id`),
	CONSTRAINT `fk_vote_events_slot_id_slots_id_fk` FOREIGN KEY (`slot_id`) REFERENCES `slots`(`id`)
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`user_id` integer NOT NULL,
	`presentation_id` integer NOT NULL,
	`category` text NOT NULL,
	`score` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `votes_pk` PRIMARY KEY(`user_id`, `presentation_id`, `category`),
	CONSTRAINT `fk_votes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `fk_votes_presentation_id_presentations_id_fk` FOREIGN KEY (`presentation_id`) REFERENCES `presentations`(`id`)
);
--> statement-breakpoint
CREATE INDEX `vote_events_at` ON `vote_events` (`at`);--> statement-breakpoint
CREATE INDEX `vote_events_presentation_at` ON `vote_events` (`presentation_id`,`at`);