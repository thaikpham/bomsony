/** Bợm Sony — mô hình dữ liệu chung cho host, phone và server. */

import type { Language } from "./i18n";

export type Mode = "que" | "tod";
export type Phase = "lobby" | "safety" | "round" | "reveal" | "final";
export type Tier = "warm" | "mid" | "spicy";
export type RoundType = "que" | "tod" | "table" | "duel" | "reverse" | "rage" | "wildcard";
export type Dose = 100 | 50 | 25;
export type VoteValue = "tin" | "doi";
export type Outcome = "truth" | "liar" | "skipped" | "immune";

export const TIER_LABEL: Record<Tier, string> = {
  warm: "KHỞI ĐỘNG",
  mid: "TẦM TRUNG",
  spicy: "CAY",
};

export const getTierLabel = (tier: Tier, lang: Language = "vi"): string => {
  if (lang === "en") {
    switch (tier) {
      case "warm":
        return "WARM UP";
      case "mid":
        return "MID TIER";
      case "spicy":
        return "SPICY";
    }
  }
  return TIER_LABEL[tier];
};

/** Một ngụm ≈ 0.25 ly. Điểm "Bợm của đêm" tính bằng số ly quy đổi. */
export const GLASSES_PER_SIP = 0.25;

export type Verdict = {
  playerId: string;
  dose: Dose;
  /** CẠN LY / NỬA LY / NHẤP MÔI */
  label: string;
  /** Lời phán ≤ 12 từ, giọng Thầy Phán. */
  line: string;
  lineEn?: string;
  /** Lý do Thầy Phán giải thích vì sao bị phạt mức này. */
  reason?: string;
  reasonEn?: string;
  task?: string;
  taskEn?: string;
  chainNote?: string;
  chainNoteEn?: string;
  flippedLuck?: boolean;
  drunk: boolean;
};

export type Vote = {
  voterId: string;
  value: VoteValue;
};

export type Troll = {
  id: string;
  playerId: string;
  label: string;
  at: number;
};

export type Player = {
  id: string;
  name: string;
  avatarUrl: string | null;
  /** ISO yyyy-mm-dd — chỉ chế độ 'que'. */
  birthDate: string | null;
  zodiac: string | null;
  lifePathNumber: number | null;
  appealUsed: boolean;
  pushUsed: boolean;
  immunityUsed: boolean;
  /** Số ly quy đổi đã uống — bảng "Bợm của đêm". */
  totalGlasses: number;
  /** Điểm soi đúng — bảng riêng. */
  detectivePoints: number;
  connected: boolean;
  joinedAt: number;
};

export type Round = {
  index: number;
  type: RoundType;
  tier: Tier;
  /** Chỉ vòng 'tod' / 'duel'. */
  spotlightPlayerId: string | null;
  question: string | null;
  questionEn?: string | null;
  verdicts: Verdict[];
  votes: Vote[];
  outcome: Outcome | null;
  /** 2 câu người vừa khai chọn để giao cho người kế. */
  nextQuestionOptions: [string, string] | null;
  nextQuestionOptionsEn?: [string, string] | null;
  /** Người bị đẩy án nhận thêm — chỉ 'que'. */
  pushedTo: Record<string, string>;
  /** Cặp Thiên địch tương khắc trong vòng (nếu có). */
  clashPair?: [string, string] | null;
  startedAt: number;
};

export type Room = {
  code: string;
  mode: Mode | null;
  phase: Phase;
  round: number;
  tier: Tier;
  bannedTopics: string[];
  players: Player[];
  current: Round | null;
  trolls: Troll[];
  /** Thanh nổi giận của Thầy Phán (0 đến 100). */
  rageGauge: number;
  /** ID của người đang giữ quyền Chủ Phòng (Host) */
  hostId?: string;
  /** Câu đã dùng — không hỏi lại. */
  usedQuestions: string[];
  createdAt: number;
  updatedAt: number;
};

/**
 * Tìm người đang giữ quyền Chủ phòng (Host):
 * 1. Nếu người tạo phòng (room.players[0]) đang online -> làm Host.
 * 2. Nếu người tạo phòng rớt mạng -> tự động chuyển quyền Host cho người đang online uống nhiều nhất trên BXH.
 */
export function getHostPlayer(room: Room | null): Player | null {
  if (!room || room.players.length === 0) return null;

  const creator = room.players[0];
  if (creator && creator.connected) return creator;

  const connected = room.players.filter((p) => p.connected);
  if (connected.length === 0) return creator || null;

  const sorted = [...connected].sort((a, b) => {
    if (b.totalGlasses !== a.totalGlasses) return b.totalGlasses - a.totalGlasses;
    if (b.detectivePoints !== a.detectivePoints) return b.detectivePoints - a.detectivePoints;
    return a.joinedAt - b.joinedAt;
  });

  return sorted[0] || null;
}

/** Chủ đề cấm — cả bàn gạch trước khi vào Truth or Drink. */
export const SAFETY_TOPICS = [
  "Gia đình",
  "Tiền lương",
  "Người yêu cũ có mặt",
  "Công việc",
  "Cân nặng",
  "Chuyện giường",
  "Nợ nần",
  "Học vấn",
] as const;

export const SAFETY_TOPIC_LABELS: Record<string, { vi: string; en: string }> = {
  "Gia đình": { vi: "Gia đình", en: "Family" },
  "Tiền lương": { vi: "Tiền lương", en: "Income / Salary" },
  "Người yêu cũ có mặt": { vi: "Người yêu cũ", en: "Ex Present" },
  "Công việc": { vi: "Công việc", en: "Work / Job" },
  "Cân nặng": { vi: "Cân nặng", en: "Weight" },
  "Chuyện giường": { vi: "Chuyện 18+", en: "Intimacy (18+)" },
  "Nợ nần": { vi: "Nợ nần", en: "Debts / Money" },
  "Học vấn": { vi: "Học vấn", en: "Education" },
};

export const getSafetyTopicLabel = (topic: string, lang: Language = "vi"): string => {
  return SAFETY_TOPIC_LABELS[topic]?.[lang] || topic;
};

export const DEFAULT_BANNED = ["Gia đình", "Người yêu cũ có mặt"];

export const DOSE_LABEL = (dose: Dose, lang: Language = "vi"): string => {
  if (lang === "en") {
    return dose >= 100 ? "BOTTOMS UP" : dose >= 50 ? "HALF GLASS" : "SIP DOSE";
  }
  return dose >= 100 ? "CẠN LY" : dose >= 50 ? "NỬA LY" : "NHẤP MÔI";
};

export const getDoseLabel = DOSE_LABEL;
