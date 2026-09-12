export const Code = {
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	SESSION_CONFLICT: 'SESSION_ID_CONFLICT',
	SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
	SESSION_EXPIRED: 'SESSION_EXPIRED',
	VOTE_INVALID: 'VOTE_INVALID',
	VOTING_DISABLED: 'VOTING_DISABLED',
	ROUTE_RESTRICTED: 'ROUTE_RESTRICTED'
};

export type Code = (typeof Code)[keyof typeof Code];

export type UserNotFound = {
	code: typeof Code.USER_NOT_FOUND;
};

export type SessionConflict = {
	code: typeof Code.SESSION_CONFLICT;
};

export type SessionNotFound = {
	code: typeof Code.SESSION_NOT_FOUND;
};

export type SessionExpired = {
	code: typeof Code.SESSION_EXPIRED;
};

export type VoteInvalidError = {
	code: typeof Code.VOTE_INVALID;
	message: string;
};

export type VotingDisabled = {
	code: typeof Code.VOTING_DISABLED;
};

export type RouteRestricted = {
	code: typeof Code.ROUTE_RESTRICTED;
};
