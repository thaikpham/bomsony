"use client";

import { useEffect, useState } from "react";
import type { Troll } from "@/lib/types";

/** Reaction sống trên màn hình lớn bao lâu. */
const TROLL_LIFE_MS = 2500;

/**
 * Hàng đợi reaction bay lên màn hình lớn. Gửi troll không giới hạn — đây là chỗ
 * người chơi xả trong lúc chờ, nên nó nằm đè lên mọi màn host.
 */
export function TrollLayer({ trolls }: { trolls: Troll[] }) {
  // Danh sách sống được suy thẳng từ props; state duy nhất là nhịp đồng hồ,
  // chỉ chạy khi đang có reaction trên màn.
  const [now, setNow] = useState(0);
  const newest = trolls.length ? trolls[trolls.length - 1].at : 0;

  useEffect(() => {
    if (!newest) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 400);
    return () => clearInterval(timer);
  }, [newest]);

  const live = now ? trolls.filter((t) => now - t.at < TROLL_LIFE_MS).slice(-8) : [];
  if (live.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {live.map((t, i) => (
        <div
          key={t.id}
          style={{ left: `${8 + ((i * 13) % 78)}%` }}
          className="absolute bottom-8 animate-[bsRise_2.4s_ease-out_both] rounded-chip bg-accent px-5 py-3 text-[28px] font-black text-ink"
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
