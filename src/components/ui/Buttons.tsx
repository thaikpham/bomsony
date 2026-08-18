"use client";

import type { ReactNode } from "react";
import { HAPTIC, vibrate } from "@/lib/haptics";

type Tone = "accent" | "safe" | "danger" | "surface";

const TONE: Record<Tone, string> = {
  accent: "bg-accent text-ink [--btn-shadow:var(--color-accent-shadow)]",
  safe: "bg-safe text-ink [--btn-shadow:var(--color-safe-shadow)]",
  danger: "bg-danger text-ink [--btn-shadow:var(--color-danger-shadow)]",
  surface:
    "bg-surface text-[rgb(245_243_238/0.72)] border border-line [--btn-shadow:transparent]",
};

/**
 * Nút "lún cứng" — mọi hành động chính.
 * Hit target 88px: cao hơn chuẩn 44px vì người chơi đã xỉn, tay không chính xác.
 */
export function ChunkyButton({
  children,
  onClick,
  tone = "accent",
  height = 88,
  radius = 26,
  fontSize = 32,
  haptic = HAPTIC.drink,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: Tone;
  height?: number;
  radius?: number;
  fontSize?: number;
  haptic?: number;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{ height, borderRadius: radius, fontSize }}
      className={`btn-chunk w-full shrink-0 select-none touch-manipulation active:scale-[0.98] ${TONE[tone]} ${className}`}
      onClick={() => {
        if (disabled) return;
        vibrate(haptic);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

/** Nút "nảy mềm" — nút phụ, chip troll. Cao 66px. */
export function SoftButton({
  children,
  onClick,
  haptic = HAPTIC.sub,
  danger = false,
  width,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  haptic?: number;
  danger?: boolean;
  width?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      style={width ? { width } : undefined}
      className={`btn-soft min-h-[56px] h-[66px] rounded-sub text-[17px] font-black select-none touch-manipulation ${
        danger
          ? "border border-[rgb(255_46_77/0.5)] bg-danger-surface text-danger-text"
          : "border border-line bg-surface text-text"
      } ${width ? "shrink-0" : "flex-1"} ${className}`}
      onClick={() => {
        vibrate(haptic);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

/** Nút bỏ phiếu — 132px, cả màn chỉ để bấm 1 trong 2. */
export function VoteButton({
  children,
  onClick,
  tone,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone: "safe" | "danger";
}) {
  return (
    <button
      type="button"
      className={`btn-chunk h-[132px] shrink-0 rounded-vote text-[44px] font-black select-none touch-manipulation ${
        tone === "safe"
          ? "bg-safe text-ink [--btn-shadow:var(--color-safe-shadow)]"
          : "bg-danger text-ink [--btn-shadow:var(--color-danger-shadow)]"
      } [box-shadow:0_9px_0_var(--btn-shadow)] active:[box-shadow:0_2px_0_var(--btn-shadow)] active:[transform:translateY(7px)]`}
      onClick={() => {
        vibrate(HAPTIC.sub);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
