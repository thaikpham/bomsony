import { getRoom, subscribe } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Broadcast tới tất cả phone + host cùng lúc. Mục tiêu latency < 300ms —
 * trên mức đó cảm giác "cả bàn cùng lúc" bị mất, nên đẩy thẳng qua SSE thay vì
 * cho client poll.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  const room = getRoom(code);
  if (!room) return new Response("NO_ROOM", { status: 404 });

  const encoder = new TextEncoder();
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          cleanup();
        }
      };
      const cleanup = () => {
        clearInterval(heartbeat);
        unsubscribe?.();
        unsubscribe = undefined;
      };

      send({ room });
      unsubscribe = subscribe(code, (next) => send({ room: next }));
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup();
        }
      }, 20000);

      req.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      clearInterval(heartbeat);
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
