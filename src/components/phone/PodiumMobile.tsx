"use client";

import type { Player } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { ChunkyButton } from "@/components/ui/Buttons";
import { HAPTIC, vibrate } from "@/lib/haptics";

export function PodiumMobile({
  players,
  onNewGame,
}: {
  players: Player[];
  onNewGame: () => void;
}) {
  const sorted = [...players].sort((a, b) => b.totalGlasses - a.totalGlasses);
  const [first, second, third] = sorted;
  const detective = [...players].sort((a, b) => b.detectivePoints - a.detectivePoints)[0];

  return (
    <>
      <div className="t-label shrink-0 text-accent">BỢM CỦA ĐÊM</div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Khối bục 3 vị trí đứng hàng dọc / ngang trên phone */}
        <div className="flex flex-1 items-end justify-center gap-3 pt-4">
          {/* Hạng 2 */}
          <div className="flex h-[70%] flex-1 flex-col items-center justify-end gap-2 rounded-card border border-line bg-surface p-3 text-center">
            <Avatar name={second?.name ?? "?"} src={second?.avatarUrl} size={48} fontSize={16} />
            <div className="text-[14px] font-bold truncate w-full">{second?.name ?? "—"}</div>
            <div className="text-[20px] font-black text-text-dim">{second ? second.totalGlasses.toFixed(1) : 0} LY</div>
            <div className="text-[12px] font-black text-text-faint">HẠNG 2</div>
          </div>

          {/* Hạng 1 */}
          <div className="flex h-[100%] flex-[1.2] flex-col items-center justify-end gap-2 rounded-card border-2 border-accent bg-accent p-3 text-center text-ink shadow-lg">
            <Avatar name={first?.name ?? "?"} src={first?.avatarUrl} size={64} fontSize={22} dark />
            <div className="text-[18px] font-black truncate w-full">{first?.name ?? "—"}</div>
            <div className="text-[32px] font-black leading-none">{first ? first.totalGlasses.toFixed(1) : 0} LY</div>
            <div className="text-[12px] font-black opacity-75">BỢM CỦA ĐÊM</div>
          </div>

          {/* Hạng 3 */}
          <div className="flex h-[58%] flex-1 flex-col items-center justify-end gap-2 rounded-card border border-line bg-surface p-3 text-center">
            <Avatar name={third?.name ?? "?"} src={third?.avatarUrl} size={44} fontSize={14} />
            <div className="text-[14px] font-bold truncate w-full">{third?.name ?? "—"}</div>
            <div className="text-[18px] font-black text-text-dim">{third ? third.totalGlasses.toFixed(1) : 0} LY</div>
            <div className="text-[12px] font-black text-text-faint">HẠNG 3</div>
          </div>
        </div>

        {/* Thông tin Soi đúng nhiều nhất */}
        {detective && detective.detectivePoints > 0 ? (
          <div className="rounded-sub border border-line bg-surface p-3.5 text-center text-[15px] font-bold text-text-dim">
            🕵️ <span className="text-safe font-black">{detective.name}</span> soi đúng <span className="text-safe font-black">{detective.detectivePoints}</span> lần!
          </div>
        ) : null}
      </div>

      <ChunkyButton
        tone="accent"
        onClick={() => {
          vibrate(HAPTIC.sub);
          onNewGame();
        }}
      >
        VÒNG MỚI 🔄
      </ChunkyButton>
    </>
  );
}
