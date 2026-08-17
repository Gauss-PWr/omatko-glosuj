import type { Outcome, Result } from '$lib/core/result';
import type { Role } from '$lib/domain/user';

type AuthenticatedUser = {
	id: number;
	role: Role;
};

export interface AuthRepository {
	getUserByCode(code: string): Result<AuthenticatedUser, 'INVALID_CODE'>;
	setUserSession(
		userId: number,
		sessionId: string,
		expiresAt: Date
	): Outcome<'USER_NOT_FOUND' | 'SESSION_ID_CONFLICT'>;
	checkUserSession(
		sessionId: string
	): Result<AuthenticatedUser, 'SESSION_NOT_FOUND' | 'SESSION_EXPIRED'>;
	deleteUserSession(sessionId: string): Outcome<never>;
}
