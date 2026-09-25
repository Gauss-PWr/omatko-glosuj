import { asc, eq } from "drizzle-orm";
import { db } from "db";
import { presentations, slots } from "$db/schema";
import type { Track } from "$lib/domain/presentation";

export type TalkCard = {
  id: number;
  title: string;
  author: string;
  abstract: string | null;
  track: Track | null;
};

export type SlotCard = {
  id: number;
  start: Date;
  end: Date;
  talks: TalkCard[];
};

export type DayCard = {
  key: string;
  label: string;
  slots: SlotCard[];
};

const warsawDate = {
  timeZone: "Europe/Warsaw",
} as const;

export function formatClock(at: Date): string {
  return at.toLocaleTimeString("pl-PL", {
    ...warsawDate,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dayKey(at: Date): string {
  return at.toLocaleDateString("sv-SE", warsawDate);
}

function dayLabel(at: Date): string {
  const label = at.toLocaleDateString("pl-PL", {
    ...warsawDate,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function toTalk(row: typeof presentations.$inferSelect): TalkCard {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    abstract: row.abstract,
    track: row.track ?? null,
  };
}

export async function loadSchedule(): Promise<{
  days: DayCard[];
  posters: TalkCard[];
}> {
  const slotRows = await db
    .select()
    .from(slots)
    .orderBy(asc(slots.timestampStart));
  const talkRows = await db
    .select()
    .from(presentations)
    .where(eq(presentations.type, "talk"));
  const posterRows = await db
    .select()
    .from(presentations)
    .where(eq(presentations.type, "poster"));

  const talksBySlot = new Map<number, TalkCard[]>();
  for (const talk of talkRows) {
    if (talk.slotId === null) continue;
    const list = talksBySlot.get(talk.slotId) ?? [];
    list.push(toTalk(talk));
    talksBySlot.set(talk.slotId, list);
  }

  const days: DayCard[] = [];
  const byKey = new Map<string, DayCard>();

  for (const slot of slotRows) {
    const key = dayKey(slot.timestampStart);
    let day = byKey.get(key);
    if (!day) {
      day = { key, label: dayLabel(slot.timestampStart), slots: [] };
      byKey.set(key, day);
      days.push(day);
    }
    day.slots.push({
      id: slot.id,
      start: slot.timestampStart,
      end: slot.timestampEnd,
      talks: talksBySlot.get(slot.id) ?? [],
    });
  }

  return {
    days,
    posters: posterRows.map(toTalk),
  };
}
