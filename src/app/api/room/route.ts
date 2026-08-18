import { NextResponse } from "next/server";
import { createRoom } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: string };
  const room = createRoom(body.code);
  return NextResponse.json({ code: room.code, room });
}
