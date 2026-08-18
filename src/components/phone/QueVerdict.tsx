"use client";

import { useState } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Player, Verdict } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { ChunkyButton, SoftButton } from "@/components/ui/Buttons";

/**
 * 4f · Phone — Số trời đã định (quẻ), state `verdict`.
 * Mức uống là khối toàn chữ số nên được nén 150px/0.82; nhãn và lời phán là chữ
 * Việt nên giữ line-height ≥ 1.12.
 */
export function QueVerdict({
  round,
  zodiac,
  lifePath,
  verdict,
  appealUsed,
  pushUsed,
  onDrink,
  onAppeal,
  onPush,
  onDuel,
}: {
  round: number;
  zodiac: string | null;
  lifePath: number | null;
  verdict: Verdict;
  appealUsed: boolean;
  pushUsed: boolean;
  onDrink: () => void;
  onAppeal: () => void;
  onPush: () => void;
  onDuel: () => void;
}) {
  return (
    <>
      <div className="flex shrink-0 items-baseline justify-between">
        <span className="t-label text-text-faint">VÒNG {round}</span>
        <span className="t-label text-text-faint">
          {zodiac ?? "—"} · {lifePath ?? "—"}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center gap-[18px]">
        <div
          key={verdict.dose}
          className="t-numeral animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[150px] text-accent"
        >
          {verdict.dose}%
        </div>
        <div className="text-[36px] leading-[1.14] font-black tracking-[-0.02em]">
          {verdict.label}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.6)] [text-wrap:pretty]">
          {verdict.line}
        </div>
      </div>

      <ChunkyButton onClick={onDrink}>ĐÃ UỐNG</ChunkyButton>

      <div className="flex shrink-0 gap-2.5">
        <SoftButton onClick={onAppeal}>{appealUsed ? "HẾT CÃI" : "XIN GIẢM"}</SoftButton>
        <SoftButton onClick={onPush} haptic={HAPTIC.push}>
          {pushUsed ? "HẾT ĐẨY" : "ĐẨY QUA"}
        </SoftButton>
        <SoftButton danger width={74} haptic={HAPTIC.duel} onClick={onDuel} className="text-[19px]">
          ×2
        </SoftButton>
      </div>
    </>
  );
}

/** 4f · state `done` — đã cạn, bấm VÒNG TIẾP để sang vòng sau. */
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
  return (
    <>
      <div className="flex flex-1 animate-[bsRise_0.28s_ease_both] flex-col justify-center gap-[18px]">
        <div className="flex h-25 w-25 animate-[bsPop_0.4s_cubic-bezier(0.2,1.5,0.4,1)_both] items-center justify-center rounded-full bg-safe text-[48px] font-black text-ink">
          ✓
        </div>
        <div className="text-[64px] leading-[1.12] font-black tracking-[-0.035em] text-safe">
          DZÔ!
        </div>
        <div className="t-body text-[rgb(245_243_238/0.6)]">
          Đã cạn {dose}%. Cả bàn thấy rồi.
        </div>
        {drunkCount && totalPlayers ? (
          <div className="t-label text-accent font-black">
            {drunkCount} / {totalPlayers} BỢM ĐÃ CẠN LY
          </div>
        ) : null}
      </div>
      <ChunkyButton tone="accent" height={80} fontSize={22} onClick={onNextRound}>
        VÒNG TIẾP ➔
      </ChunkyButton>
    </>
  );
}

/**
 * Phone · đẩy án — chọn người.
 * Handoff liệt kê màn này ở "Not yet designed"; luật thì đã chốt (1 lần/trận,
 * chuyển toàn bộ án sang người mình chọn), nên dựng theo hệ thống 4 cỡ chữ.
 */
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
  return (
    <>
      <div className="t-label shrink-0 text-danger">ĐẨY ÁN QUA AI</div>
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
            className="btn-soft h-[72px] shrink-0 justify-start gap-3.5 rounded-sub border border-line bg-surface px-4 text-[24px]"
          >
            <Avatar name={p.name} src={p.avatarUrl} size={44} fontSize={16} />
            {p.name}
          </button>
        ))}
      </div>
      <ChunkyButton tone="surface" height={66} fontSize={20} onClick={onCancel}>
        THÔI, TỰ UỐNG
      </ChunkyButton>
    </>
  );
}
