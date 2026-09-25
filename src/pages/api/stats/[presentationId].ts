import type { APIRoute } from "astro";
import { statsService } from "$lib/server";
import { authorizeStats } from "$lib/server/stats-access";

export const GET: APIRoute = async ({ cookies, params }) => {
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

  const presentationId = Number(params.presentationId);
  if (!Number.isSafeInteger(presentationId) || presentationId < 0) {
    return Response.json(
      { error: "invalid_presentation_id" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const stats = await statsService.getPresentationStats(presentationId);
  if (!stats) {
    return Response.json(
      { error: "presentation_not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(stats, {
    headers: { "Cache-Control": "private, no-store" },
  });
};
