import { blob, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { type Category, type VoteEvent } from '$lib/domain/vote';
import type { Role } from '$lib/domain/user';
import type { Type, Track } from '$lib/domain/presentation';
import type { UserEvent } from 'storybook/test';

const role = text('role').$type<Role>().notNull();

export const users = sqliteTable('users', {
	id: integer().primaryKey({ autoIncrement: true }),
	accessCode: blob('access_code', { mode: 'buffer' }).notNull(),
	role
});

export const slots = sqliteTable('slots', {
	id: integer().primaryKey({ autoIncrement: true }),
	timestampStart: integer('timestamp_start', { mode: 'timestamp_ms' }).notNull(),
	timestampEnd: integer('timestamp_end', { mode: 'timestamp_ms' }).notNull()
});

export const presentations = sqliteTable('presentations', {
	id: integer().primaryKey({ autoIncrement: true }),
	type: text('type').$type<Type>().notNull(),
	slotId: integer('slot_id').references(() => slots.id),
	track: text('track').$type<Track>(),
	title: text('title').notNull(),
	author: text('author').notNull(),
	abstract: text('abstract')
});

export const votes = sqliteTable('votes', {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	kind: text('kind').$type<VoteEvent>(),
	presentationId: integer('presentation_id')
		.references(() => presentations.id)
		.notNull(),
	category: text('category').$type<Category>().notNull(),
	score: integer('score').notNull(),
	timestamp: integer('timestamp', { mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`)
});

export const currentVotes = sqliteTable(
	'current_votes',
	{
		user_id: integer().references(() => users.id),
		presenation_id: integer().references(() => presentations.id),
		category: text('category').$type<Category>(),
		vote_id: integer().references(() => votes.id)
	},
	(t) => [unique().on(t.user_id, t.presenation_id, t.category, t.vote_id)]
);

export const currentSlots = sqliteTable(
	'current_slots',
	{
		user_id: integer().references(() => users.id),
		slot_id: integer().references(() => slots.id),
		presentation_id: integer().references(() => presentations.id)
	},
	(t) => [unique().on(t.user_id, t.slot_id, t.presentation_id)]
);

export const appSettings = sqliteTable('app_settings', {
	votingEndsAt: integer('voting_ends_at', { mode: 'timestamp_ms' })
});

export const appEvents = sqliteTable('app_events', {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer('user_id').references(() => users.id),
	event: text('event').$type<UserEvent>().notNull(),
	timestamp: integer('timestamp', { mode: 'timestamp_ms' }).notNull()
});

export const sessions = sqliteTable('sessions', {
	tokenHash: blob('token_hash', { mode: 'buffer' }).primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	role,
	expiresAt: integer({ mode: 'timestamp_ms' }).notNull()
});
