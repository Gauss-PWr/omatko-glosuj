import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { z } from "astro/zod";
import { relations } from "../src/db/relations";
import {
  appSettings,
  picks,
  presentations,
  slots,
  voteEvents,
  votes,
  users,
} from "$db/schema";
import { track as trackSchema } from "$lib/domain/presentation";
import { encode } from "$lib/server/services/auth";

const DEV_CODE = "123456";

const talk = z.strictObject({
  track: trackSchema,
  title: z.string().min(1),
  author: z.string().min(1),
  abstract: z.string().optional(),
});

const schedule = z.strictObject({
  days: z
    .array(
      z.strictObject({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        slots: z
          .array(
            z.strictObject({
              start: z.string().regex(/^\d{2}:\d{2}$/),
              end: z.string().regex(/^\d{2}:\d{2}$/),
              talks: z.array(talk).length(2),
            }),
          )
          .length(3),
      }),
    )
    .length(3),
  posters: z.array(talk).length(3),
});

function wallClock(date: string, time: string): Date {
  return new Date(`${date}T${time}:00+01:00`);
}

const jsonPath = process.argv[2] ?? "data/schedule.json";
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

const parsed = schedule.parse(await Bun.file(jsonPath).json());

const db = drizzle({ client: new Database(databaseUrl), relations });
migrate(db, { migrationsFolder: "drizzle" });

db.delete(voteEvents).run();
db.delete(votes).run();
db.delete(picks).run();
db.delete(presentations).run();
db.delete(slots).run();

const existing = db.select({ id: users.id }).from(users).all();
if (existing.length === 0) {
  db.insert(users)
    .values({
      accessCodeHash: encode(DEV_CODE),
      role: "admin",
    })
    .run();
}

for (const day of parsed.days) {
  for (const slot of day.slots) {
    const [row] = db
      .insert(slots)
      .values({
        timestampStart: wallClock(day.date, slot.start),
        timestampEnd: wallClock(day.date, slot.end),
      })
      .returning({ id: slots.id })
      .all();
    if (!row) throw new Error("failed to insert slot");

    db.insert(presentations)
      .values(
        slot.talks.map((t) => ({
          type: "talk" as const,
          slotId: row.id,
          track: t.track,
          title: t.title,
          author: t.author,
          abstract: t.abstract ?? null,
        })),
      )
      .run();
  }
}

db.insert(presentations)
  .values(
    parsed.posters.map((p) => ({
      type: "poster" as const,
      slotId: null,
      track: p.track,
      title: p.title,
      author: p.author,
      abstract: p.abstract ?? null,
    })),
  )
  .run();

const settings = db.select().from(appSettings).all();
if (settings.length === 0) {
  db.insert(appSettings).values({ votingEndsAt: null }).run();
}

const talkCount = parsed.days.length * 3 * 2;
const userCount = db.select({ id: users.id }).from(users).all().length;
console.log(
  `Seeded ${parsed.days.length} days, ${talkCount} talks, ${parsed.posters.length} posters, ${userCount} users from ${jsonPath}`,
);
console.log(`Dev login code: ${DEV_CODE}`);
