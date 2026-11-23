import { defineAction, ActionError } from "astro:actions";
import { basePath } from "$lib/url";
import { authService, votingService } from "$lib/server";
import * as AppError from "$lib/api/errors";
import type { ActionAPIContext } from "astro:actions";
import { z } from "astro/zod";
import { getLogger } from "@logtape/logtape";

export const TOKEN = "omatko-token";
const logger = getLogger(["server", "actions"]);

function requireUser(context: ActionAPIContext): { userId: number } {
  const user = context.locals.user;
  if (!user) {
    throw new ActionError({ code: "UNAUTHORIZED", message: "Zaloguj się" });
  }
  return user;
}

type VoteOutcome =
  | { ok: true }
  | {
      ok: false;
      error: AppError.VotingDisabled | AppError.VoteInvalidError;
    };

function unwrapVote(result: VoteOutcome) {
  if (result.ok) return { ok: true as const };
  if (result.error.code === AppError.Code.VOTING_DISABLED) {
    throw new ActionError({
      code: "FORBIDDEN",
      message: "Głosowanie zostało zakończone",
    });
  }
  if ("message" in result.error) logger.warn(result.error.message);
  throw new ActionError({
    code: "BAD_REQUEST",
    message: "Nieprawidłowy głos",
  });
}

export const server = {
  login: defineAction({
    accept: "form",
    input: z.strictObject({
      code: z.string().trim().length(6),
    }),
    handler: async (input, context) => {
      const loginResult = await authService.login(input.code);
      if (!loginResult.ok) {
        logger.error(loginResult.error);
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Kod jest niepoprawny lub zawiera błędy",
        });
      }
      context.cookies.set(TOKEN, loginResult.value.token, {
        sameSite: "strict",
        secure: import.meta.env.PROD,
        httpOnly: true,
        path: basePath(),
        expires: loginResult.value.expiresAt,
      });
      return { userId: loginResult.value.userId, role: loginResult.value.role };
    },
  }),
  logout: defineAction({
    handler: async (input, context) => {
      const token = context.cookies.get(TOKEN)?.value;
      if (token !== undefined) {
        await authService.logout(token);
        context.cookies.delete(TOKEN, { path: basePath() });
      }

      return {};
    },
  }),
  pickTalk: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
    }),
    handler: async ({ presentationId }, context) => {
      const { userId } = requireUser(context);
      return unwrapVote(await votingService.pickTalk(userId, presentationId));
    },
  }),
  unpickTalk: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
    }),
    handler: async ({ presentationId }, context) => {
      const { userId } = requireUser(context);
      return unwrapVote(await votingService.unpickTalk(userId, presentationId));
    },
  }),
  vote: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
      category: z.enum(["t_1", "t_2", "p_1", "p_2"]),
      score: z.number().int().min(0).max(5),
    }),
    handler: async (input, context) => {
      const { userId } = requireUser(context);
      return unwrapVote(await votingService.vote(userId, input));
    },
  }),
  resetVote: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
    }),
    handler: async ({ presentationId }, context) => {
      const { userId } = requireUser(context);
      return unwrapVote(await votingService.resetVotes(userId, presentationId));
    },
  }),
};
