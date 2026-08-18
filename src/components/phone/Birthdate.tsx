"use client";

import { useState } from "react";
import { lifePathOf, zodiacOf, getZodiacName } from "@/lib/zodiac";
import { ChunkyButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";

export function Birthdate({ onSubmit }: { onSubmit: (iso: string) => void }) {
  const [value, setValue] = useState("");
  const { lang, t } = useLanguage();
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(value);

  return (
    <>
      <div className="t-label shrink-0 text-text-faint">{t("modeQueTitle")}</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">
        <div className="text-[48px] leading-[1.12] font-black tracking-[-0.035em] text-accent">
          {t("birthdateTitle")}
        </div>
        <input
          type="date"
          value={value}
          max="2011-12-31"
          min="1920-01-01"
          onChange={(e) => setValue(e.target.value)}
          className="h-[88px] shrink-0 rounded-main border border-line bg-surface px-5 text-center text-[24px] font-black text-accent"
        />
        <div className="t-body text-[rgb(245_243_238/0.55)]">
          {ok
            ? `${getZodiacName(zodiacOf(value), lang)} · ${t("lifePathLabel")} ${lifePathOf(value)}`
            : t("birthdateSub")}
        </div>
      </div>

      <ChunkyButton
        tone={ok ? "accent" : "surface"}
        disabled={!ok}
        onClick={() => onSubmit(value)}
      >
        {t("birthdateBtn")}
      </ChunkyButton>
    </>
  );
}
