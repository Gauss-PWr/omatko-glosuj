import { assert, test as baseTest, describe } from "vitest";
import { createDb, type DrizzleDb } from "$db/index";
import Database from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import type { User } from "$lib/domain/user";
import { users, sessions } from "$db/schema";
import { Auth, encode } from "./auth";
import * as ApiError from "$lib/api/errors";

function setupDb(): DrizzleDb {
  return createDb(new Database());
}

const user: User = {
  accessCode: "user-1",
  role: "attende",
};

const staff: User = {
  accessCode: "user-2",
  role: "staff",
};

const admin: User = {
  accessCode: "user-3",
  role: "admin",
};

const TOKEN = "test-token";
const EXPIRED = "expired-token";

const usersMock = [user, staff, admin];

async function migrateAndInsert(db: DrizzleDb) {
  migrate(db, { migrationsFolder: "drizzle" });
  await db.insert(users).values(
    usersMock.map((usr) => ({
      accessCodeHash: encode(usr.accessCode),
      role: usr.role,
    })),
  );
  await db.insert(sessions).values([
    {
      userId: 1,
      tokenHash: encode(TOKEN),
      role: "attende",
      expiresAt: new Date(Date.now() + 60_000),
    },
    {
      userId: 2,
      tokenHash: encode(EXPIRED),
      role: "attende",
      expiresAt: new Date(Date.now() - 60_000),
    },
  ]);
}

export const test = baseTest
  .extend("db", async () => {
    const db = setupDb();
    await migrateAndInsert(db);
    return db;
  })
  .extend("authService", async ({ db }) => {
    const authService = new Auth(db);
    return authService;
  });

describe("auth service", async () => {
  test("creates user session", async ({ authService }) => {
    const loginResult = await authService.login(user.accessCode);
    assert(loginResult.ok);
  });

  test("rejects wrong code", async ({ authService }) => {
    const loginResult = await authService.login("bad-login");
    assert(!loginResult.ok);
    assert.strictEqual(loginResult.error.code, ApiError.Code.USER_NOT_FOUND);
  });

  test("authorizes logged user", async ({ authService }) => {
    const authResult = await authService.auth(TOKEN);
    assert(authResult.ok);
  });

  test("rejects wrong session token", async ({ authService }) => {
    const authResult = await authService.auth("bad-token");
    assert(!authResult.ok);
    assert.strictEqual(authResult.error.code, ApiError.Code.SESSION_NOT_FOUND);
  });

  test("rejects expired session", async ({ authService }) => {
    const authResult = await authService.auth(EXPIRED);
    assert(!authResult.ok);
    assert.strictEqual(authResult.error.code, ApiError.Code.SESSION_EXPIRED);
  });

  test.for(usersMock)(
    "auth user has correct $role role",
    async (user, { authService }) => {
      const loginResult = await authService.login(user.accessCode);
      assert(loginResult.ok);
      const authResult = await authService.auth(loginResult.value.token);
      assert(authResult.ok);
      assert.strictEqual(authResult.value.role, user.role);
    },
  );

  test("logs out the user", async ({ authService }) => {
    const logoutResult = await authService.logout(TOKEN);
    const authResult = await authService.auth(TOKEN);
    assert(logoutResult.ok);
    assert(!authResult.ok);
  });

  test("rejects logout with bad token", async ({ authService }) => {
    const logoutResult = await authService.logout("bad-token");
    assert(!logoutResult.ok);
    assert.strictEqual(logoutResult.error.code, ApiError.Code.SESSION_NOT_FOUND);
  });
});
