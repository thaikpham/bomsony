import { DOSE_LABEL, type Dose, type Tier } from "./types";
import { makeVerdict } from "./verdicts";
import { pickQuestions } from "./questions";

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

const SYSTEM_VERDICT = `Bạn là "Thầy Phán" trong game nhậu Bợm Sony.
Giọng: bựa, ngắn, ra lệnh, không giải thích.

Ràng buộc bắt buộc:
- Lời phán tối đa 12 từ tiếng Việt.
- Nhắc tới cung hoàng đạo hoặc số chủ đạo một cách hài, phán bừa nhưng nghe có lý.
- Không xúc phạm ngoại hình, gia đình, giới tính, tôn giáo.
- Không đụng tới bất kỳ chủ đề nào trong danh sách cấm được đưa vào.
- Không khuyến khích uống quá mức: trần là 100% = 1 ly, không bao giờ hơn.`;

const SYSTEM_QUESTION = `Bạn là "Thầy Phán" chuyên đặt câu hỏi Truth or Drink cho game nhậu Bợm Sony.
Giọng: hài hước, bựa, xoáy sâu, kích thích sự tò mò của cả bàn nhậu.

Ràng buộc:
- Câu hỏi tiếng Việt ngắn gọn (tối đa 25 từ).
- Tuyệt đối không chạm vào các chủ đề bị cấm.
- Phù hợp với mức độ quy định (Khởi động / Tầm trung / Cay).`;

export type AIVerdict = {
  dose: Dose;
  label: string;
  line: string;
  reason?: string;
};

/** Đã test trực tiếp API: gọi Gemini AI theo danh sách model hỗ trợ. */
async function callGeminiJSON<T>(prompt: string, systemInstruction: string): Promise<T | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (!res.ok) continue;

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return JSON.parse(text) as T;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/** Engine Chế độ 1 — Số trời đã định: AI sinh lời phán bựa cho từng người. */
export async function getVerdictAI(input: {
  playerId: string;
  playerName?: string;
  zodiac: string | null;
  lifePath: number | null;
  round: number;
  bannedTopics?: string[];
  rage?: boolean;
}): Promise<AIVerdict> {
  const name = input.playerName ?? "Bợm";
  const zodiac = input.zodiac ?? "BỌ CẠP";
  const lifePath = input.lifePath ?? 8;
  const round = input.round;
  const banned = input.bannedTopics?.length
    ? `Chủ đề cấm tuyệt đối: ${input.bannedTopics.join(", ")}.`
    : "Không có chủ đề cấm.";

  const prompt = `Vòng ${round}. Người chơi tên "${name}", Cung ${zodiac}, Số chủ đạo ${lifePath}. ${banned}${
    input.rage ? " Đây là vòng Thầy Phán nổi giận — án nặng x2." : ""
  } Phán bựa mức uống cho ${name}. Trả về JSON: {"dose": 100|50|25, "label": "CẠN LY"|"NỬA LY"|"NHẤP MÔI", "line": "lời phán bựa ≤ 12 từ gọi tên ${name}", "reason": "lý do hài hước xéo xắt Thầy phán giải thích vì sao ${name} bị uống mức này ≤ 15 từ"}`;

  const aiResult = await callGeminiJSON<AIVerdict>(prompt, SYSTEM_VERDICT);
  if (aiResult && [100, 50, 25].includes(aiResult.dose) && aiResult.line) {
    return {
      dose: aiResult.dose,
      label: DOSE_LABEL(aiResult.dose),
      line: aiResult.line.trim(),
      reason: aiResult.reason?.trim() || undefined,
    };
  }

  // Fallback offline mượt mà
  const v = makeVerdict({
    playerId: input.playerId,
    name,
    zodiac: input.zodiac,
    lifePath: input.lifePath,
    round: input.round,
    rage: input.rage,
  });
  return { dose: v.dose, label: v.label, line: v.line, reason: v.reason };
}

/** Engine Chế độ 2 — Truth or Drink: AI sinh câu hỏi bựa theo ngữ cảnh. */
export async function getQuestionAI(input: {
  tier: Tier;
  spotlightName?: string;
  spotlightZodiac?: string;
  bannedTopics?: string[];
  usedQuestions?: string[];
}): Promise<string> {
  const tierName =
    input.tier === "warm"
      ? "KHỞI ĐỘNG (hài hước, nhẹ nhàng)"
      : input.tier === "mid"
        ? "TẦM TRUNG (xoáy sâu, hơi bựa)"
        : "CAY (rất bựa, táo bạo)";
  const banned = input.bannedTopics?.length
    ? `CẤM CÁC CHỦ ĐỀ NÀY: ${input.bannedTopics.join(", ")}.`
    : "Không có chủ đề cấm.";
  const nameStr = input.spotlightName ? `Người bị hỏi tên là ${input.spotlightName}` : "Người bị hỏi";
  const zodiacStr = input.spotlightZodiac ? ` (cung ${input.spotlightZodiac})` : "";

  const prompt = `Mức độ câu hỏi: ${tierName}. ${nameStr}${zodiacStr}. ${banned} Hãy tạo 1 câu hỏi Truth or Drink cực kỳ hài hước và bựa. Trả về đúng JSON: {"question": "nội dung câu hỏi"}`;

  const aiResult = await callGeminiJSON<{ question: string }>(prompt, SYSTEM_QUESTION);
  if (aiResult?.question && aiResult.question.trim().length > 5) {
    return aiResult.question.trim();
  }

  // Fallback offline từ ngân hàng câu hỏi
  const fallback = pickQuestions(
    input.tier,
    input.bannedTopics ?? [],
    input.usedQuestions ?? [],
    1,
    Date.now(),
  )[0];
  return fallback ?? "Bạn từng nói dối để trốn một buổi hẹn chưa?";
}

/** Engine Chế độ 2 — AI sinh 2 lựa chọn A/B cho người vừa khai giao người kế. */
export async function getNextQuestionOptionsAI(input: {
  tier: Tier;
  bannedTopics?: string[];
  usedQuestions?: string[];
}): Promise<[string, string]> {
  const tierName =
    input.tier === "warm" ? "KHỞI ĐỘNG" : input.tier === "mid" ? "TẦM TRUNG" : "CAY";
  const banned = input.bannedTopics?.length
    ? `CẤM CÁC CHỦ ĐỀ: ${input.bannedTopics.join(", ")}.`
    : "";

  const prompt = `Mức độ: ${tierName}. ${banned} Tạo 2 câu hỏi Truth or Drink hài hước khác nhau để người chơi lựa chọn giao cho người tiếp theo. Trả về đúng JSON: {"optionA": "câu hỏi A", "optionB": "câu hỏi B"}`;

  const aiResult = await callGeminiJSON<{ optionA: string; optionB: string }>(
    prompt,
    SYSTEM_QUESTION,
  );
  if (aiResult?.optionA && aiResult?.optionB) {
    return [aiResult.optionA.trim(), aiResult.optionB.trim()];
  }

  const fallback = pickQuestions(
    input.tier,
    input.bannedTopics ?? [],
    input.usedQuestions ?? [],
    2,
    Date.now(),
  );
  if (fallback.length === 2) return [fallback[0], fallback[1]];
  return [
    "Kể về lần gần nhất bạn nói dối?",
    "Món ăn kỳ quặc nhất bạn từng thử?",
  ];
}
