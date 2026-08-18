"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import { SAFETY_TOPICS, getSafetyTopicLabel } from "@/lib/types";
import { HostFrame } from "@/components/ui/Stage";
import { useLanguage } from "@/lib/i18n";

export function Safety({
  banned,
  onToggle,
  onStart,
}: {
  banned: string[];
  onToggle: (topic: string) => void;
  onStart: () => void;
}) {
  const { lang, t } = useLanguage();

  return (
    <HostFrame>
      <div className="t-title shrink-0 text-accent">{t("safetyTitle")}</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-5">
        <div className="grid grid-cols-4 gap-4">
          {SAFETY_TOPICS.map((topic) => {
            const off = banned.includes(topic);
            const label = getSafetyTopicLabel(topic, lang);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  vibrate(HAPTIC.sub);
                  onToggle(topic);
                }}
                className={`card-soft flex h-[92px] items-center justify-center rounded-card border-2 px-4 text-center text-[22px] leading-[1.16] font-black ${
                  off
                    ? "border-line bg-surface text-[rgb(245_243_238/0.3)] line-through"
                    : "border-accent bg-accent text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="t-body text-text-dim">{t("safetyInstruction")}</div>
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
          {t("confirmSafety")}
        </button>
      </div>
    </HostFrame>
  );
}
