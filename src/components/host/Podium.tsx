"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Player } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { HostFrame } from "@/components/ui/Stage";
import { useLanguage } from "@/lib/i18n";

export function Podium({
  players,
  onNewGame,
}: {
  players: Player[];
  onNewGame: () => void;
}) {
  const { lang, t } = useLanguage();
  const ranked = [...players].sort((a, b) => b.totalGlasses - a.totalGlasses).slice(0, 3);
  const [first, second, third] = ranked;
  const detective = [...players].sort((a, b) => b.detectivePoints - a.detectivePoints)[0];

  return (
    <HostFrame>
      <div className="t-title shrink-0 text-accent">{t("bomOfTheNight")}</div>

      <div className="flex min-h-0 flex-1 items-end gap-5">
        <Step player={second} height="62%" />
        <Winner player={first} />
        <Step player={third} height="48%" />
      </div>

      <div className="flex shrink-0 items-center justify-between">
        <div className="t-body text-text-dim">
          {detective && detective.detectivePoints > 0
            ? (lang === "en"
                ? `${detective.name} spotted lies correctly ${detective.detectivePoints} times. Order water for them!`
                : `${detective.name} soi đúng ${detective.detectivePoints} lần. Gọi nước lọc đi.`)
            : (lang === "en" ? "Order some water for the room!" : "Gọi nước lọc đi.")}
        </div>
        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            onNewGame();
          }}
          className="rounded-main border border-line bg-surface px-[34px] py-[18px] text-[24px] font-black"
        >
          {t("newGameBtn")}
        </button>
      </div>
    </HostFrame>
  );
}

function Winner({ player }: { player?: Player }) {
  if (!player) return <div className="flex-[1.15]" />;
  return (
    <div className="flex h-full flex-[1.15] animate-[bsPop_0.5s_cubic-bezier(0.2,1.5,0.4,1)_both] flex-col items-center justify-end gap-4 rounded-card bg-accent p-7 text-ink">
      <Avatar name={player.name} src={player.avatarUrl} size={88} fontSize={26} dark />
      <div className="t-title tracking-[-0.02em]">{player.name}</div>
      <div className="text-[96px] leading-[0.86] font-black tracking-[-0.05em] tabular-nums">
        {player.totalGlasses.toFixed(1)}
      </div>
    </div>
  );
}

function Step({ player, height }: { player?: Player; height: string }) {
  if (!player) return <div className="flex-1" />;
  return (
    <div
      style={{ height }}
      className="flex flex-1 flex-col items-center justify-end gap-3.5 rounded-card bg-surface p-6"
    >
      <Avatar name={player.name} src={player.avatarUrl} size={66} fontSize={20} />
      <div className="text-[24px] font-black">{player.name}</div>
      <div className="text-[36px] leading-none font-black text-text-dim tabular-nums">
        {player.totalGlasses.toFixed(1)}
      </div>
    </div>
  );
}
