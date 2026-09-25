import { drizzle, type SQLiteBunTransaction } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { relations } from "./relations";

export function createDb(client: Database) {
  return drizzle({ client, relations });
}

export type DrizzleDb = ReturnType<typeof createDb>;
export type DrizzleTx = SQLiteBunTransaction<typeof relations>;

function databaseUrl(): string {
  const url = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;
  if (url) return url;
  if (import.meta.env.DEV) return "./data/app.db";
  throw new Error("DATABASE_URL is not set");
}

export const db = createDb(new Database(databaseUrl()));
