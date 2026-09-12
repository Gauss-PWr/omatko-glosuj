import * as z from 'zod';

export const role = {
	ATTENDEE: 'attende',
	STAFF: 'staff',
	ADMIN: 'admin'
} as const;

export const roleSchema = z.enum(role);

export type Role = (typeof role)[keyof typeof role];

export const user = z.strictObject({
	accessCode: z.string(),
	role: roleSchema
});

export type user = z.infer<typeof user>;

export const userEvent = {
	FOREGROUND: 'foreground',
	BACKGROUND: 'background'
};

export const userEventSchema = z.enum(userEvent);

export type UserEvent = z.infer<typeof userEventSchema>;
