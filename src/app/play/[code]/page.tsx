import { PlayRoom } from "./PlayRoom";

export const dynamic = "force-dynamic";

export default async function PlayPage({ params }: PageProps<"/play/[code]">) {
  const { code } = await params;
  return <PlayRoom code={code.toUpperCase()} />;
}
