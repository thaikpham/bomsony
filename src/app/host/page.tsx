import { redirect } from "next/navigation";
import { createRoom } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Mở `/host` là mở một phòng mới — mã phòng có ngay để QR dựng được. */
export default function NewHostRoom() {
  const room = createRoom();
  redirect(`/host/${room.code}`);
}
