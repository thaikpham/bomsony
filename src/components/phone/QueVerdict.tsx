"use client";

import { ChunkyButton, SoftButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";
import { getZodiacName } from "@/lib/zodiac";
import type { Player, Verdict } from "@/lib/types";
import { getDoseLabel } from "@/lib/types";

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
  onClashResult?: (win: boolean) => void;
}) {
  const { lang, t } = useLanguage();
  const lineText = lang === "en" ? (verdict.lineEn || verdict.line) : verdict.line;
  const reasonText = lang === "en" ? (verdict.reasonEn || verdict.reason) : verdict.reason;
  const chainNoteText = lang === "en" ? (verdict.chainNoteEn || verdict.chainNote) : verdict.chainNote;

  return (
    <>
      <div className="flex shrink-0 items-center justify-center py-0.5">
        <span className="t-label text-text-faint font-bold tracking-widest text-[12px]">
          ✨ {getZodiacName(zodiac, lang)} · SỐ CHỦ ĐẠO {lifePath ?? "—"} ✨
        </span>
      </div>

      {clash ? (
        <div className="flex shrink-0 animate-[bsPop_0.3s_ease_both] flex-col gap-2 rounded-card border-2 border-danger bg-danger-surface p-3 text-center">
          <div className="text-[14px] font-black text-danger-text">⚡ {lang === "en" ? "ASTROLOGICAL CLASH!" : "THIÊN ĐỊCH TƯƠNG KHẮC!"}</div>
          <div className="text-[13px] text-text">{lang === "en" ? "Rock Paper Scissors with your clash opponent:" : "Oẳn Tù Tì với đối thủ tương khắc trong bàn:"}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onClashResult?.(true)}
              className="flex-1 rounded-sub border border-safe bg-safe/20 py-2 text-[14px] font-black text-safe active:scale-95"
            >
              ✌️ {lang === "en" ? "WON (SIP 25%)" : "THẮNG (NHẤP MÔI)"}
            </button>
            <button
              type="button"
              onClick={() => onClashResult?.(false)}
              className="flex-1 rounded-sub border border-danger bg-danger/20 py-2 text-[14px] font-black text-danger-text active:scale-95"
            >
              🖐️ {lang === "en" ? "LOST (BOTTOM UP)" : "THUA (CẠN LY)"}
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-card border-2 border-accent/40 bg-surface/95 p-5 text-center shadow-[0_0_35px_rgba(255,230,0,0.18)] backdrop-blur-md relative overflow-hidden my-auto">
        <div className="t-numeral animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[84px] font-black text-accent drop-shadow-[0_0_22px_rgba(255,230,0,0.45)] leading-none my-1 tracking-tight">
          {verdict.dose}%
        </div>
        
        <div className="t-label text-accent font-black tracking-widest text-[14px] mb-3 px-4 py-1 rounded-full bg-accent/20 border border-accent/40 inline-flex items-center justify-center shadow-md">
          {getDoseLabel(verdict.dose, lang)}
        </div>

        <div className="text-[24px] font-black text-text leading-snug tracking-tight mb-2 max-w-[95%] mx-auto [text-wrap:pretty]">
          &ldquo;{lineText}&rdquo;
        </div>

        {reasonText ? (
          <div className="text-[14px] text-text-dim mt-1.5 font-medium italic max-w-[90%] mx-auto">
            {reasonText}
          </div>
        ) : null}

        {chainNoteText ? (
          <div className="text-[13px] text-danger-text mt-2 font-bold italic">
            ⛓️ {t("chainTitle")} {chainNoteText}
          </div>
        ) : null}
      </div>

      <ChunkyButton tone="danger" onClick={onDrink}>
        {t("drinkDone", { dose: verdict.dose })}
      </ChunkyButton>

      <div className="flex shrink-0 gap-2">
        <SoftButton
          onClick={onAppeal}
          className={appealUsed ? "opacity-40 pointer-events-none" : ""}
        >
          {t("appealBtn")}
        </SoftButton>
        <SoftButton
          onClick={onPush}
          className={pushUsed ? "opacity-40 pointer-events-none" : ""}
        >
          {t("pushBtn")}
        </SoftButton>
      </div>

      <div className="flex shrink-0 gap-2">
        <SoftButton
          onClick={onFlipLuck}
          className={verdict.flippedLuck ? "opacity-40 pointer-events-none" : ""}
        >
          🎲 {t("flipLuckBtn")}
        </SoftButton>
        <SoftButton danger onClick={onDuel} width={130}>
          ⚔️ 100%
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
  drunkCount: number;
  totalPlayers: number;
  onNextRound?: () => void;
}) {
  const { lang, t } = useLanguage();

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <div className="t-display text-accent animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both]">
          ✓
        </div>
        <div className="t-title text-text mt-2">
          {lang === "en" ? `DRANK ${dose}%` : `ĐÃ XONG ${dose}%`}
        </div>
        <div className="t-body text-text-dim mt-1">
          {lang === "en"
            ? `${drunkCount}/${totalPlayers} players have completed their drinks.`
            : `Đã có ${drunkCount}/${totalPlayers} người cạn ly.`}
        </div>
      </div>
      {onNextRound ? (
        <ChunkyButton tone="accent" height={66} fontSize={22} onClick={onNextRound}>
          {lang === "en" ? "NEXT ROUND" : "VÒNG TIẾP"} ➔
        </ChunkyButton>
      ) : null}
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
  const { lang } = useLanguage();

  return (
    <>
      <div className="t-title text-text shrink-0">
        {lang === "en" ? "SELECT VICTIM TO PUSH PENALTY" : "CHỌN NẠN NHÂN ĐỂ ĐẨY ÁN"}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-2">
        {players.map((p) => (
          <button
            key={p.id}
            type="button"
            className="btn-soft min-h-[64px] shrink-0 justify-between rounded-sub border border-line bg-surface px-4 text-left font-black"
            onClick={() => onPick(p.id)}
          >
            <span className="text-[20px] text-text">{p.name}</span>
            <span className="text-[14px] text-accent">➔ {lang === "en" ? "PUSH PENALTY" : "ĐẨY ÁN"}</span>
          </button>
        ))}
      </div>
      <SoftButton danger onClick={onCancel}>
        {lang === "en" ? "CANCEL" : "HỦY LỆNH"}
      </SoftButton>
    </>
  );
}
