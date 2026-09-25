import * as AppError from "$lib/api/errors";
import {
  categoryPresentationType,
  voteEvents as EventKind,
  type Category,
  type Vote,
} from "$lib/domain/vote";
import { presentationType } from "$lib/domain/presentation";
import type { DrizzleDb, DrizzleTx } from "$db/index";
import { and, eq } from "drizzle-orm";
import { Err, Ok, type Result } from "$lib/core/result";
import {
  picks,
  votes,
  voteEvents,
  type NewVoteEventRow,
  type PickRow,
} from "$db/schema";

type VoteError = AppError.VotingDisabled | AppError.VoteInvalidError;
type VoteResult = Result<undefined, VoteError>;

type Talk = { id: number; slotId: number };

function invalid(message: string): VoteResult {
  return Err({ code: AppError.Code.VOTE_INVALID, message });
}

/**
 * `picks` and `votes` hold the current state; `vote_events` is an append-only
 * log written in the same transaction and never read here.
 * Scoring a talk implies picking it; picking a different talk in a slot drops
 * the scores of the previous one.
 */
export class VoteService {
  constructor(private readonly db: DrizzleDb) {}

  async vote(userId: number, vote: Vote): Promise<VoteResult> {
    return this.db.transaction((tx) => {
      const open = this.requireVotingOpen(tx);
      if (!open.ok) return open;

      const presentation = this.findPresentation(tx, vote.presentationId);
      if (!presentation) return invalid("presentation not found");
      if (presentation.type !== categoryPresentationType(vote.category))
        return invalid("category does not match presentation type");

      const now = new Date();

      if (presentation.type === presentationType.TALK) {
        if (presentation.slotId === null) return invalid("talk has no slot");
        this.pick(
          tx,
          userId,
          { id: vote.presentationId, slotId: presentation.slotId },
          now,
        );
      }

      const prev = tx
        .select({ score: votes.score })
        .from(votes)
        .where(
          and(
            eq(votes.userId, userId),
            eq(votes.presentationId, vote.presentationId),
            eq(votes.category, vote.category),
          ),
        )
        .get();

      tx.insert(votes)
        .values({ userId, ...vote, updatedAt: now })
        .onConflictDoUpdate({
          target: [votes.userId, votes.presentationId, votes.category],
          set: { score: vote.score, updatedAt: now },
        })
        .run();

      this.log(tx, {
        userId,
        kind: EventKind.SCORE_CAST,
        presentationId: vote.presentationId,
        slotId: presentation.slotId,
        category: vote.category,
        score: vote.score,
        prevScore: prev?.score ?? null,
        at: now,
      });

      return Ok();
    });
  }

  async pickTalk(userId: number, presentationId: number): Promise<VoteResult> {
    return this.db.transaction((tx) => {
      const open = this.requireVotingOpen(tx);
      if (!open.ok) return open;

      const talk = this.findPresentation(tx, presentationId);
      if (!talk) return invalid("presentation not found");
      if (talk.type !== presentationType.TALK)
        return invalid("only talks can be picked");
      if (talk.slotId === null) return invalid("talk has no slot");

      this.pick(
        tx,
        userId,
        { id: presentationId, slotId: talk.slotId },
        new Date(),
      );
      return Ok();
    });
  }

  async withdraw(
    userId: number,
    presentationId: number,
    category: Category,
  ): Promise<VoteResult> {
    return this.db.transaction((tx) => {
      const open = this.requireVotingOpen(tx);
      if (!open.ok) return open;

      const removed = tx
        .delete(votes)
        .where(
          and(
            eq(votes.userId, userId),
            eq(votes.presentationId, presentationId),
            eq(votes.category, category),
          ),
        )
        .returning({ score: votes.score })
        .get();

      if (removed) {
        this.log(tx, {
          userId,
          kind: EventKind.VOTE_WITHDRAWN,
          presentationId,
          category,
          prevScore: removed.score,
          at: new Date(),
        });
      }

      return Ok();
    });
  }

  async getVotes(userId: number): Promise<Vote[]> {
    return this.db
      .select({
        presentationId: votes.presentationId,
        category: votes.category,
        score: votes.score,
      })
      .from(votes)
      .where(eq(votes.userId, userId));
  }

  async getPicks(userId: number): Promise<PickRow[]> {
    return this.db.select().from(picks).where(eq(picks.userId, userId));
  }

  private requireVotingOpen(tx: DrizzleTx): VoteResult {
    const settings = tx.query.appSettings
      .findFirst({ columns: { votingEndsAt: true } })
      .sync();
    if (!settings) throw new Error("app_settings row is missing.");

    // null deadline = voting open with no end scheduled
    if (settings.votingEndsAt && settings.votingEndsAt.getTime() < Date.now())
      return Err({ code: AppError.Code.VOTING_DISABLED });

    return Ok();
  }

  private findPresentation(tx: DrizzleTx, id: number) {
    return tx.query.presentations
      .findFirst({ where: { id }, columns: { type: true, slotId: true } })
      .sync();
  }

  private pick(tx: DrizzleTx, userId: number, talk: Talk, now: Date): void {
    const current = tx
      .select({ presentationId: picks.presentationId })
      .from(picks)
      .where(and(eq(picks.userId, userId), eq(picks.slotId, talk.slotId)))
      .get();

    if (current?.presentationId === talk.id) return;

    if (current) {
      const dropped = tx
        .delete(votes)
        .where(
          and(
            eq(votes.userId, userId),
            eq(votes.presentationId, current.presentationId),
          ),
        )
        .returning({ category: votes.category, score: votes.score })
        .all();

      for (const v of dropped) {
        this.log(tx, {
          userId,
          kind: EventKind.VOTE_WITHDRAWN,
          presentationId: current.presentationId,
          slotId: talk.slotId,
          category: v.category,
          prevScore: v.score,
          at: now,
        });
      }
    }

    tx.insert(picks)
      .values({ userId, slotId: talk.slotId, presentationId: talk.id })
      .onConflictDoUpdate({
        target: [picks.userId, picks.slotId],
        set: { presentationId: talk.id },
      })
      .run();

    this.log(tx, {
      userId,
      kind: EventKind.TALK_PICKED,
      presentationId: talk.id,
      slotId: talk.slotId,
      at: now,
    });
  }

  private log(tx: DrizzleTx, event: NewVoteEventRow): void {
    tx.insert(voteEvents).values(event).run();
  }
}
