"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import { ChunkyButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";

export function TurnAsk({
  question,
  reversed,
  rage,
  duel,
  immunityUsed,
  onSpeak,
  onSip,
  onImmune,
}: {
  question: string;
  reversed: boolean;
  rage: boolean;
  duel?: boolean;
  immunityUsed: boolean;
  onSpeak: () => void;
  onSip: () => void;
  onImmune: () => void;
}) {
  const { lang } = useLanguage();
  const mult = rage || duel;

  return (
    <>
      <div className="t-label shrink-0 text-danger">
        {reversed
          ? (lang === "en" ? "REVERSED · YOUR TURN" : "NGƯỢC ĐỜI · TỚI LƯỢT BẠN")
          : rage
            ? (lang === "en" ? "ORACLE RAGE · ×2" : "THẦY PHÁN NỔI GIẬN · ×2")
            : duel
              ? (lang === "en" ? "DUEL · ×2" : "ĐẤU TAY ĐÔI · ×2")
              : (lang === "en" ? "YOUR TURN" : "TỚI LƯỢT BẠN")}
      </div>
      <div className="flex min-h-0 flex-1 items-center">
        <div className="animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[36px] leading-[1.28] font-black tracking-[-0.025em] text-accent [text-wrap:pretty]">
          {question}
        </div>
      </div>
      <ChunkyButton tone="safe" onClick={onSpeak} haptic={HAPTIC.sub}>
        {lang === "en" ? "TELL THE TRUTH" : "NÓI THẬT"}
      </ChunkyButton>
      <ChunkyButton tone="accent" onClick={onSip}>
        {mult ? (lang === "en" ? "2 SIPS (PASS)" : "2 NGỤM (NÉ)") : (lang === "en" ? "1 SIP (PASS)" : "1 NGỤM (NÉ)")}
      </ChunkyButton>
      <button
        type="button"
        onClick={() => {
          vibrate(HAPTIC.push);
          onImmune();
        }}
        className="flex h-12 shrink-0 items-center justify-center text-[15px] font-black text-[rgb(245_243_238/0.45)]"
      >
        {immunityUsed ? (lang === "en" ? "Shield used up" : "Hết quyền miễn trừ") : (lang === "en" ? "Use Immunity Shield" : "Dùng quyền miễn trừ")}
      </button>
    </>
  );
}

export function TurnSpeak({ onDone }: { onDone: () => void }) {
  const { lang } = useLanguage();
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-5">
        <div className="t-display text-safe">
          {lang === "en" ? <>SPEAK<br />OUT LOUD</> : <>NÓI TO<br />LÊN</>}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.55)] [text-wrap:pretty]">
          {lang === "en" ? "The whole table is voting if you're telling the truth or lying." : "Cả bàn đang bỏ phiếu thật hay dối."}
        </div>
      </div>
      <ChunkyButton fontSize={26} onClick={onDone} haptic={HAPTIC.sub}>
        {lang === "en" ? "FINISHED CONFESSION" : "KHAI XONG"}
      </ChunkyButton>
    </>
  );
}

export function NextQuestionPick({
  options,
  onPick,
}: {
  options: [string, string];
  onPick: (index: 0 | 1) => void;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="t-label shrink-0 text-accent">{t("chooseNextTitle")}</div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3.5">
        {options.map((q, i) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onPick(i as 0 | 1);
            }}
            className="card-soft flex-1 rounded-card border border-line bg-surface p-5 text-left text-[20px] leading-[1.24] font-black [text-wrap:pretty]"
          >
            {q}
          </button>
        ))}
      </div>
    </>
  );
}
