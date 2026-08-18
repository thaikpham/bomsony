import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HostRoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  redirect(`/j/${code.toUpperCase()}`);
}
