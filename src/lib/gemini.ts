import { DOSE_LABEL, type Dose, type Tier } from "./types";
import { makeVerdict } from "./verdicts";
import { pickQuestions, getQuestionText } from "./questions";
import type { Language } from "./i18n";

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

const SYSTEM_VERDICT_VI = `Bạn là "Thầy Phán" trong game nhậu Bợm Sony.
Giọng: bựa, ngắn, ra lệnh, không giải thích.

Ràng buộc bắt buộc:
- Lời phán tối đa 12 từ tiếng Việt.
- Nhắc tới cung hoàng đạo hoặc số chủ đạo một cách hài, phán bừa nhưng nghe có lý.
- Không xúc phạm ngoại hình, gia đình, giới tính, tôn giáo.
- Không đụng tới bất kỳ chủ đề nào trong danh sách cấm được đưa vào.
- Không khuyến khích uống quá mức: trần là 100% = 1 ly, không bao giờ hơn.`;

const SYSTEM_VERDICT_EN = `You are "The Oracle" in the drinking party game Bợm Sony.
Tone: hilarious, cheeky, witty, commanding, brief.

Strict constraints:
- Oracle verdict MUST be in English, maximum 12 words.
- Humorously reference player's zodiac sign or numerology life path.
- No insults regarding appearance, family, gender, or religion.
- Never touch any banned topics provided.
- Cap dose at 100% = 1 full glass max.`;

const SYSTEM_QUESTION_VI = `Bạn là "Thầy Phán" chuyên đặt câu hỏi Truth or Drink cho game nhậu Bợm Sony.
Giọng: hài hước, bựa, xoáy sâu, kích thích sự tò mò của cả bàn nhậu.

Ràng buộc:
- Câu hỏi tiếng Việt ngắn gọn (tối đa 25 từ).
- Tuyệt đối không chạm vào các chủ đề bị cấm.
- Phù hợp với mức độ quy định (Khởi động / Tầm trung / Cay).`;

const SYSTEM_QUESTION_EN = `You are "The Oracle" crafting Truth or Drink questions for the party game Bợm Sony.
Tone: witty, spicy, funny, provocative for the drinking group.

Constraints:
- Question MUST be in English, concise (max 25 words).
- Absolutely do NOT touch banned topics.
- Match requested difficulty tier (Warm up / Mid tier / Spicy).`;

export type AIVerdict = {
  dose: Dose;
  label: string;
  line: string;
  reason?: string;
};

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

export async function getVerdictAI(input: {
  playerId: string;
  playerName?: string;
  zodiac: string | null;
  lifePath: number | null;
  round: number;
  bannedTopics?: string[];
  rage?: boolean;
  lang?: Language;
}): Promise<AIVerdict> {
  const lang = input.lang ?? "vi";
  const name = input.playerName ?? "Bợm";
  const zodiac = input.zodiac ?? (lang === "en" ? "Scorpio" : "BỌ CẠP");
  const lifePath = input.lifePath ?? 8;
  const round = input.round;
  const banned = input.bannedTopics?.length
    ? `Banned topics: ${input.bannedTopics.join(", ")}.`
    : "No banned topics.";

  const system = lang === "en" ? SYSTEM_VERDICT_EN : SYSTEM_VERDICT_VI;
  const prompt = lang === "en"
    ? `Round ${round}. Player "${name}", Zodiac ${zodiac}, Life Path ${lifePath}. ${banned}${
        input.rage ? " Oracle is in RAGE mode - double penalty." : ""
      } Provide verdict for ${name} in English. Return JSON: {"dose": 100|50|25, "label": "BOTTOMS UP"|"HALF GLASS"|"SIP DOSE", "line": "witty verdict <= 12 words addressing ${name}", "reason": "funny short reason <= 15 words"}`
    : `Vòng ${round}. Người chơi tên "${name}", Cung ${zodiac}, Số chủ đạo ${lifePath}. ${banned}${
        input.rage ? " Đây là vòng Thầy Phán nổi giận — án nặng x2." : ""
      } Phán bựa mức uống cho ${name}. Trả về JSON: {"dose": 100|50|25, "label": "CẠN LY"|"NỬA LY"|"NHẤP MÔI", "line": "lời phán bựa ≤ 12 từ gọi tên ${name}", "reason": "lý do hài hước xéo xắt Thầy phán giải thích vì sao ${name} bị uống mức này ≤ 15 từ"}`;

  const aiResult = await callGeminiJSON<AIVerdict>(prompt, system);
  if (aiResult && [100, 50, 25].includes(aiResult.dose) && aiResult.line) {
    return {
      dose: aiResult.dose,
      label: DOSE_LABEL(aiResult.dose, lang),
      line: aiResult.line.trim(),
      reason: aiResult.reason?.trim() || undefined,
    };
  }

  // Fallback offline
  const v = makeVerdict({
    playerId: input.playerId,
    name,
    zodiac: input.zodiac,
    lifePath: input.lifePath,
    round: input.round,
    rage: input.rage,
  });
  return {
    dose: v.dose,
    label: DOSE_LABEL(v.dose, lang),
    line: lang === "en" ? (v.lineEn || v.line) : v.line,
    reason: lang === "en" ? (v.reasonEn || v.reason) : v.reason,
  };
}

export async function getQuestionAI(input: {
  tier: Tier;
  spotlightName?: string;
  spotlightZodiac?: string;
  bannedTopics?: string[];
  usedQuestions?: string[];
  lang?: Language;
}): Promise<string> {
  const lang = input.lang ?? "vi";
  const tierName = lang === "en"
    ? (input.tier === "warm" ? "WARM UP" : input.tier === "mid" ? "MID TIER" : "SPICY")
    : (input.tier === "warm" ? "KHỞI ĐỘNG" : input.tier === "mid" ? "TẦM TRUNG" : "CAY");

  const banned = input.bannedTopics?.length
    ? `Banned topics: ${input.bannedTopics.join(", ")}.`
    : "";
  const nameStr = input.spotlightName ? `Target player name: ${input.spotlightName}` : "Target player";
  const zodiacStr = input.spotlightZodiac ? ` (${input.spotlightZodiac})` : "";

  const system = lang === "en" ? SYSTEM_QUESTION_EN : SYSTEM_QUESTION_VI;
  const prompt = lang === "en"
    ? `Question difficulty: ${tierName}. ${nameStr}${zodiacStr}. ${banned} Generate a hilarious Truth or Drink question in English. Return JSON: {"question": "question text"}`
    : `Mức độ câu hỏi: ${tierName}. ${nameStr}${zodiacStr}. ${banned} Hãy tạo 1 câu hỏi Truth or Drink cực kỳ hài hước và bựa. Trả về đúng JSON: {"question": "nội dung câu hỏi"}`;

  const aiResult = await callGeminiJSON<{ question: string }>(prompt, system);
  if (aiResult?.question && aiResult.question.trim().length > 5) {
    return aiResult.question.trim();
  }

  // Fallback offline
  const fallback = pickQuestions(
    input.tier,
    input.bannedTopics ?? [],
    input.usedQuestions ?? [],
    1,
    Date.now(),
  )[0];
  return getQuestionText(fallback, lang) || (lang === "en" ? "Have you ever lied to get out of a hang out?" : "Bạn từng nói dối để trốn một buổi hẹn chưa?");
}

export async function getNextQuestionOptionsAI(input: {
  tier: Tier;
  bannedTopics?: string[];
  usedQuestions?: string[];
  lang?: Language;
}): Promise<[string, string]> {
  const lang = input.lang ?? "vi";
  const tierName = input.tier === "warm" ? "WARM UP" : input.tier === "mid" ? "MID TIER" : "SPICY";
  const banned = input.bannedTopics?.length
    ? `Banned topics: ${input.bannedTopics.join(", ")}.`
    : "";

  const system = lang === "en" ? SYSTEM_QUESTION_EN : SYSTEM_QUESTION_VI;
  const prompt = lang === "en"
    ? `Tier: ${tierName}. ${banned} Generate 2 distinct funny Truth or Drink questions in English for the player to choose for the next target. Return JSON: {"optionA": "question A", "optionB": "question B"}`
    : `Mức độ: ${tierName}. ${banned} Tạo 2 câu hỏi Truth or Drink hài hước khác nhau để người chơi lựa chọn giao cho người tiếp theo. Trả về đúng JSON: {"optionA": "câu hỏi A", "optionB": "câu hỏi B"}`;

  const aiResult = await callGeminiJSON<{ optionA: string; optionB: string }>(
    prompt,
    system,
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
  if (fallback.length === 2) {
    return [getQuestionText(fallback[0], lang), getQuestionText(fallback[1], lang)];
  }
  return lang === "en"
    ? ["Tell us about the last time you lied?", "What's the weirdest food you've ever tried?"]
    : ["Kể về lần gần nhất bạn nói dối?", "Món ăn kỳ quặc nhất bạn từng thử?"];
}
