/** Bợm Sony — mô hình dữ liệu chung cho host, phone và server. */

export type Mode = "que" | "tod";
export type Phase = "lobby" | "safety" | "round" | "reveal" | "final";
export type Tier = "warm" | "mid" | "spicy";
export type RoundType = "que" | "tod" | "table" | "duel" | "reverse" | "rage";
export type Dose = 100 | 50 | 25;
export type VoteValue = "tin" | "doi";
export type Outcome = "truth" | "liar" | "skipped" | "immune";

export const TIER_LABEL: Record<Tier, string> = {
  warm: "KHỞI ĐỘNG",
  mid: "TẦM TRUNG",
  spicy: "CAY",
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
  verdicts: Verdict[];
  votes: Vote[];
  outcome: Outcome | null;
  /** 2 câu người vừa khai chọn để giao cho người kế. */
  nextQuestionOptions: [string, string] | null;
  /** Người bị đẩy án nhận thêm — chỉ 'que'. */
  pushedTo: Record<string, string>;
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
  /** Câu đã dùng — không hỏi lại. */
  usedQuestions: string[];
  createdAt: number;
  updatedAt: number;
};

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

export const DEFAULT_BANNED = ["Gia đình", "Người yêu cũ có mặt"];

export const DOSE_LABEL = (dose: Dose): string =>
  dose >= 100 ? "CẠN LY" : dose >= 50 ? "NỬA LY" : "NHẤP MÔI";
