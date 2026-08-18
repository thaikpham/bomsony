import { headers } from "next/headers";
import { HostRoom } from "./HostRoom";

export const dynamic = "force-dynamic";

export default async function HostRoomPage({ params }: PageProps<"/host/[code]">) {
  const { code } = await params;

  // QR phải đúng ngay khung hình đầu — lấy origin từ request thay vì đợi
  // client mount, nếu không cả bàn sẽ quét trúng một mã cũ trong nửa giây đầu.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const upper = code.toUpperCase();

  return <HostRoom code={upper} joinUrl={`${proto}://${host}/j/${upper}`} />;
}
