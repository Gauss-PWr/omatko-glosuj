import { db } from "db";
import { Auth } from "./services/auth";
import { VoteService } from "./services/votes";
import { configureLogging } from "./log";

await configureLogging();
export const authService = new Auth(db);
export const votingService = new VoteService(db);
