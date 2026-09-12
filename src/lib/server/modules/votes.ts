import * as AppError from '$lib/api/errors';
import { voteEvents, type Category, type Vote } from '$lib/domain/vote';
import { type DrizzleDb } from '../db';
import { and, eq } from 'drizzle-orm';
import { Err, Ok, type Result } from '$lib/core/result';
import { currentSlots, votes, currentVotes } from '../db/schema';

export class VoteSerivce {
	constructor(readonly db: DrizzleDb) {}

	async vote(userId: number, vote: Vote): Promise<Result<undefined, AppError.VotingDisabled>> {
		const now = Date.now();

		const isDisabled = await this.db.query.appSettings.findFirst({
			columns: {
				votingEndsAt: true
			}
		});
		if (!isDisabled || !isDisabled.votingEndsAt)
			throw new Error('votingEndsAt column is missing from app settings.');

		if (isDisabled.votingEndsAt.getTime() < now)
			return Err({ code: AppError.Code.VOTING_DISABLED });

		const [addVoteResult] = await this.db
			.insert(votes)
			.values({
				userId,
				kind: voteEvents.SCORE_CAST,
				presentationId: vote.presentationId,
				category: vote.category,
				score: vote.score
			})
			.returning({ id: votes.id });

		if (vote.category.startsWith('t')) await this.setCurrentSlot(userId, vote.presentationId);

		await this.setCurrentVote(userId, vote.presentationId, vote.category, addVoteResult.id);

		return Ok();
	}

	async setCurrentSlot(userId: number, presentationId: number): Promise<undefined> {
		const presentationSlot = await this.db.query.presentations.findFirst({
			where: (t, { eq }) => eq(t.id, presentationId),
			columns: {
				slotId: true
			}
		});

		if (!presentationSlot || presentationSlot.slotId === null)
			throw new Error(`Slot should exist for the talk with id ${presentationId}`);

		this.db
			.update(currentSlots)
			.set({ presentation_id: presentationId })
			.where(
				and(eq(currentSlots.slot_id, presentationSlot.slotId), eq(currentSlots.user_id, userId))
			);
	}

	async setCurrentVote(
		userId: number,
		presentationId: number,
		category: Category,
		voteId: number
	): Promise<undefined> {
		this.db
			.update(currentVotes)
			.set({ vote_id: voteId })
			.where(
				and(
					eq(currentVotes.user_id, userId),
					eq(currentVotes.presenation_id, presentationId),
					eq(currentVotes.category, category)
				)
			);
	}
}
