import type { Mode, RoundType, Tier } from "./types";

/**
 * Chủ xị không phải quyết định vòng nào tiếp — hệ thống tự lên lịch.
 *
 * README mô tả một kịch bản đêm nhậu trộn cả quẻ lẫn Truth or Drink
 * (V1–2 quẻ · V3–6 ToD · V7 quẻ cả bàn · V8–9 cao trào). Kịch bản đó mâu thuẫn
 * với quy ước "hai chế độ không trộn đơn vị uống" (% ly vs ngụm), nên ở đây mỗi
 * chế độ chạy lịch riêng, giữ đúng nhịp "cứ sau 3 vòng chèn 1 biến thể".
 * Muốn chạy đúng kịch bản trộn thì đổi `scheduleFor` sang `NIGHT_SCRIPT`.
 */

export const ROUNDS_PER_GAME = 9;

/** Kịch bản đêm nhậu trong README — trộn đơn vị uống, để sẵn nếu muốn dùng. */
export const NIGHT_SCRIPT: RoundType[] = [
  "que",
  "que",
  "tod",
  "tod",
  "tod",
  "tod",
  "table",
  "tod",
  "duel",
];

/**
 * Biến thể chia theo đơn vị uống, không trộn:
 * quẻ đo bằng phần trăm ly, Truth or Drink đo bằng ngụm. "Cả bàn dính" là
 * biến thể tính theo phần trăm nên chỉ chạy ở chế độ quẻ; "Thầy Phán nổi giận"
 * chạy ở cả hai nhưng nhân đôi đúng đơn vị của chế độ đó.
 */
const QUE_VARIANTS: RoundType[] = ["table", "rage"];
const TOD_VARIANTS: RoundType[] = ["reverse", "duel", "rage"];

export function roundTypeFor(mode: Mode, index: number): RoundType {
  // Biến thể chèn sau mỗi 3 vòng (vòng 4, 8, 12…), không chèn ở vòng cuối.
  const isVariantSlot = index % 4 === 0 && index < ROUNDS_PER_GAME;
  if (mode === "que") {
    return isVariantSlot ? QUE_VARIANTS[(index / 4 - 1) % QUE_VARIANTS.length] : "que";
  }
  return isVariantSlot ? TOD_VARIANTS[(index / 4 - 1) % TOD_VARIANTS.length] : "tod";
}

/** Mức Cay chỉ mở sau vòng 7. */
export function tierFor(index: number): Tier {
  if (index <= 3) return "warm";
  if (index <= 7) return "mid";
  return "spicy";
}

export function isLastRound(index: number): boolean {
  return index >= ROUNDS_PER_GAME;
}

/** Chai quay: xoay vòng, ưu tiên người chưa lên thớt gần đây. */
export function pickSpotlight(
  playerIds: string[],
  previousId: string | null,
): string | null {
  if (playerIds.length === 0) return null;
  if (!previousId) return playerIds[0];
  const i = playerIds.indexOf(previousId);
  return playerIds[(i + 1) % playerIds.length];
}
