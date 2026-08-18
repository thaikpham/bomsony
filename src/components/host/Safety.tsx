"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import { SAFETY_TOPICS } from "@/lib/types";
import { HostFrame } from "@/components/ui/Stage";

/**
 * Host · chốt vùng cấm — bắt buộc trước Truth or Drink.
 *
 * Handoff liệt kê màn này ở "Not yet designed" (bản v1 có `2f`, chưa dọn), nên
 * đây là bản dựng theo hệ thống mới: 3 khối, 1 màu nhấn, 1 câu văn duy nhất.
 * Luật thì đã chốt — danh sách 8 chủ đề và 2 mục gạch sẵn lấy nguyên từ handoff.
 */
export function Safety({
  banned,
  onToggle,
  onStart,
}: {
  banned: string[];
  onToggle: (topic: string) => void;
  onStart: () => void;
}) {
  return (
    <HostFrame>
      <div className="t-title shrink-0 text-accent">VÙNG CẤM</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">
        <div className="grid grid-cols-4 gap-4">
          {SAFETY_TOPICS.map((topic) => {
            const off = banned.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  vibrate(HAPTIC.sub);
                  onToggle(topic);
                }}
                className={`card-soft flex h-[92px] items-center justify-center rounded-card border-2 px-4 text-center text-[24px] leading-[1.16] font-black ${
                  off
                    ? "border-line bg-surface text-[rgb(245_243_238/0.3)] line-through"
                    : "border-accent bg-accent text-ink"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
        <div className="t-body text-text-dim">Gạch cái nào thì Thầy Phán không hỏi tới.</div>
      </div>

      <div className="flex shrink-0 justify-end">
        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            onStart();
          }}
          className="rounded-main bg-accent px-[34px] py-[18px] text-[24px] font-black text-ink"
        >
          VÀO GAME
        </button>
      </div>
    </HostFrame>
  );
}
