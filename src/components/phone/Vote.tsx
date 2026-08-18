"use client";

import type { ReactNode } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Player, VoteValue } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { ChunkyButton, VoteButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";

export function VoteHeader({
  spotlight,
  question,
}: {
  spotlight: Player | null;
  question: string | null;
}) {
  const { lang } = useLanguage();
  return (
    <>
      <div className="flex shrink-0 items-center gap-3.5">
        <Avatar name={spotlight?.name ?? "?"} src={spotlight?.avatarUrl} size={52} fontSize={18} />
        <div className="text-[22px] leading-[1.18] font-black tracking-[-0.02em]">
          {spotlight?.name ?? (lang === "en" ? "Someone" : "Ai đó")} {lang === "en" ? "is answering" : "đang khai"}
        </div>
      </div>
      <div className="t-body shrink-0 text-[rgb(245_243_238/0.65)] [text-wrap:pretty]">
        {question}
      </div>
    </>
  );
}

export function VoteChoice({ onVote }: { onVote: (value: VoteValue) => void }) {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end gap-3.5">
      <VoteButton tone="safe" onClick={() => onVote("tin")}>
        {t("voteTin")}
      </VoteButton>
      <VoteButton tone="danger" onClick={() => onVote("doi")}>
        {t("voteDoi")}
      </VoteButton>
    </div>
  );
}

export function VoteCount({ tin, doi }: { tin: number; doi: number }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex gap-2">
        <Dot />
        <Dot delay="0.18s" />
        <Dot delay="0.36s" />
      </div>
      <div className="flex items-baseline gap-6">
        <Big count={tin} label={t("voteTin")} className="text-safe" />
        <Big count={doi} label={t("voteDoi")} className="text-danger" />
      </div>
    </div>
  );
}

export function VoteResult({
  correct,
  line,
  onTroll,
}: {
  correct: boolean;
  line: string;
  onTroll: (label: string) => void;
}) {
  const { lang } = useLanguage();
  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-5">
        <div
          className={`animate-[bsPop_0.3s_cubic-bezier(0.2,1.5,0.4,1)_both] t-display ${
            correct ? "text-danger" : "text-text-dim"
          }`}
        >
          {correct ? (
            lang === "en" ? <>CAUGHT<br />LIE!</> : <>BẮT<br />ĐƯỢC</>
          ) : (
            lang === "en" ? <>MISSED<br />DETECTIVE</> : <>SOI<br />HỤT</>
          )}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.6)] [text-wrap:pretty]">{line}</div>
      </div>
      <div className="flex shrink-0 gap-2.5">
        {(lang === "en" ? ["CHEERS!", "COWARD", "FAKE!"] : ["DZÔ!", "HÈN", "BỊA DỞ"]).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              vibrate(HAPTIC.chip);
              onTroll(label);
            }}
            className="btn-soft h-[66px] flex-1 rounded-sub border border-line bg-surface text-[17px] active:scale-92 font-black"
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export function PhoneWait({
  label,
  title,
  line,
  cta,
}: {
  label: string;
  title: ReactNode;
  line: string;
  cta?: { text: string; onClick: () => void };
}) {
  return (
    <>
      <div className="t-label shrink-0 text-text-faint">{label}</div>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-5">
        <div className="text-[52px] leading-[1.12] font-black tracking-[-0.035em] text-accent">
          {title}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.55)] [text-wrap:pretty]">{line}</div>
      </div>
      {cta ? (
        <ChunkyButton tone="surface" height={72} fontSize={20} onClick={cta.onClick}>
          {cta.text}
        </ChunkyButton>
      ) : null}
    </>
  );
}

function Dot({ delay }: { delay?: string }) {
  return (
    <span
      style={{ animationDelay: delay }}
      className="h-3 w-3 animate-[bsPulse_1.1s_ease-in-out_infinite] rounded-full bg-accent"
    />
  );
}

function Big({
  count,
  label,
  className,
}: {
  count: number;
  label: string;
  className: string;
}) {
  return (
    <div className={className}>
      <div className="text-[80px] leading-none font-black tabular-nums">{count}</div>
      <div className="t-label">{label}</div>
    </div>
  );
}
