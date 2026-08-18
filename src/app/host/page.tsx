import { redirect } from "next/navigation";
import { createRoom } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Mở `/host` hoặc bấm Tạo phòng ➔ Tạo ngay phòng mới và vào thẳng game trên điện thoại. */
export default function NewHostRoom() {
  const room = createRoom();
  redirect(`/j/${room.code}`);
}
