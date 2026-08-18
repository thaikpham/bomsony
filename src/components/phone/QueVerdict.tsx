"use client";

import { useState } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Player, Verdict } from "@/lib/types";
import { getDoseLabel } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { ChunkyButton, SoftButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";
import { getZodiacName } from "@/lib/zodiac";

export function QueVerdict({
  round,
  zodiac,
  lifePath,
  verdict,
  appealUsed,
  pushUsed,
  clash,
  onDrink,
  onAppeal,
  onPush,
  onDuel,
  onFlipLuck,
  onClashResult,
}: {
  round: number;
  zodiac: string | null;
  lifePath: number | null;
  verdict: Verdict;
  appealUsed: boolean;
  pushUsed: boolean;
  clash?: boolean;
  onDrink: () => void;
  onAppeal: () => void;
  onPush: () => void;
  onDuel: () => void;
  onFlipLuck: () => void;
  onClashResult: (win: boolean) => void;
}) {
  const { lang, t } = useLanguage();
  const lineText = lang === "en" ? (verdict.lineEn || verdict.line) : verdict.line;
  const reasonText = lang === "en" ? (verdict.reasonEn || verdict.reason) : verdict.reason;
  const taskText = lang === "en" ? (verdict.taskEn || verdict.task) : verdict.task;
  const chainNoteText = lang === "en" ? (verdict.chainNoteEn || verdict.chainNote) : verdict.chainNote;

  return (
    <>
      <div className="flex shrink-0 items-baseline justify-between">
        <span className="t-label text-text-faint">{t("round")} {round}</span>
        <span className="t-label text-text-faint">
          {getZodiacName(zodiac, lang)} · {lifePath ?? "—"}
        </span>
      </div>

      {clash ? (
        <div className="flex shrink-0 animate-[bsPop_0.3s_ease_both] flex-col gap-2 rounded-card border-2 border-danger bg-danger-surface p-3 text-center">
          <div className="text-[14px] font-black text-danger-text">⚡ {lang === "en" ? "ASTROLOGICAL CLASH!" : "THIÊN ĐỊCH TƯƠNG KHẮC!"}</div>
          <div className="text-[13px] text-text">{lang === "en" ? "Rock Paper Scissors with your clash opponent:" : "Oẳn Tù Tì với đối thủ tương khắc trong bàn:"}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onClashResult(true)}
              className="flex-1 rounded-sub bg-safe py-2 text-[14px] font-black text-ink"
            >
              {lang === "en" ? "WIN (SAFE)" : "THẮNG (THOÁT)"}
            </button>
            <button
              type="button"
              onClick={() => onClashResult(false)}
              className="flex-1 rounded-sub bg-danger py-2 text-[14px] font-black text-white"
            >
              {lang === "en" ? "LOSE (DRINK 100%)" : "THUA (UỐNG 100%)"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[10px]">
        <div
          key={verdict.dose}
          className="t-numeral animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[110px] leading-none text-accent"
        >
          {verdict.dose}%
        </div>
        <div className="text-[28px] leading-[1.12] font-black tracking-[-0.02em]">
          {getDoseLabel(verdict.dose, lang)}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.75)] [text-wrap:pretty]">
          {lineText}
        </div>

        {reasonText ? (
          <div className="rounded-sub border border-accent/40 bg-accent/10 p-3 text-[17px] leading-[1.25] font-black text-accent [text-wrap:pretty]">
            {reasonText}
          </div>
        ) : null}

        {taskText ? (
          <div className="rounded-sub border border-line bg-surface p-2 text-[13px] font-bold text-accent">
            🎭 {taskText}
          </div>
        ) : null}

        {chainNoteText ? (
          <div className="rounded-sub border border-line bg-surface p-2 text-[12px] text-safe font-bold">
            🔗 {chainNoteText}
          </div>
        ) : null}
      </div>

      <ChunkyButton onClick={onDrink}>{t("drinkDone")}</ChunkyButton>

      <div className="flex shrink-0 gap-2">
        <SoftButton onClick={onAppeal}>{appealUsed ? (lang === "en" ? "NO APPEALS" : "HẾT CÃI") : (lang === "en" ? "APPEAL" : "XIN GIẢM")}</SoftButton>
        <SoftButton onClick={onPush} haptic={HAPTIC.push}>
          {pushUsed ? (lang === "en" ? "NO PUSH" : "HẾT ĐẨY") : (lang === "en" ? "PUSH" : "ĐẨY QUA")}
        </SoftButton>
        <SoftButton onClick={onFlipLuck} haptic={HAPTIC.chip}>
          {verdict.flippedLuck ? (lang === "en" ? "FLIPPED" : "ĐÃ LẬT") : (lang === "en" ? "🎲 FLIP" : "🎲 LẬT KÈO")}
        </SoftButton>
        <SoftButton danger width={56} haptic={HAPTIC.duel} onClick={onDuel} className="text-[17px]">
          ×2
        </SoftButton>
      </div>
    </>
  );
}

export function QueDone({
  dose,
  drunkCount,
  totalPlayers,
  onNextRound,
}: {
  dose: number;
  drunkCount?: number;
  totalPlayers?: number;
  onNextRound: () => void;
}) {
  const { lang } = useLanguage();
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-[18px]">
        <div className="flex h-24 w-24 animate-[bsPop_0.4s_cubic-bezier(0.2,1.5,0.4,1)_both] items-center justify-center rounded-full bg-safe text-[44px] font-black text-ink mx-auto">
          ✓
        </div>
        <div className="text-[56px] leading-[1.12] font-black tracking-[-0.035em] text-safe text-center">
          {lang === "en" ? "CHEERS!" : "DZÔ!"}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.6)] text-center">
          {lang === "en" ? `Drank ${dose}%. Everyone witnessed.` : `Đã cạn ${dose}%. Cả bàn thấy rồi.`}
        </div>
        {drunkCount && totalPlayers ? (
          <div className="t-label text-accent font-black text-center">
            {drunkCount} / {totalPlayers} {lang === "en" ? "PLAYERS FINISHED" : "BỢM ĐÃ CẠN LY"}
          </div>
        ) : null}
      </div>
      <ChunkyButton tone="accent" height={80} fontSize={22} onClick={onNextRound}>
        {lang === "en" ? "NEXT ROUND ➔" : "VÒNG TIẾP ➔"}
      </ChunkyButton>
    </>
  );
}

export function PushPick({
  players,
  onPick,
  onCancel,
}: {
  players: Player[];
  onPick: (id: string) => void;
  onCancel: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const { lang } = useLanguage();
  return (
    <>
      <div className="t-label shrink-0 text-danger">{lang === "en" ? "PUSH PENALTY TO WHOM" : "ĐẨY ÁN QUA AI"}</div>
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto">
        {players.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              vibrate(HAPTIC.push);
              onPick(p.id);
            }}
            className="btn-soft h-[64px] shrink-0 justify-start gap-3.5 rounded-sub border border-line bg-surface px-4 text-[20px]"
          >
            <Avatar name={p.name} src={p.avatarUrl} size={40} fontSize={15} />
            {p.name}
          </button>
        ))}
      </div>
      <ChunkyButton tone="surface" height={60} fontSize={18} onClick={onCancel}>
        {lang === "en" ? "CANCEL, I'LL DRINK IT" : "THÔI, TỰ UỐNG"}
      </ChunkyButton>
    </>
  );
}
