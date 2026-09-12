// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Code } from '$lib/api/errors';
import type { Role } from '$lib/domain/user';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			code: Code;
			message: string;
		}
		interface Locals {
			role: Role;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
