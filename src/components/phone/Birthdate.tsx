"use client";

import { useState } from "react";
import { lifePathOf, zodiacOf } from "@/lib/zodiac";
import { ChunkyButton } from "@/components/ui/Buttons";

/**
 * Phone · nhập ngày sinh — bước sau khi đăng nhập, chế độ Số trời đã định.
 *
 * "Not yet designed" trong handoff; luật đã chốt (nhập một lần khi vào phòng,
 * suy ra cung hoàng đạo + số chủ đạo). Dựng theo hệ thống 4 cỡ chữ.
 */
export function Birthdate({ onSubmit }: { onSubmit: (iso: string) => void }) {
  const [value, setValue] = useState("");
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(value);

  return (
    <>
      <div className="t-label shrink-0 text-text-faint">SỐ TRỜI ĐÃ ĐỊNH</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">
        <div className="text-[56px] leading-[1.12] font-black tracking-[-0.035em] text-accent">
          NGÀY BẠN
          <br />
          RA ĐỜI
        </div>
        <input
          type="date"
          value={value}
          max="2011-12-31"
          min="1920-01-01"
          onChange={(e) => setValue(e.target.value)}
          className="h-[88px] shrink-0 rounded-main border border-line bg-surface px-5 text-center text-[28px] font-black"
        />
        <div className="t-body text-[rgb(245_243_238/0.55)]">
          {ok
            ? `${zodiacOf(value)} · số chủ đạo ${lifePathOf(value)}. Thầy xem rồi.`
            : "Thầy cần ngày sinh mới phán được."}
        </div>
      </div>

      <ChunkyButton
        tone={ok ? "accent" : "surface"}
        disabled={!ok}
        onClick={() => onSubmit(value)}
      >
        XIN QUẺ
      </ChunkyButton>
    </>
  );
}
