import type { Dose, Verdict } from "./types";
import { DOSE_LABEL } from "./types";
import { ZODIAC_EN } from "./zodiac";

const LINES: Record<Dose, string[]> = {
  100: [
    "{name} gáy to quá, Thầy ngứa tai. Cạn 100%!",
    "Sao {zodiac} đang cháy rực. {name} cạn ngay cho nóng!",
    "{name} mang số {num} tối nay đứng đầu bảng nợ. Cạn 100%!",
    "Nhìn mặt {name} là thấy nghi gian dối. Phạt CẠN LY!",
    "{zodiac} mà định ngâm ly? Không bao giờ. Uống 100%!",
    "Vía {name} nặng quá. Cạn 1 ly cho nhẹ bớt cái nết!",
    "Số {num} của {name} bị đại hao chiếu mệnh. Cạn luôn!",
    "{name} cười tươi quá, Thầy ngứa mắt. Phạt CẠN LY 100%!",
  ],
  50: [
    "{name} cung {zodiac} hôm nay lệch trục nhẹ. Nửa ly!",
    "Số {num} của {name} còn thương được. Uống 50% thôi!",
    "Thầy thấy {name} hơi rén rồi. Nửa ly làm nhát!",
    "Chưa tới mức cạn, nhưng {name} đừng có mừng thầm!",
    "Vía {zodiac} của {name} lửng lơ. Uống nửa ly cho đều!",
    "{name} nợ Thầy một nửa. Uống 50% rồi tính tiếp!",
    "Nửa ly cho {name}. Còn nửa để dành tí phạt tiếp!",
  ],
  25: [
    "Thầy nể mặt {name} lần này. Nhấp môi 25%!",
    "{name} cung {zodiac} gặp may. Nhấp một miếng làm màu!",
    "Số {num} của {name} hợp vía Thầy. Phạt nhẹ 25%!",
    "Nhẹ tay cho {name}. Đừng có quen nết!",
    "Thầy đang vui nên {name} chỉ cần nhấp môi rồi ngồi xuống!",
    "Vía {name} hôm nay sạch nợ. Tạm tha nhấp môi!",
  ],
};

const LINES_EN: Record<Dose, string[]> = {
  100: [
    "{name} is bragging too loudly. Bottoms up 100%!",
    "{zodiac} is burning hot. {name}, drink up 100% now!",
    "{name} with Life Path {num} tops the debt list tonight. Bottoms up!",
    "{name} looks suspicious! Penalty: BOTTOMS UP!",
    "Can a {zodiac} hold back? Never! Drink 100%!",
    "{name}'s aura is too heavy. Finish a full glass!",
    "Life Path {num} faces bad luck tonight. Finish the glass!",
    "{name} is smiling too much. Penalty: BOTTOMS UP 100%!",
  ],
  50: [
    "{name} ({zodiac}) is slightly misaligned today. Half glass!",
    "Life Path {num} shows mercy. Drink 50% only!",
    "The Oracle sees {name} hesitating. Take a half glass!",
    "Not a full glass yet, but don't celebrate too early, {name}!",
    "{zodiac} energy for {name} is floating. Drink half a glass!",
    "{name} owes the Oracle half. Drink 50% now!",
    "Half a glass for {name}. Save the rest for next time!",
  ],
  25: [
    "The Oracle gives {name} a break this time. Sip 25%!",
    "{name} ({zodiac}) got lucky! Take a tiny sip!",
    "Life Path {num} pleases the Oracle. Gentle penalty: 25% sip!",
    "Easy on {name} this time. Don't make it a habit!",
    "The Oracle is generous: {name} just take a sip and sit!",
    "{name}'s debt is cleared today. Forgiven with a sip!",
  ],
};

const REASONS: Record<Dose, string[]> = {
  100: [
    "Vì {name} cung {zodiac} số {num} vướng sao xui chiếu thẳng, không cạn ly không giải được hạn!",
    "Vì năng lượng số {num} của {name} hôm nay quá lố, phải cạn 100% để hạ hỏa!",
    "Vì tử vi {zodiac} của {name} vướng góc xung chiếu, cạn ly ngay để tẩy uế!",
    "Vì {name} gáy quá hăng từ đầu trận, Thầy phải dằn mặt bằng 100%!",
  ],
  50: [
    "Vì số {num} thần số học của {name} đang lửng lơ nửa chừng, cạn 50% cho cân bằng âm dương!",
    "Vì cung {zodiac} của {name} âm khí vừa đủ, uống nửa ly để tích thêm vận may!",
    "Vì vướng nửa hạn nhỏ, Thầy thương tình cho {name} gánh một nửa!",
  ],
  25: [
    "Vì {name} cung {zodiac} được sao Hồng Loan chiếu mệnh, Thầy nể mặt cho nhấp môi 25%!",
    "Vì số {num} hôm nay có quý nhân gánh nợ giúp {name}, chỉ cần nhấp chút làm phép!",
    "Vì vía {name} hôm nay siêu lành, Thầy nhẹ tay cho nhấp môi 25%!",
  ],
};

const REASONS_EN: Record<Dose, string[]> = {
  100: [
    "Because {name} ({zodiac}, Life Path {num}) is aligned with bad stars. Full glass is mandatory!",
    "Because Life Path {num} energy is too chaotic today, drink 100% to cool down!",
    "Because {zodiac} astrology faces a harsh clash, drink up to cleanse!",
    "Because {name} talked big early on, the Oracle demands 100% penalty!",
  ],
  50: [
    "Because Life Path {num} is stuck midway, drink 50% to balance your cosmic energy!",
    "Because {zodiac} energy needs a slight boost, take half a glass for good fortune!",
    "Because of a minor unlucky alignment, the Oracle lets {name} off with 50%!",
  ],
  25: [
    "Because {zodiac} is blessed by lucky stars tonight, take a 25% sip!",
    "Because Life Path {num} brings a guardian angel to shield {name}, just a sip is required!",
    "Because {name}'s karma is spotless tonight, take an easy 25% sip!",
  ],
};

function hash(...parts: (string | number)[]): number {
  let h = 2166136261;
  const s = parts.join("|");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

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
  name: string,
  zodiac: string,
  lifePath: number,
  round: number,
  lang: "vi" | "en" = "vi",
): string {
  const pool = lang === "en" ? LINES_EN[dose] : LINES[dose];
  const zName = lang === "en" ? (ZODIAC_EN[zodiac] || zodiac) : zodiac;
  return pool[hash("line", name, zodiac, lifePath, round, dose) % pool.length]
    .replace(/{name}/g, name)
    .replace(/{zodiac}/g, zName)
    .replace(/{num}/g, String(lifePath));
}

export function judgeReason(
  dose: Dose,
  name: string,
  zodiac: string,
  lifePath: number,
  round: number,
  lang: "vi" | "en" = "vi",
): string {
  const pool = lang === "en" ? REASONS_EN[dose] : REASONS[dose];
  const zName = lang === "en" ? (ZODIAC_EN[zodiac] || zodiac) : zodiac;
  return pool[hash("reason", name, zodiac, lifePath, round, dose) % pool.length]
    .replace(/{name}/g, name)
    .replace(/{zodiac}/g, zName)
    .replace(/{num}/g, String(lifePath));
}

const TASKS_BY_NUM: Record<number, string> = {
  1: "Hô 'Bợm Sony đỉnh' rồi mới uống!",
  7: "Thì thầm lời phán cho người bên trái!",
  8: "Chỉ định 1 bạn cùng uống mừng!",
  9: "Vừa hô 'DZÔ' vừa nâng ly!",
};

const TASKS_BY_NUM_EN: Record<number, string> = {
  1: "Shout 'Bợm Sony rulez!' before drinking!",
  7: "Whisper the verdict to the person on your left!",
  8: "Nominate 1 friend to drink with you in celebration!",
  9: "Shout 'CHEERS!' while raising your glass!",
};

export function makeVerdict(input: {
  playerId: string;
  name?: string;
  zodiac: string | null;
  lifePath: number | null;
  round: number;
  rage?: boolean;
}): Verdict {
  const name = input.name ?? "Bợm";
  const zodiac = input.zodiac ?? "VÔ DANH";
  const lifePath = input.lifePath ?? 0;
  let dose = rollDose(zodiac, lifePath, input.round);
  if (input.rage) dose = doubleDose(dose);

  const h = hash("ext", input.playerId, input.round);
  const task = TASKS_BY_NUM[lifePath] ?? "Nhìn thẳng cả bàn, nâng ly mỉm cười!";
  const taskEn = TASKS_BY_NUM_EN[lifePath] ?? "Look straight at the table, raise your glass and smile!";
  
  const chainNote =
    h % 5 === 0
      ? "DÂY CHUYỀN: Nếu bạn cạn ly, người bên phải nhấp môi 25% theo!"
      : undefined;
  const chainNoteEn =
    h % 5 === 0
      ? "CHAIN REACTION: If you drink full glass, the person to your right takes a 25% sip!"
      : undefined;

  return {
    playerId: input.playerId,
    dose,
    label: DOSE_LABEL(dose, "vi"),
    line: judgeLine(dose, name, zodiac, lifePath, input.round, "vi"),
    lineEn: judgeLine(dose, name, zodiac, lifePath, input.round, "en"),
    reason: judgeReason(dose, name, zodiac, lifePath, input.round, "vi"),
    reasonEn: judgeReason(dose, name, zodiac, lifePath, input.round, "en"),
    task,
    taskEn,
    chainNote,
    chainNoteEn,
    drunk: false,
  };
}

export function doubleDose(dose: Dose): Dose {
  if (dose === 25) return 50;
  return 100;
}

export function mergeDose(a: Dose, b: Dose): Dose {
  const sum = a + b;
  if (sum >= 75) return 100;
  if (sum >= 50) return 50;
  return 25;
}

export const DESIGN_LINES = {
  full: "Gan to thì trả giá.",
  fullEn: "Pay the price for being bold.",
  half: "Sao xấu, miệng to.",
  halfEn: "Bad stars, big mouth.",
  appealed: "Thầy nể mặt lần này.",
  appealedEn: "The Oracle shows mercy this time.",
};
