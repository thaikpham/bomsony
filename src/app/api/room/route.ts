import { NextResponse } from "next/server";
import { createRoom } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST() {
  const room = createRoom();
  return NextResponse.json({ code: room.code, room });
}
