"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import { SAFETY_TOPICS, getSafetyTopicLabel } from "@/lib/types";
import { ChunkyButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";

export function SafetyMobile({
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
    <>
      <div className="t-label shrink-0 text-danger">{t("safetyTitle")}</div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
        <div className="t-title text-[28px] leading-tight">
          {t("safetySub")}
        </div>
        <div className="t-body text-[14px] text-text-dim">
          {t("safetyInstruction")}
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {SAFETY_TOPICS.map((topic) => {
            const isBanned = banned.includes(topic);
            const label = getSafetyTopicLabel(topic, lang);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => {
                  vibrate(HAPTIC.sub);
                  onToggle(topic);
                }}
                className={`card-soft flex h-[58px] items-center justify-between rounded-sub border-2 px-3 text-left font-black transition-colors ${
                  isBanned
                    ? "border-danger bg-danger-surface text-danger-text"
                    : "border-line bg-surface text-text"
                }`}
              >
                <span className="text-[15px] truncate mr-1">{label}</span>
                <span className="text-[18px] font-black">{isBanned ? "✕" : "+"}</span>
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
        {t("confirmSafety")}
      </ChunkyButton>
    </>
  );
}
