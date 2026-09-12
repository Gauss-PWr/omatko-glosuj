import * as z from 'zod';

export const category = z.enum(['t_1', 't_2', 'p_1', 'p_2']);

export type Category = z.infer<typeof category>;

export const vote = z.strictObject({
	presentationId: z.int().nonnegative(),
	category,
	score: z
		.int()
		.nonnegative()
		.refine((val) => val <= 5)
});

export type Vote = z.infer<typeof vote>;

export const voteEvents = {
	TALK_PICKED: 'talk_picked',
	SCORE_CAST: 'score_cast',
	VOTE_WITHDRAWN: 'vote_withdrawn'
};

export const voteEventsSchema = z.enum(voteEvents);

export type VoteEvent = z.infer<typeof voteEventsSchema>;
