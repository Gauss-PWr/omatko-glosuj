import {
  blob,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { type Category, type VoteEvent } from "../lib/domain/vote";
import type { Role, UserEvent } from "../lib/domain/user";
import type { Type, Track } from "../lib/domain/presentation";
const role = text("role").$type<Role>().notNull();

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  accessCodeHash: blob("access_code_hash", { mode: "buffer" }).notNull(),
  role,
});

export const slots = sqliteTable("slots", {
  id: integer().primaryKey({ autoIncrement: true }),
  timestampStart: integer("timestamp_start", {
    mode: "timestamp_ms",
  }).notNull(),
  timestampEnd: integer("timestamp_end", { mode: "timestamp_ms" }).notNull(),
});

export const presentations = sqliteTable("presentations", {
  id: integer().primaryKey({ autoIncrement: true }),
  type: text("type").$type<Type>().notNull(),
  slotId: integer("slot_id").references(() => slots.id),
  track: text("track").$type<Track>(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  abstract: text("abstract"),
});

// Current state: which talk a user attends in a slot. One row per (user, slot).
export const picks = sqliteTable(
  "picks",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    slotId: integer("slot_id")
      .notNull()
      .references(() => slots.id),
    presentationId: integer("presentation_id")
      .notNull()
      .references(() => presentations.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.slotId] })],
);

// Current state: one score per (user, presentation, category). Withdrawn = row deleted.
export const votes = sqliteTable(
  "votes",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    presentationId: integer("presentation_id")
      .notNull()
      .references(() => presentations.id),
    category: text("category").$type<Category>().notNull(),
    score: integer("score").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.presentationId, t.category] })],
);

// Append-only log for behaviour analysis. Never read on the voting path.
export const voteEvents = sqliteTable(
  "vote_events",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    kind: text("kind").$type<VoteEvent>().notNull(),
    presentationId: integer("presentation_id")
      .notNull()
      .references(() => presentations.id),
    slotId: integer("slot_id").references(() => slots.id),
    category: text("category").$type<Category>(),
    score: integer("score"),
    prevScore: integer("prev_score"),
    at: integer("at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    index("vote_events_at").on(t.at),
    index("vote_events_presentation_at").on(t.presentationId, t.at),
  ],
);

export const appSettings = sqliteTable("app_settings", {
  votingEndsAt: integer("voting_ends_at", { mode: "timestamp_ms" }),
});

export const appEvents = sqliteTable("app_events", {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  event: text("event").$type<UserEvent>().notNull(),
  timestamp: integer("timestamp", { mode: "timestamp_ms" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  tokenHash: blob("token_hash", { mode: "buffer" }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  role,
  expiresAt: integer({ mode: "timestamp_ms" }).notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
export type NewSessionRow = typeof sessions.$inferInsert;
export type PickRow = typeof picks.$inferSelect;
export type VoteRow = typeof votes.$inferSelect;
export type NewVoteEventRow = typeof voteEvents.$inferInsert;
