"use client";

import type { ReactNode } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Player, VoteValue } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { ChunkyButton, VoteButton } from "@/components/ui/Buttons";

/**
 * 4h · Phone — bỏ phiếu.
 *
 * Màn quan trọng nhất về game design: khi 1 người khai, những người còn lại
 * không ngồi xem mà bỏ phiếu — xoá hoàn toàn thời gian chết giữa lượt.
 */
export function VoteHeader({
  spotlight,
  question,
}: {
  spotlight: Player | null;
  question: string | null;
}) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-3.5">
        <Avatar name={spotlight?.name ?? "?"} src={spotlight?.avatarUrl} size={52} fontSize={18} />
        <div className="text-[24px] leading-[1.18] font-black tracking-[-0.02em]">
          {spotlight?.name ?? "Ai đó"} đang khai
        </div>
      </div>
      <div className="t-body shrink-0 text-[rgb(245_243_238/0.55)] [text-wrap:pretty]">
        {question}
      </div>
    </>
  );
}

/** state `vote` — hai nút 132px dính đáy, cả màn chỉ để bấm 1 trong 2. */
export function VoteChoice({ onVote }: { onVote: (value: VoteValue) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-end gap-3.5">
      <VoteButton tone="safe" onClick={() => onVote("tin")}>
        TIN
      </VoteButton>
      <VoteButton tone="danger" onClick={() => onVote("doi")}>
        NÓI DỐI
      </VoteButton>
    </div>
  );
}

/** state `count` — 3 chấm lệch pha + hai số phiếu. */
export function VoteCount({ tin, doi }: { tin: number; doi: number }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6">
      <div className="flex gap-2">
        <Dot />
        <Dot delay="0.18s" />
        <Dot delay="0.36s" />
      </div>
      <div className="flex items-baseline gap-6">
        <Big count={tin} label="TIN" className="text-safe" />
        <Big count={doi} label="NÓI DỐI" className="text-danger" />
      </div>
    </div>
  );
}

/** state `result` — bắt được hay hụt, cộng điểm soi, rồi troll. */
export function VoteResult({
  correct,
  line,
  onTroll,
}: {
  correct: boolean;
  line: string;
  onTroll: (label: string) => void;
}) {
  return (
    <>
      <div className="flex flex-1 flex-col justify-center gap-5">
        <div
          className={`animate-[bsPop_0.3s_cubic-bezier(0.2,1.5,0.4,1)_both] t-display ${
            correct ? "text-danger" : "text-text-dim"
          }`}
        >
          {correct ? (
            <>
              BẮT
              <br />
              ĐƯỢC
            </>
          ) : (
            <>
              SOI
              <br />
              HỤT
            </>
          )}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.6)] [text-wrap:pretty]">{line}</div>
      </div>
      <div className="flex shrink-0 gap-2.5">
        {["DZÔ!", "HÈN", "BỊA DỞ"].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              vibrate(HAPTIC.chip);
              onTroll(label);
            }}
            className="btn-soft h-[66px] flex-1 rounded-sub border border-line bg-surface text-[17px] active:scale-92"
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

/** Chờ vòng sau — người đã bỏ phiếu / đã uống không có gì để bấm. */
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
        <div className="text-[64px] leading-[1.12] font-black tracking-[-0.035em] text-accent">
          {title}
        </div>
        <div className="t-body text-[rgb(245_243_238/0.55)] [text-wrap:pretty]">{line}</div>
      </div>
      {cta ? (
        <ChunkyButton tone="surface" height={80} fontSize={22} onClick={cta.onClick}>
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
      <div className="text-[96px] leading-none font-black tabular-nums">{count}</div>
      <div className="t-label">{label}</div>
    </div>
  );
}
