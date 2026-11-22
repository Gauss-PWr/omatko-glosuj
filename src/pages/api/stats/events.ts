import type { APIRoute } from "astro";
import { statsService } from "$lib/server";
import { authorizeStats } from "$lib/server/stats-access";

const POLL_INTERVAL_MS = 1_000;
const KEEP_ALIVE_INTERVAL_MS = 15_000;

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

  let closed = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      let lastEventId: number | undefined;
      let pollCount = 0;
      let polling = false;

      const poll = async () => {
        if (closed || polling) return;
        polling = true;

        try {
          const latestEventId = await statsService.getLatestVoteEventId();
          if (closed) return;
          if (lastEventId === undefined || latestEventId > lastEventId) {
            lastEventId = latestEventId;
            controller.enqueue(
              encoder.encode(
                `id: ${latestEventId}\nevent: refresh\ndata: {}\n\n`,
              ),
            );
          } else if (
            ++pollCount % (KEEP_ALIVE_INTERVAL_MS / POLL_INTERVAL_MS) ===
            0
          ) {
            controller.enqueue(encoder.encode(": keep-alive\n\n"));
          }
        } catch (error) {
          if (!closed) {
            closed = true;
            if (timer) clearInterval(timer);
            controller.error(error);
          }
        } finally {
          polling = false;
        }
      };

      void poll();
      timer = setInterval(() => void poll(), POLL_INTERVAL_MS);
    },
    cancel() {
      closed = true;
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "private, no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
};
