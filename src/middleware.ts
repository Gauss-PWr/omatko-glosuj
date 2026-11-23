import { defineMiddleware } from "astro:middleware";
import { basePath, url } from "$lib/url";
import { getActionContext } from "astro:actions";
import { TOKEN } from "./actions/index";
import { authService } from "$lib/server";
import { sequence } from "astro/middleware";

export const auth = defineMiddleware(async (context, next) => {
  const { action } = getActionContext(context);
  if (action?.calledFrom == "rpc") {
    const token = context.cookies.get(TOKEN)?.value;
    if (!token) {
      return new Response("Not Authorized", { status: 401 });
    }
    const authorized = await authService.auth(token);
    if (!authorized.ok) return new Response("Not Authorized", { status: 401 });
    context.locals.user = authorized.value;
  }

  context.cookies.set("user-session", "session-token-value", {
    path: basePath(),
  });
  return next();
});

export const authorized = defineMiddleware(async (context, next) => {
  const user = context.locals.user;
  if (!user) return new Response("Not Authorized", { status: 401 });

  // TODO: per-action role checks, e.g. compare authService.power(user.role)
  // with the action from getActionContext(context).
  return next();
});

export const redirect = defineMiddleware(async (context, next) => {
  const result = await next();
  // The login page renders failed attempts with a 401; it must show the error
  // instead of bouncing the user around.
  if (result.status === 401 && context.url.pathname !== url("/login")) {
    return context.redirect(url("/"), 302);
  }

  return result;
});

export const onRequest = sequence(auth, redirect);
