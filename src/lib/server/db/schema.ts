import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: integer().primaryKey({ autoIncrement: true }),
    accessCode: blob('access_code', { mode: 'buffer' }).notNull(),
    role: text('role', {enum: ['attendee', 'staff', 'admin']}).notNull()
})

export const slots = sqliteTable('slots', {
    id: integer().primaryKey({ autoIncrement: true }),
    timestampStart: integer('timestamp_start', { mode: 'timestamp_ms' }).notNull(),
    timestampEnd: integer('timestamp_end', {mode: 'timestamp_ms'}).notNull(),
})

export const presentations = sqliteTable('presentations', {
    id: integer().primaryKey({ autoIncrement: true }),
    type: text('type',{ enum: ['talk', 'poster'] }).notNull(),
    slotId: integer('slot_id').references(() => slots.id),
    track: text('track', { enum: ['applied', 'theory'] }),
    title: text('title').notNull(),
    author: text('author').notNull(),
    abstract: text('abstract')

})

export const vote = sqliteTable('vote', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).notNull(),
    presentationId: integer('presentation_id').references(() => presentations.id).notNull(),
    category: text('category', { enum: ['t_cat_1', 't_cat_2', 'p_cat_1', 'p_cat_2'] }).notNull(),
    score: integer('score').default(0).notNull(),
    timestamp: integer('timestamp', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`)
})

export const appSettings = sqliteTable("app_settings", {
  votingEndsAt: integer("voting_ends_at", {mode: 'timestamp_ms'}),
});

export const appEvents = sqliteTable('app_events', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id),
    event: text('event', { enum: ['foreground', 'background'] }).notNull(),
    timestamp: integer('timestamp', {mode: 'timestamp_ms'}).notNull()
})

export const sessions = sqliteTable('sessions', {
    id: text().primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    expiresAt: integer({mode: 'timestamp_ms'}).notNull()
})
