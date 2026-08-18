import { NextResponse } from "next/server";
import { Rejected, type Action } from "@/lib/engine";
import { dispatch, getRoom } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;
  if (!getRoom(code)) {
    return NextResponse.json({ error: "NO_ROOM" }, { status: 404 });
  }
  let action: Action;
  try {
    action = (await req.json()) as Action;
  } catch {
    return NextResponse.json({ error: "BAD_JSON" }, { status: 400 });
  }
  try {
    const room = dispatch(code, action);
    return NextResponse.json({ room });
  } catch (err) {
    if (err instanceof Rejected) {
      // Lời từ chối là copy hiển thị thẳng trong toast đỏ.
      return NextResponse.json({ error: "REJECTED", message: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}
