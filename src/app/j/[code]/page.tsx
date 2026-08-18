import { JoinForm } from "@/components/phone/JoinForm";

/** Link sau QR — mã phòng điền sẵn, người chơi chỉ gõ tên. */
export default async function JoinWithCodePage({ params }: PageProps<"/j/[code]">) {
  const { code } = await params;
  return <JoinForm initialCode={code} />;
}
