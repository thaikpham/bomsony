"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import { SAFETY_TOPICS } from "@/lib/types";
import { ChunkyButton } from "@/components/ui/Buttons";

export function SafetyMobile({
  banned,
  onToggle,
  onStart,
}: {
  banned: string[];
  onToggle: (topic: string) => void;
  onStart: () => void;
}) {
  return (
    <>
      <div className="t-label shrink-0 text-danger">CHỐT VÙNG CẤM</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <div className="t-title text-[32px] leading-tight">
          GẠCH CHỦ ĐỀ
          <br />
          KHÔNG MUỐN HỎI
        </div>
        <div className="t-body text-[16px] text-text-dim">
          Thầy Phán sẽ né các chủ đề đã gạch.
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {SAFETY_TOPICS.map((topic) => {
            const isBanned = banned.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  vibrate(HAPTIC.sub);
                  onToggle(topic);
                }}
                className={`card-soft flex h-[64px] items-center justify-between rounded-sub border-2 px-4 text-left font-black transition-colors ${
                  isBanned
                    ? "border-danger bg-danger-surface text-danger-text"
                    : "border-line bg-surface text-text"
                }`}
              >
                <span className="text-[17px]">{topic}</span>
                <span className="text-[20px] font-black">{isBanned ? "✕" : "+"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ChunkyButton
        tone="accent"
        onClick={() => {
          vibrate(HAPTIC.sub);
          onStart();
        }}
      >
        VÀO GAME NAY
      </ChunkyButton>
    </>
  );
}
