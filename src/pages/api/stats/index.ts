import type { APIRoute } from "astro";
import { statsService } from "$lib/server";
import { authorizeStats } from "$lib/server/stats-access";

export const GET: APIRoute = async ({ cookies }) => {
  const access = await authorizeStats(cookies.get("omatko-token")?.value);
  if (!access.authorized) {
    return Response.json(
      { error: access.status === 401 ? "unauthorized" : "forbidden" },
      {
        status: access.status,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return Response.json(await statsService.getOverview(), {
    headers: { "Cache-Control": "private, no-store" },
  });
};
