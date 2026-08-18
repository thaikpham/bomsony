import type { Dose, Verdict } from "./types";
import { DOSE_LABEL } from "./types";

/**
 * Thầy Phán — bộ lời phán dựng sẵn.
 *
 * README gợi ý cache theo (zodiac, lifePathNumber, round) hoặc pre-generate sẵn
 * một bộ lớn rồi random: người chơi không cần AI thật-thời-gian, chỉ cần cảm
 * giác ngẫu nhiên. Đây là bộ đó — chạy được offline, không tốn token, không
 * bao giờ để API key ra client. Muốn dùng Claude thật thì bật
 * `ANTHROPIC_API_KEY` (xem `src/app/api/verdict/route.ts`); bộ này là fallback.
 *
 * Ràng buộc: ≤ 12 từ · giọng ra lệnh, không giải thích · không đụng ngoại hình,
 * gia đình, giới tính, tôn giáo · trần là 100% = 1 ly, không bao giờ hơn.
 */

const LINES: Record<Dose, string[]> = {
  100: [
    "Gan to thì trả giá.",
    "Sao {zodiac} đang cháy. Cạn đi.",
    "Số {num} là số nợ. Trả luôn.",
    "Thầy xem kỹ rồi. Hết đường lùi.",
    "{zodiac} mà im lặng? Không tin. Cạn.",
    "Vía nặng quá. Một ly cho nhẹ.",
    "Số {num} tối nay đứng đầu bảng nợ.",
    "Nói nhiều quá, thầy phạt cho vui.",
  ],
  50: [
    "Sao xấu, miệng to.",
    "{zodiac} hôm nay lệch trục. Nửa ly.",
    "Số {num} còn cứu được. Nửa thôi.",
    "Thầy thấy cái mặt là biết. Nửa ly.",
    "Chưa tới mức cạn, nhưng đừng mừng.",
    "Vía {zodiac} lửng lơ. Uống nửa cho đều.",
    "Số {num} nợ thầy một nửa.",
    "Nửa ly. Còn nửa để dành vòng sau.",
  ],
  25: [
    "Thầy nể mặt lần này.",
    "{zodiac} gặp may. Nhấp môi thôi.",
    "Số {num} hợp vía thầy. Tha.",
    "Nhẹ tay. Đừng quen.",
    "Sao chiếu mờ. Nhấp một cái.",
    "Thầy đang vui. Nhấp môi rồi ngồi xuống.",
    "Số {num} sạch nợ. Tạm thế.",
    "Lần này thoát. Vòng sau chưa chắc.",
  ],
};

/** Hash ổn định — cùng (zodiac, num, round) ra cùng lời phán. */
function hash(...parts: (string | number)[]): number {
  let h = 2166136261;
  const s = parts.join("|");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Vòng 1–2 làm nóng: chỉ 25–50%. Từ vòng 3 mở 100%. */
export function rollDose(
  zodiac: string,
  lifePath: number,
  round: number,
): Dose {
  const h = hash(zodiac, lifePath, round);
  if (round <= 2) return h % 2 === 0 ? 25 : 50;
  const r = h % 10;
  if (r < 3) return 100;
  if (r < 7) return 50;
  return 25;
}

export function judgeLine(
  dose: Dose,
  zodiac: string,
  lifePath: number,
  round: number,
): string {
  const pool = LINES[dose];
  return pool[hash("line", zodiac, lifePath, round, dose) % pool.length]
    .replace("{zodiac}", zodiac)
    .replace("{num}", String(lifePath));
}

const REASONS: Record<Dose, string[]> = {
  100: [
    "Vì cung {zodiac} số {num} vướng sao xui chiếu thẳng, không cạn ly không giải được hạn!",
    "Vì năng lượng số {num} hôm nay quá lố, phải cạn 100% để hạ hỏa!",
    "Vì tử vi {zodiac} vướng góc xung chiếu, cạn ly ngay để tẩy uế!",
  ],
  50: [
    "Vì số {num} thần số học đang lửng lơ nửa chừng, cạn 50% cho cân bằng âm dương!",
    "Vì cung {zodiac} âm khí vừa đủ, uống nửa ly để tích thêm vận may!",
    "Vì vướng nửa hạn nhỏ, Thầy thương tình cho gánh một nửa!",
  ],
  25: [
    "Vì {zodiac} được sao Hồng Loan chiếu mệnh, Thầy nể mặt cho nhấp môi 25%!",
    "Vì số {num} hôm nay có quý nhân gánh nợ, chỉ cần nhấp chút làm phép!",
    "Vì vía {zodiac} hôm nay siêu lành, Thầy nhẹ tay cho nhấp môi!",
  ],
};

export function judgeReason(
  dose: Dose,
  zodiac: string,
  lifePath: number,
  round: number,
): string {
  const pool = REASONS[dose];
  return pool[hash("reason", zodiac, lifePath, round, dose) % pool.length]
    .replace("{zodiac}", zodiac)
    .replace("{num}", String(lifePath));
}

const TASKS_BY_NUM: Record<number, string> = {
  1: "Hô 'Bợm Sony đỉnh' rồi mới uống!",
  7: "Thì thầm lời phán cho người bên trái!",
  8: "Chỉ định 1 bạn cùng uống mừng!",
  9: "Vừa hô 'DZÔ' vừa nâng ly!",
};

export function makeVerdict(input: {
  playerId: string;
  zodiac: string | null;
  lifePath: number | null;
  round: number;
  /** Vòng "Thầy Phán nổi giận" — ×2 án của tất cả mọi người. */
  rage?: boolean;
}): Verdict {
  const zodiac = input.zodiac ?? "VÔ DANH";
  const lifePath = input.lifePath ?? 0;
  let dose = rollDose(zodiac, lifePath, input.round);
  if (input.rage) dose = doubleDose(dose);

  const h = hash("ext", input.playerId, input.round);
  const task = TASKS_BY_NUM[lifePath] ?? "Nhìn thẳng cả bàn, nâng ly mỉm cười!";
  const chainNote =
    h % 5 === 0
      ? "DÂY CHUYỀN: Nếu bạn cạn ly, người bên phải nhấp môi 25% theo!"
      : undefined;

  return {
    playerId: input.playerId,
    dose,
    label: DOSE_LABEL(dose),
    line: judgeLine(dose, zodiac, lifePath, input.round),
    reason: judgeReason(dose, zodiac, lifePath, input.round),
    task,
    chainNote,
    drunk: false,
  };
}

/** Trần là 100% = 1 ly, không bao giờ hơn. */
export function doubleDose(dose: Dose): Dose {
  if (dose === 25) return 50;
  return 100;
}

/** Gộp hai án về một trong ba mức hợp lệ. Vẫn không bao giờ quá 100%. */
export function mergeDose(a: Dose, b: Dose): Dose {
  const sum = a + b;
  if (sum >= 75) return 100;
  if (sum >= 50) return 50;
  return 25;
}

/** Copy chốt trong thiết kế 4f — dùng khi án đã bị chỉnh tay. */
export const DESIGN_LINES = {
  full: "Gan to thì trả giá.",
  half: "Sao xấu, miệng to.",
  appealed: "Thầy nể mặt lần này.",
};
