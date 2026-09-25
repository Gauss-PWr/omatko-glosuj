import type { Result } from "$lib/core/result";
import { Err, Ok } from "$lib/core/result";
import * as AppError from "../../api/errors";
import type { Role } from "$lib/domain/user";
import { type DrizzleDb } from "db";
import { createHash, randomBytes } from "node:crypto";
import { sessions } from "$db/schema";
import { eq } from "drizzle-orm";

const EXPIRES_AT = 12 * 60 * 60 * 1000; //12h

export type Session = {
  token: string;
  userId: number;
  role: Role;
  expiresAt: Date;
};

export function encode(text: string): Buffer {
  const hash = createHash("sha256");
  return hash.update(text).digest();
}

export class Auth {
  constructor(private readonly db: DrizzleDb) {}

  async login(
    code: string,
  ): Promise<
    Result<
      Pick<Session, "token" | "expiresAt" | "userId" | "role">,
      AppError.UserNotFound
    >
  > {
    const codeHash = encode(code);
    const getUser = await this.db.query.users.findFirst({
      where: { accessCodeHash: { eq: codeHash } },
      columns: {
        id: true,
        role: true,
      },
    });
    if (!getUser) return Err({ code: AppError.Code.USER_NOT_FOUND });

    const token = randomBytes(32).toString("base64url");
    const tokenHash = encode(token);
    const expiresAt = new Date(Date.now() + EXPIRES_AT);
    await this.db.insert(sessions).values({
      tokenHash,
      userId: getUser.id,
      role: getUser.role,
      expiresAt,
    });

    //if insert fails it throws

    return Ok({
      token,
      userId: getUser.id,
      role: getUser.role,
      expiresAt,
    });
  }

  async auth(
    token: string,
  ): Promise<
    Result<
      { userId: number; role: Role },
      AppError.SessionNotFound | AppError.SessionExpired
    >
  > {
    const tokenHash = encode(token);
    const result = await this.db.query.sessions.findFirst({
      where: { tokenHash: { eq: tokenHash } },
      columns: {
        userId: true,
        role: true,
        expiresAt: true,
      },
    });
    if (!result) return Err({ code: AppError.Code.SESSION_NOT_FOUND });

    const authTime = Date.now();

    if (result.expiresAt.getTime() < authTime)
      return Err({ code: AppError.Code.SESSION_EXPIRED });

    return Ok({ userId: result.userId, role: result.role });
  }

  async logout(
    token: string,
  ): Promise<Result<undefined, AppError.SessionNotFound>> {
    const tokenHash = encode(token);
    const [result] = await this.db
      .delete(sessions)
      .where(eq(sessions.tokenHash, tokenHash))
      .returning({ tokenHash: sessions.tokenHash });
    if (!result) return Err({ code: AppError.Code.SESSION_NOT_FOUND });

    return Ok();
  }
}
