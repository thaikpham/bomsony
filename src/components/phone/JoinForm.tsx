"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";
import { saveIdentity, useIdentity } from "@/lib/identity";
import { ChunkyButton } from "@/components/ui/Buttons";
import { PhoneShell } from "@/components/ui/Stage";
import { Toast } from "@/components/ui/Toast";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/lib/i18n";

export function JoinForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const stored = useIdentity();
  const { lang, t } = useLanguage();
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [typed, setTyped] = useState<string | null>(null);
  const name = typed ?? stored?.name ?? "";
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const createNewRoom = async (preferredCode?: string) => {
    if (name.trim().length < 1 || busy) return;
    setBusy(true);
    setError(null);
    const identity = saveIdentity(name);
    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: preferredCode }),
      });
      const data = (await res.json()) as { code: string };
      const targetCode = data.code;

      await fetch(`/api/room/${targetCode}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t: "join",
          playerId: identity.id,
          name: identity.name,
          avatarUrl: identity.avatarUrl,
        }),
      });

      vibrate(HAPTIC.drink);
      router.push(`/play/${targetCode}`);
    } catch {
      setError(lang === "en" ? "Failed to create room" : "Không tạo được phòng");
      setBusy(false);
    }
  };

  const join = async () => {
    const trimmedCode = code.trim().toUpperCase();
    if (trimmedCode.length === 0) {
      void createNewRoom();
      return;
    }
    if (name.trim().length < 1 || busy) return;
    setBusy(true);
    setError(null);
    const identity = saveIdentity(name);
    try {
      let res = await fetch(`/api/room/${trimmedCode}/action`, {
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
        const createRes = await fetch("/api/room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: trimmedCode }),
        });
        if (createRes.ok) {
          res = await fetch(`/api/room/${trimmedCode}/action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              t: "join",
              playerId: identity.id,
              name: identity.name,
              avatarUrl: identity.avatarUrl,
            }),
          });
        }
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setError(data.message ?? (lang === "en" ? "Failed to join room" : "Vào không được"));
        setBusy(false);
        return;
      }

      vibrate(HAPTIC.drink);
      router.push(`/play/${trimmedCode}`);
    } catch {
      setError(lang === "en" ? "Connection error" : "Mất mạng rồi");
      setBusy(false);
    }
  };

  return (
    <PhoneShell>
      <div className="flex shrink-0 items-center justify-between pt-1 px-1 w-full">
        <div className="flex flex-col items-start text-left">
          <h1 className="animate-[bsBounce_1.6s_cubic-bezier(0.28,0.84,0.42,1)_infinite] text-[36px] leading-none font-black tracking-[-0.04em] text-accent drop-shadow-[0_6px_20px_rgba(255,230,0,0.45)]">
            BỢM SONY 🍺
          </h1>
          <div className="t-label text-text-faint tracking-[0.15em] text-[10px]">
            {t("tagline")}
          </div>
        </div>
        <LanguageToggle />
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 my-auto">
        <div className="text-[40px] leading-[1.12] font-black tracking-[-0.035em]">
          {lang === "en" ? (
            <>JOIN & DRINK<br />WITH FRIENDS</>
          ) : (
            <>QUÉT XONG<br />THÌ VÀO</>
          )}
        </div>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 5))}
          placeholder={lang === "en" ? "ROOM CODE (OPTIONAL)" : "MÃ PHÒNG (TÙY CHỌN)"}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="h-[76px] shrink-0 rounded-main border border-line bg-surface text-center text-[32px] font-black tracking-[0.08em] text-accent placeholder:text-[18px] placeholder:tracking-[0.05em] placeholder:text-[rgb(245_243_238/0.3)]"
        />
        <input
          value={name}
          onChange={(e) => setTyped(e.target.value.slice(0, 24))}
          placeholder={lang === "en" ? "YOUR NAME" : "TÊN BẠN"}
          autoComplete="name"
          className="h-[76px] shrink-0 rounded-main border border-line bg-surface text-center text-[28px] font-black placeholder:text-[20px] placeholder:tracking-[0.1em] placeholder:text-[rgb(245_243_238/0.3)]"
        />
      </div>

      <div className="flex shrink-0 flex-col gap-2.5 pb-2">
        <ChunkyButton
          tone={name.trim().length >= 1 ? "accent" : "surface"}
          disabled={name.trim().length < 1 || busy}
          onClick={() => void join()}
        >
          {code.trim().length >= 4
            ? (lang === "en" ? "JOIN / CREATE ROOM" : "VÀO BÀN / TẠO BÀN")
            : (lang === "en" ? "CREATE NEW ROOM" : "TẠO PHÒNG MỚI")}
        </ChunkyButton>

        <button
          type="button"
          disabled={name.trim().length < 1 || busy}
          onClick={() => {
            vibrate(HAPTIC.sub);
            void createNewRoom();
          }}
          className="flex h-[52px] shrink-0 items-center justify-center rounded-sub border border-line bg-surface text-[15px] font-black text-accent active:scale-95 transition-transform"
        >
          🍺 {lang === "en" ? "CREATE ROOM (AUTO CODE)" : "TẠO PHÒNG MỚI (MÃ TỰ ĐỘNG)"}
        </button>
      </div>

      <Toast value={error ? { text: error, kind: "deny" } : null} />
    </PhoneShell>
  );
}
