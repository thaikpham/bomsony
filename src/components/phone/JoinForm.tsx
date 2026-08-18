"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";
import { saveIdentity, useIdentity } from "@/lib/identity";
import { ChunkyButton } from "@/components/ui/Buttons";
import { PhoneShell } from "@/components/ui/Stage";
import { Toast } from "@/components/ui/Toast";

/**
 * Phone · vào phòng.
 *
 * Production đăng nhập Google để lấy tên + avatar Gmail thật. Ở đây nhập tay:
 * hình dạng dữ liệu giữ nguyên (`id` · `name` · `avatarUrl`) nên cắm OAuth vào
 * chỉ cần đổi `src/lib/identity.ts`.
 */
export function JoinForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const stored = useIdentity();
  const [code, setCode] = useState(initialCode.toUpperCase());
  // `null` = chưa gõ gì; hiện tên đã lưu lần trước, gõ đè thì thắng.
  const [typed, setTyped] = useState<string | null>(null);
  const name = typed ?? stored?.name ?? "";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ready = code.trim().length === 5 && name.trim().length >= 1;

  const join = async () => {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    const identity = saveIdentity(name);
    const room = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/room/${room}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t: "join",
          playerId: identity.id,
          name: identity.name,
          avatarUrl: identity.avatarUrl,
        }),
      });
      if (res.status === 404) {
        setError("Không có phòng này");
        setBusy(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setError(data.message ?? "Vào không được");
        setBusy(false);
        return;
      }
      vibrate(HAPTIC.drink);
      router.push(`/play/${room}`);
    } catch {
      setError("Mất mạng rồi");
      setBusy(false);
    }
  };

  return (
    <PhoneShell>
      <div className="t-label shrink-0 text-accent">BỢM SONY</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">
        <div className="text-[56px] leading-[1.12] font-black tracking-[-0.035em]">
          QUÉT XONG
          <br />
          THÌ VÀO
        </div>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 5))}
          placeholder="MÃ PHÒNG"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="h-[88px] shrink-0 rounded-main border border-line bg-surface text-center text-[40px] font-black tracking-[0.08em] text-accent placeholder:text-[24px] placeholder:tracking-[0.18em] placeholder:text-[rgb(245_243_238/0.3)]"
        />
        <input
          value={name}
          onChange={(e) => setTyped(e.target.value.slice(0, 24))}
          placeholder="TÊN BẠN"
          autoComplete="name"
          className="h-[88px] shrink-0 rounded-main border border-line bg-surface text-center text-[32px] font-black placeholder:text-[24px] placeholder:tracking-[0.18em] placeholder:text-[rgb(245_243_238/0.3)]"
        />
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <ChunkyButton
          tone={ready ? "accent" : "surface"}
          disabled={!ready || busy}
          onClick={() => void join()}
        >
          VÀO BÀN
        </ChunkyButton>

        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            router.push("/host");
          }}
          className="flex h-[56px] shrink-0 items-center justify-center rounded-sub border border-line bg-surface text-[17px] font-black text-accent active:scale-95 transition-transform"
        >
          🖥️ TẠO PHÒNG MỚI (HOST)
        </button>
      </div>

      <Toast value={error ? { text: error, kind: "deny" } : null} />
    </PhoneShell>
  );
}
