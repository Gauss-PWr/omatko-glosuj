import { db } from '$lib/server/db';
import { Auth } from './modules/auth';
import { VoteSerivce } from './modules/votes';

export const authService = new Auth(db);
export const votingService = new VoteSerivce(db);
