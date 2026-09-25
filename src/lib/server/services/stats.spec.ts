import { beforeEach, describe, expect, test } from "vitest";
import Database from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { createDb, type DrizzleDb } from "$db/index";
import { presentations, users, votes } from "$db/schema";
import { StatsService } from "./stats";

let db: DrizzleDb;
let stats: StatsService;

beforeEach(async () => {
  db = createDb(new Database());
  migrate(db, { migrationsFolder: "drizzle" });
  await db.insert(users).values([
    { accessCodeHash: Buffer.from([1]), role: "attendee" },
    { accessCodeHash: Buffer.from([2]), role: "attendee" },
    { accessCodeHash: Buffer.from([3]), role: "attendee" },
  ]);
  await db.insert(presentations).values([
    {
      type: "talk",
      slotId: null,
      track: "applied",
      title: "Talk A",
      author: "Ada",
      abstract: null,
    },
    {
      type: "talk",
      slotId: null,
      track: "theory",
      title: "Talk B",
      author: "Benoit",
      abstract: "A short abstract",
    },
    {
      type: "poster",
      slotId: null,
      track: null,
      title: "Poster A",
      author: "Claude",
      abstract: null,
    },
    {
      type: "talk",
      slotId: null,
      track: null,
      title: "Unrated talk",
      author: "Dorothy",
      abstract: null,
    },
  ]);
  await db.insert(votes).values([
    { userId: 1, presentationId: 1, category: "t_1", score: 5, updatedAt: new Date() },
    { userId: 2, presentationId: 1, category: "t_1", score: 3, updatedAt: new Date() },
    { userId: 1, presentationId: 1, category: "t_2", score: 3, updatedAt: new Date() },
    { userId: 2, presentationId: 1, category: "t_2", score: 5, updatedAt: new Date() },
    { userId: 2, presentationId: 2, category: "t_1", score: 4, updatedAt: new Date() },
    { userId: 1, presentationId: 3, category: "p_1", score: 2, updatedAt: new Date() },
    { userId: 3, presentationId: 3, category: "p_1", score: 4, updatedAt: new Date() },
    { userId: 1, presentationId: 3, category: "p_2", score: 5, updatedAt: new Date() },
  ]);
  stats = new StatsService(db);
});

describe("stats service", () => {
  test("builds totals and separate type/category leaderboards", async () => {
    const overview = await stats.getOverview();

    expect(overview).toMatchObject({
      presentationCount: 4,
      ratedPresentationCount: 3,
      participantCount: 3,
      totalVotes: 8,
    });
    expect(overview.leaderboards).toHaveLength(4);
    expect(overview.leaderboards.find((board) => board.category === "t_1"))
      .toMatchObject({
        type: "talk",
        entries: [
          { presentationId: 1, averageScore: 4, voteCount: 2 },
          { presentationId: 2, averageScore: 4, voteCount: 1 },
        ],
      });
    expect(overview.leaderboards.find((board) => board.category === "p_1"))
      .toMatchObject({
        type: "poster",
        entries: [{ presentationId: 3, averageScore: 3, voteCount: 2 }],
      });
    expect(
      overview.leaderboards.find((board) => board.category === "t_2")?.entries,
    ).toHaveLength(1);
  });

  test("includes per-category averages and score distributions", async () => {
    const result = await stats.getPresentationStats(1);

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      presentation: { id: 1, title: "Talk A", type: "talk" },
      totalVotes: 4,
      categories: [
        {
          category: "t_1",
          averageScore: 4,
          voteCount: 2,
          distribution: [
            { score: 0, voteCount: 0 },
            { score: 1, voteCount: 0 },
            { score: 2, voteCount: 0 },
            { score: 3, voteCount: 1 },
            { score: 4, voteCount: 0 },
            { score: 5, voteCount: 1 },
          ],
        },
        { category: "t_2", averageScore: 4, voteCount: 2 },
      ],
    });
  });

  test("returns empty category results for unrated presentations", async () => {
    const result = await stats.getPresentationStats(4);

    expect(result?.totalVotes).toBe(0);
    expect(result?.categories).toEqual([
      {
        category: "t_1",
        averageScore: null,
        voteCount: 0,
        distribution: Array.from({ length: 6 }, (_, score) => ({
          score,
          voteCount: 0,
        })),
      },
      {
        category: "t_2",
        averageScore: null,
        voteCount: 0,
        distribution: Array.from({ length: 6 }, (_, score) => ({
          score,
          voteCount: 0,
        })),
      },
    ]);
  });

  test("returns null for an unknown presentation", async () => {
    await expect(stats.getPresentationStats(999)).resolves.toBeNull();
  });
});
