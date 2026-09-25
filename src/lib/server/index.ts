import { db } from "db";
import { Auth } from "./services/auth";
import { VoteService } from "./services/votes";
import { StatsService } from "./services/stats";
import { configureLogging } from "./log";

await configureLogging();
export const authService = new Auth(db);
export const votingService = new VoteService(db);
export const statsService = new StatsService(db);
