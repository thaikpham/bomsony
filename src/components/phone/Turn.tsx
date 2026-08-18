"use client";

import { HAPTIC, vibrate } from "@/lib/haptics";
import { ChunkyButton } from "@/components/ui/Buttons";

/** 4g · Phone — tới lượt bạn, state `ask`. */
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
  const mult = rage || duel;
  return (
    <>
      <div className="t-label shrink-0 text-danger">
        {reversed
          ? "NGƯỢC ĐỜI · TỚI LƯỢT BẠN"
          : rage
            ? "THẦY PHÁN NỔI GIẬN · ×2"
            : duel
              ? "ĐẤU TAY ĐÔI · ×2"
              : "TỚI LƯỢT BẠN"}
      </div>
      <div className="flex min-h-0 flex-1 items-center">
        <div className="animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[40px] leading-[1.28] font-black tracking-[-0.025em] text-accent [text-wrap:pretty]">
          {question}
        </div>
      </div>
      <ChunkyButton tone="safe" onClick={onSpeak} haptic={HAPTIC.sub}>
        NÓI THẬT
      </ChunkyButton>
      <ChunkyButton tone="accent" onClick={onSip}>
        {mult ? "2 NGỤM" : "1 NGỤM"}
      </ChunkyButton>
      <button
        type="button"
        onClick={() => {
          vibrate(HAPTIC.push);
          onImmune();
        }}
        className="flex h-14 shrink-0 items-center justify-center text-[17px] font-black text-[rgb(245_243_238/0.45)]"
      >
        {immunityUsed ? "Hết quyền miễn trừ" : "Dùng quyền miễn trừ"}
      </button>
    </>
  );
}

/** 4g · state `speak` — đang khai, cả bàn bỏ phiếu. */
export function TurnSpeak({ onDone }: { onDone: () => void }) {
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-5">
        <div className="t-display text-safe">
          NÓI TO
          <br />
          LÊN
        </div>
        <div className="t-body text-[rgb(245_243_238/0.55)] [text-wrap:pretty]">
          Cả bàn đang bỏ phiếu thật hay dối.
        </div>
      </div>
      <ChunkyButton fontSize={28} onClick={onDone} haptic={HAPTIC.sub}>
        KHAI XONG
      </ChunkyButton>
    </>
  );
}

/** 4g · state `judge` — hai số phiếu rồi kết quả. */
export function TurnJudge({
  tin,
  doi,
  liar,
  rage,
  duel,
  onNext,
}: {
  tin: number;
  doi: number;
  liar: boolean;
  rage: boolean;
  duel?: boolean;
  onNext: () => void;
}) {
  const mult = rage || duel;
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-5">
        <div className="flex items-baseline gap-6">
          <TallyBlock count={tin} label="TIN" className="text-safe" />
          <TallyBlock count={doi} label="NÓI DỐI" className="text-danger" />
        </div>
        <div
          className={`text-[64px] leading-[1.12] font-black tracking-[-0.035em] ${
            liar ? "text-danger" : "text-safe"
          }`}
        >
          {liar ? "BỊ BẮT" : "THẦY TIN"}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.6)]">
          {liar
            ? mult
              ? "Vòng nhân đôi. 4 ngụm."
              : "Uống gấp đôi. 2 ngụm."
            : "Thật thà thì thoát."}
        </div>
      </div>
      <ChunkyButton fontSize={28} onClick={onNext}>
        {liar ? (mult ? "UỐNG 4 NGỤM" : "UỐNG 2 NGỤM") : "RA CÂU TIẾP"}
      </ChunkyButton>
    </>
  );
}

/** 4g · state `sip` — né, 1 ngụm. */
export function TurnSip({
  reversed,
  rage,
  duel,
  onDone,
}: {
  reversed: boolean;
  rage: boolean;
  duel?: boolean;
  onDone: () => void;
}) {
  const mult = rage || duel;
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-5">
        <div className="t-numeral animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[150px] text-accent">
          {reversed ? 0 : mult ? 2 : 1}
        </div>
        <div className="text-[36px] leading-[1.14] font-black tracking-[-0.025em]">NGỤM</div>
        <div className="t-body text-[rgb(245_243_238/0.55)]">
          {reversed
            ? "Vòng ngược đời — né là thoát."
            : mult
              ? "Vòng nhân đôi. Né thì 2 ngụm."
              : "Cả bàn vừa thấy bạn né."}
        </div>
      </div>
      <ChunkyButton fontSize={28} onClick={onDone}>
        {reversed ? "TIẾP" : "ĐÃ NGỤM"}
      </ChunkyButton>
    </>
  );
}

/** 4g · state `immune` — dùng quyền miễn trừ. */
export function TurnImmune({ onNext }: { onNext: () => void }) {
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-5">
        <div className="flex h-25 w-25 animate-[bsPop_0.4s_cubic-bezier(0.2,1.5,0.4,1)_both] items-center justify-center rounded-full bg-safe text-[48px] font-black text-ink">
          ✓
        </div>
        <div className="text-[64px] leading-[1.12] font-black tracking-[-0.035em] text-safe">
          THOÁT
          <br />
          SẠCH
        </div>
        <div className="t-body text-[rgb(245_243_238/0.55)]">Hết quyền miễn trừ.</div>
      </div>
      <ChunkyButton tone="surface" fontSize={24} onClick={onNext}>
        TIẾP
      </ChunkyButton>
    </>
  );
}

/**
 * Phone · chọn câu giao cho người kế — 2 lựa chọn A/B.
 * "Not yet designed" trong handoff, nhưng là cơ chế riêng phải giữ: người chơi
 * ra câu, không phải máy. Nhắm ai thì nhắm.
 */
export function NextQuestionPick({
  options,
  onPick,
}: {
  options: [string, string];
  onPick: (index: 0 | 1) => void;
}) {
  return (
    <>
      <div className="t-label shrink-0 text-accent">GIAO CÂU CHO NGƯỜI KẾ</div>
      <div className="flex min-h-0 flex-1 flex-col justify-center gap-3.5">
        {options.map((q, i) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onPick(i as 0 | 1);
            }}
            className="card-soft flex-1 rounded-card border border-line bg-surface p-5 text-left text-[24px] leading-[1.24] font-black [text-wrap:pretty]"
          >
            {q}
          </button>
        ))}
      </div>
    </>
  );
}

function TallyBlock({
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
      <div className="text-[72px] leading-none font-black tabular-nums">{count}</div>
      <div className="t-label">{label}</div>
    </div>
  );
}
