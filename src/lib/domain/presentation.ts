import * as z from 'zod';

export const type = z.enum(['talk', 'poster']).nonoptional();

export const track = z.enum(['applied', 'theory']).optional();

export type Type = z.infer<typeof type>;
export type Track = z.infer<typeof track>;

export const presentation = z.strictObject({
	type,
	slotId: z.int().nonnegative(),
	track,
	title: z.string().nonempty(),
	author: z.string().nonempty(),
	abstract: z.string()
});

export type Presentation = z.infer<typeof presentation>;

export const slot = z.strictObject({
	id: z.int().nonnegative(),
	timestampStart: z.int().positive(),
	timestampEnd: z.int().positive()
});

export type Slot = z.infer<typeof slot>;
