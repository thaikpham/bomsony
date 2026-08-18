"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Mode } from "@/lib/types";
import { HostFrame } from "@/components/ui/Stage";
import { useLanguage } from "@/lib/i18n";

export function ModeSelect({
  mode,
  onPick,
  onStart,
}: {
  mode: Mode | null;
  onPick: (mode: Mode) => void;
  onStart: () => void;
}) {
  const { lang, t } = useLanguage();

  return (
    <HostFrame>
      <div className="t-title shrink-0 text-accent">{t("appName")}</div>

      <div className="flex min-h-0 flex-1 gap-5">
        <ModeCard
          active={mode === "que"}
          tone="accent"
          tag={mode === "que" ? (lang === "en" ? "SELECTED" : "ĐÃ CHỌN") : (lang === "en" ? "FAST · LOUD" : "NHANH · ỒN")}
          title={
            lang === "en" ? (
              <>FATE HAS<br />DECIDED</>
            ) : (
              <>SỐ TRỜI<br />ĐÃ ĐỊNH</>
            )
          }
          blurb={t("modeQueDesc")}
          unit="100% · 50% · 25%"
          onClick={() => onPick("que")}
        />
        <ModeCard
          active={mode === "tod"}
          tone="danger"
          tag={mode === "tod" ? (lang === "en" ? "SELECTED" : "ĐÃ CHỌN") : (lang === "en" ? "SPICY · FUN" : "CHẬM · CAY")}
          title={
            <>
              TRUTH
              <br />
              OR DRINK
            </>
          }
          blurb={t("modeTodDesc")}
          unit={lang === "en" ? "1–2 sips" : "1–2 ngụm"}
          onClick={() => onPick("tod")}
        />
      </div>

      <div className="flex shrink-0 items-center justify-between">
        <a
          href="/host"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-main border border-line bg-surface px-5 py-[18px] text-[18px] font-black text-text-dim hover:text-accent transition-colors"
        >
          {lang === "en" ? "+ CREATE ANOTHER ROOM" : "+ TẠO PHÒNG KHÁC"}
        </a>
        <button
          type="button"
          disabled={!mode}
          onClick={() => {
            vibrate(HAPTIC.sub);
            onStart();
          }}
          className={`rounded-main px-[34px] py-[18px] text-[24px] font-black ${
            mode ? "bg-accent text-ink" : "bg-surface text-[rgb(245_243_238/0.32)]"
          }`}
        >
          {mode ? t("startBtn") : (lang === "en" ? "SELECT MODE" : "CHỌN ĐI")}
        </button>
      </div>
    </HostFrame>
  );
}

function ModeCard({
  active,
  tone,
  tag,
  title,
  blurb,
  unit,
  onClick,
}: {
  active: boolean;
  tone: "accent" | "danger";
  tag: string;
  title: React.ReactNode;
  blurb: string;
  unit: string;
  onClick: () => void;
}) {
  const bg = active ? (tone === "accent" ? "bg-accent" : "bg-danger") : "bg-surface";
  const border = active
    ? tone === "accent"
      ? "border-accent"
      : "border-danger"
    : "border-line";
  const fg = active ? "text-ink" : "text-text";
  const dim = active ? "text-[rgb(10_10_12/0.6)]" : "text-text-dim";

  return (
    <button
      type="button"
      onClick={() => {
        vibrate(HAPTIC.sub);
        onClick();
      }}
      className={`card-soft flex flex-1 flex-col justify-between rounded-card border-2 p-8 text-left ${bg} ${border}`}
    >
      <div className={`t-label ${dim}`}>{tag}</div>
      <div>
        <div className={`text-[48px] leading-[1.14] font-black tracking-[-0.04em] ${fg}`}>
          {title}
        </div>
        <div className={`t-body mt-4 ${dim}`}>{blurb}</div>
      </div>
      <div className={`text-[20px] font-black opacity-80 ${fg}`}>{unit}</div>
    </button>
  );
}
