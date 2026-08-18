"use client";

/**
 * Rung mỗi lần tap — trong quán ồn không nghe được feedback, ngón tay phải
 * cảm được. Bảng ms lấy từ handoff §Haptic.
 */
export const HAPTIC = {
  chip: 12,
  sub: 20,
  push: 30,
  countDone: 45,
  drink: 50,
  duel: 60,
} as const;

export function vibrate(ms: number): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(ms);
  } catch {
    /* Safari iOS không có — bỏ qua, không phải lỗi. */
  }
}
