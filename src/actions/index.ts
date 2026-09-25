import { defineAction, ActionError } from "astro:actions";
import { authService } from "$lib/server";
import { z } from "astro/zod";
import { getLogger } from "@logtape/logtape";

const TOKEN = "omatko-token";
const logger = getLogger(["server", "actions"]);

export const server = {
  login: defineAction({
    accept: "form",
    input: z.strictObject({
      code: z.string().length(6),
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
        path: "/",
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
        context.cookies.delete(TOKEN, { path: "/" });
      }

      return {};
    },
  }),
  pickTalk: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
    }),
    handler: async () => {
      return { ok: true as const };
    },
  }),
  unpickTalk: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
    }),
    handler: async () => {
      return { ok: true as const };
    },
  }),
  vote: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
      category: z.enum(["t_1", "t_2", "p_1", "p_2"]),
      score: z.number().int().min(0).max(5),
    }),
    handler: async () => {
      return { ok: true as const };
    },
  }),
  resetVote: defineAction({
    input: z.strictObject({
      presentationId: z.number().int().nonnegative(),
    }),
    handler: async () => {
      return { ok: true as const };
    },
  }),
};
