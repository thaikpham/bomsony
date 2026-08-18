import { NextResponse } from "next/server";
import { getRoom } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  const room = getRoom(code);
  if (!room) return NextResponse.json({ error: "NO_ROOM" }, { status: 404 });
  return NextResponse.json({ room });
}
