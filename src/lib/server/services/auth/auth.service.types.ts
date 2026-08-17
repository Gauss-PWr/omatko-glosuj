import type { Result, Outcome } from '$lib/core/result';

export type LoginCommand = {
	code: string;
};

export type LogoutCommand = {
	sessionId: string;
};

type LoginSuccess = {
	token: string;
	expiresAt: Date;
};

type LoginFailure =
	| {
			code: 'INVALID_CODE';
			message: string;
	  }
	| {
			code: 'AUTH_UNAVAILABLE';
			message: string;
	  };

export type LoginResult = Result<LoginSuccess, LoginFailure>;

type LogoutFailure = {
	code: 'ALREADY_LOGOUT';
};

export type LogoutOutcome = Outcome<LogoutFailure>;
