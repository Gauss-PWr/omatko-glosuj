import { randomBytes } from 'node:crypto';
import type { AuthRepository } from './auth.repository';
import type { LoginCommand, LoginResult, LogoutCommand } from './auth.service.types';

export class AuthService {
	authRepo: AuthRepository;
	constructor(authRepo: AuthRepository) {
		this.authRepo = authRepo;
	}

	login(command: LoginCommand): LoginResult {
		const result = this.authRepo.getUserByCode(command.code);

		if (!result.ok) {
			return {
				ok: false,
				error: {
					code: result.error,
					message: 'Invalid login code'
				}
			};
		}
		const userId = result.value.id;
		const role = result.value.role;
		const sessionId = randomBytes(32).toString('hex');
		const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

		for (let attempt = 0; attempt < 3; attempt++) {
			const sessionResult = this.authRepo.setUserSession(userId, sessionId, expiresAt);
			if (sessionResult.ok) return { ok: true, value: { token: sessionId, expiresAt, role } };

			if (sessionResult.error !== 'SESSION_ID_CONFLICT') break;
		}

		return {
			ok: false,
			error: {
				code: 'AUTH_UNAVAILABLE',
				message: 'Could not create session'
			}
		};
	}

	logout(command: LogoutCommand) {
		this.authRepo.deleteUserSession(command.sessionId);
	}

	auth(command: AuthCommand): AuthResult {
		const result = this.authRepo.checkUserSession(command.sessionId);
	}
}

type AuthCommand = {
	sessionId: string;
};
