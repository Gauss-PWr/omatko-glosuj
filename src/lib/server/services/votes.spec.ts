import { assert, test as baseTest, describe, expect } from "vitest";
import { createDb, type DrizzleDb } from "$db/index";
import Database from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
  users,
  slots,
  presentations,
  votes,
  picks,
  voteEvents,
  appSettings,
} from "$db/schema";
import { encode } from "./auth";
import { VoteService } from "./votes";
import * as ApiError from "$lib/api/errors";
import type { Vote } from "$lib/domain/vote";

const USER_ID = 1;
const TALK_ID = 1;
const POSTER_ID = 2;
const OTHER_TALK_ID = 3;
const SLOT_ID = 1;

const talkVote: Vote = { presentationId: TALK_ID, category: "t_1", score: 4 };
const posterVote: Vote = {
  presentationId: POSTER_ID,
  category: "p_1",
  score: 3,
};

function setupDb(): DrizzleDb {
  return createDb(new Database());
}

async function migrateAndSeed(db: DrizzleDb, votingEndsAt: Date | null) {
  migrate(db, { migrationsFolder: "drizzle" });
  await db.insert(users).values({
    accessCodeHash: encode("user-1"),
    role: "attendee",
  });
  await db.insert(slots).values({
    timestampStart: new Date(),
    timestampEnd: new Date(Date.now() + 3_600_000),
  });
  await db.insert(presentations).values([
    {
      type: "talk",
      slotId: SLOT_ID,
      track: "applied",
      title: "Talk",
      author: "Ada",
    },
    {
      type: "poster",
      slotId: null,
      track: "theory",
      title: "Poster",
      author: "Bob",
    },
    {
      type: "talk",
      slotId: SLOT_ID,
      track: "theory",
      title: "Other",
      author: "Cy",
    },
  ]);
  await db.insert(appSettings).values({ votingEndsAt });
}

async function eventKinds(db: DrizzleDb) {
  const rows = await db
    .select({ kind: voteEvents.kind })
    .from(voteEvents)
    .orderBy(voteEvents.id);
  return rows.map((r) => r.kind);
}

export const test = baseTest
  .extend("db", async () => {
    const db = setupDb();
    await migrateAndSeed(db, new Date(Date.now() + 86_400_000));
    return db;
  })
  .extend("voteService", async ({ db }) => new VoteService(db));

describe("vote service", () => {
  test("scoring a talk picks it and logs both events", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.vote(USER_ID, talkVote)).ok);

    assert.deepStrictEqual(await voteService.getVotes(USER_ID), [talkVote]);
    assert.deepStrictEqual(await voteService.getPicks(USER_ID), [
      { userId: USER_ID, slotId: SLOT_ID, presentationId: TALK_ID },
    ]);
    assert.deepStrictEqual(await eventKinds(db), ["talk_picked", "score_cast"]);
  });

  test("scoring a poster does not pick anything", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.vote(USER_ID, posterVote)).ok);

    assert.deepStrictEqual(await voteService.getVotes(USER_ID), [posterVote]);
    assert.deepStrictEqual(await voteService.getPicks(USER_ID), []);
    assert.deepStrictEqual(await eventKinds(db), ["score_cast"]);
  });

  test("re-scoring updates in place and logs the previous score", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.vote(USER_ID, talkVote)).ok);
    assert((await voteService.vote(USER_ID, { ...talkVote, score: 1 })).ok);

    assert.deepStrictEqual(await voteService.getVotes(USER_ID), [
      { ...talkVote, score: 1 },
    ]);

    const [, , recast] = await db
      .select()
      .from(voteEvents)
      .orderBy(voteEvents.id);
    assert(recast);
    assert.strictEqual(recast.kind, "score_cast");
    assert.strictEqual(recast.prevScore, 4);
    assert.strictEqual(recast.score, 1);
  });

  test("picking a talk without scoring", async ({ db, voteService }) => {
    assert((await voteService.pickTalk(USER_ID, TALK_ID)).ok);

    assert.deepStrictEqual(await voteService.getVotes(USER_ID), []);
    assert.strictEqual((await voteService.getPicks(USER_ID)).length, 1);
    assert.deepStrictEqual(await eventKinds(db), ["talk_picked"]);
  });

  test("picking the same talk again is a no-op", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.pickTalk(USER_ID, TALK_ID)).ok);
    assert((await voteService.pickTalk(USER_ID, TALK_ID)).ok);

    assert.deepStrictEqual(await eventKinds(db), ["talk_picked"]);
  });

  test("switching talks in a slot drops the previous scores", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.vote(USER_ID, talkVote)).ok);
    assert(
      (await voteService.vote(USER_ID, { ...talkVote, category: "t_2" })).ok,
    );
    assert((await voteService.pickTalk(USER_ID, OTHER_TALK_ID)).ok);

    assert.deepStrictEqual(await voteService.getVotes(USER_ID), []);
    assert.deepStrictEqual(await voteService.getPicks(USER_ID), [
      { userId: USER_ID, slotId: SLOT_ID, presentationId: OTHER_TALK_ID },
    ]);
    assert.deepStrictEqual(await eventKinds(db), [
      "talk_picked",
      "score_cast",
      "score_cast",
      "vote_withdrawn",
      "vote_withdrawn",
      "talk_picked",
    ]);
  });

  test("withdraw deletes the score and logs it", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.vote(USER_ID, posterVote)).ok);
    assert(
      (await voteService.withdraw(USER_ID, POSTER_ID, posterVote.category)).ok,
    );

    assert.deepStrictEqual(await voteService.getVotes(USER_ID), []);
    const [, withdrawn] = await db
      .select()
      .from(voteEvents)
      .orderBy(voteEvents.id);
    assert(withdrawn);
    assert.strictEqual(withdrawn.kind, "vote_withdrawn");
    assert.strictEqual(withdrawn.prevScore, posterVote.score);
  });

  test("withdrawing a missing score logs nothing", async ({
    db,
    voteService,
  }) => {
    assert((await voteService.withdraw(USER_ID, POSTER_ID, "p_1")).ok);
    assert.deepStrictEqual(await eventKinds(db), []);
  });

  test("rejects votes after voting ends", async ({ db, voteService }) => {
    await db
      .update(appSettings)
      .set({ votingEndsAt: new Date(Date.now() - 1_000) });

    const result = await voteService.vote(USER_ID, talkVote);
    assert(!result.ok);
    assert.strictEqual(result.error.code, ApiError.Code.VOTING_DISABLED);
  });

  test("null votingEndsAt means voting is open", async () => {
    const db = setupDb();
    await migrateAndSeed(db, null);
    const voteService = new VoteService(db);
    assert((await voteService.vote(USER_ID, talkVote)).ok);
  });

  test("throws when the app_settings row is missing", async ({
    db,
    voteService,
  }) => {
    await db.delete(appSettings);
    await expect(voteService.vote(USER_ID, talkVote)).rejects.toThrow(
      /app_settings/,
    );
  });

  test.for([
    ["picking a poster", (s: VoteService) => s.pickTalk(USER_ID, POSTER_ID)],
    [
      "category not matching presentation type",
      (s: VoteService) =>
        s.vote(USER_ID, {
          presentationId: POSTER_ID,
          category: "t_1",
          score: 2,
        }),
    ],
    [
      "unknown presentation",
      (s: VoteService) => s.vote(USER_ID, { ...talkVote, presentationId: 999 }),
    ],
  ] as const)(
    "rejects %s as VOTE_INVALID",
    async ([, run], { db, voteService }) => {
      const result = await run(voteService);
      assert(!result.ok);
      assert.strictEqual(result.error.code, ApiError.Code.VOTE_INVALID);
      assert.deepStrictEqual(await eventKinds(db), []);
      assert.deepStrictEqual(await db.select().from(votes), []);
      assert.deepStrictEqual(await db.select().from(picks), []);
    },
  );
});
