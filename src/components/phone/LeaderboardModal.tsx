"use client";

import type { Player } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { HAPTIC, vibrate } from "@/lib/haptics";

export function LeaderboardModal({
  players,
  onClose,
}: {
  players: Player[];
  onClose: () => void;
}) {
  const sorted = [...players].sort((a, b) => b.totalGlasses - a.totalGlasses);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 animate-[bsRise_0.25s_ease_both]">
      <div className="flex w-full max-w-[420px] max-h-[85dvh] flex-col gap-4 rounded-main border border-line bg-surface p-5 text-text shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-line/60 pb-3">
          <div>
            <div className="text-[22px] font-black text-accent leading-none">BẢNG XẾP HẠNG TỬU LƯỢNG</div>
            <div className="text-[12px] text-text-dim mt-1 font-bold">Xếp theo số ly quy đổi từ nhiều tới ít</div>
          </div>
          <button
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onClose();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[18px] font-bold text-text-dim hover:text-text"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
          {sorted.map((p, idx) => {
            const rank = idx + 1;
            const rankBadge =
              rank === 1 ? "👑 1" : rank === 2 ? "🥈 2" : rank === 3 ? "🥉 3" : `#${rank}`;
            const isTop = rank === 1;

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-card border p-3 transition-colors ${
                  isTop
                    ? "border-accent bg-accent/10 text-text"
                    : "border-line/70 bg-ink/40 text-text-dim"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 text-center text-[15px] font-black ${isTop ? "text-accent" : "text-text-faint"}`}>
                    {rankBadge}
                  </div>
                  <Avatar name={p.name} src={p.avatarUrl} size={42} fontSize={15} />
                  <div className="min-w-0">
                    <div className="text-[16px] font-black text-text truncate">{p.name}</div>
                    <div className="text-[12px] text-text-faint">
                      {p.zodiac ? `${p.zodiac}` : "Bợm"} · Soi đúng {p.detectivePoints} lần
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-[20px] font-black ${isTop ? "text-accent" : "text-text"}`}>
                    {p.totalGlasses.toFixed(2).replace(/\.00$/, "")} LY
                  </div>
                  <div className="text-[11px] font-bold text-text-faint">
                    {p.connected ? "🟢 Trực tuyến" : "⚪ Rớt mạng"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            onClose();
          }}
          className="h-[52px] shrink-0 rounded-sub bg-ink font-black text-[17px] text-accent active:scale-95 transition-transform"
        >
          ĐÓNG BẢNG
        </button>
      </div>
    </div>
  );
}
