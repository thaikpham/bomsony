import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { DOSE_LABEL, type Dose } from "@/lib/types";
import { makeVerdict } from "@/lib/verdicts";
import { getVerdictAI } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Thầy Phán sinh bằng Claude — gọi từ server route, không bao giờ để API key
 * trên client.
 *
 * Không có `ANTHROPIC_API_KEY` thì rơi về bộ lời phán dựng sẵn trong
 * `src/lib/verdicts.ts` — game vẫn chạy đủ, chỉ là ít bất ngờ hơn.
 * Cache theo (zodiac, lifePath, round) để tiết kiệm token và giảm latency.
 */

const SYSTEM = `Bạn là "Thầy Phán" trong game nhậu Bợm Sony.
Giọng: bựa, ngắn, ra lệnh, không giải thích.

Ràng buộc bắt buộc:
- Lời phán tối đa 12 từ tiếng Việt.
- Nhắc tới cung hoàng đạo hoặc số chủ đạo một cách hài, phán bừa nhưng nghe có lý.
- Không xúc phạm ngoại hình, gia đình, giới tính, tôn giáo.
- Không đụng tới bất kỳ chủ đề nào trong danh sách cấm được đưa vào.
- Không khuyến khích uống quá mức: trần là 100% = 1 ly, không bao giờ hơn.`;

const cache = new Map<string, VerdictPayload>();

type VerdictPayload = {
  dose: Dose;
  label: string;
  line: string;
};

const SCHEMA = {
  type: "object",
  properties: {
    dose: { type: "integer", enum: [100, 50, 25] },
    label: { type: "string", enum: ["CẠN LY", "NỬA LY", "NHẤP MÔI"] },
    line: { type: "string", maxLength: 80 },
  },
  required: ["dose", "label", "line"],
  additionalProperties: false,
} as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    playerId?: string;
    zodiac?: string;
    lifePath?: number;
    round?: number;
    bannedTopics?: string[];
    rage?: boolean;
  };

  const zodiac = body.zodiac ?? "BỌ CẠP";
  const lifePath = body.lifePath ?? 8;
  const round = body.round ?? 1;
  const key = `${zodiac}|${lifePath}|${round}|${body.rage ? "rage" : ""}`;

  const cached = cache.get(key);
  if (cached) return NextResponse.json({ verdict: cached, source: "cache" });

  const fallback = (): VerdictPayload => {
    const v = makeVerdict({
      playerId: body.playerId ?? "x",
      zodiac,
      lifePath,
      round,
      rage: body.rage,
    });
    return { dose: v.dose, label: v.label, line: v.line };
  };

  if (process.env.GEMINI_API_KEY) {
    const verdict = await getVerdictAI({
      playerId: body.playerId ?? "x",
      zodiac,
      lifePath,
      round,
      bannedTopics: body.bannedTopics,
      rage: body.rage,
    });
    cache.set(key, verdict);
    return NextResponse.json({ verdict, source: "gemini" });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const client = new Anthropic({ apiKey: anthropicKey });
      const banned = body.bannedTopics?.length
        ? `Chủ đề cấm tuyệt đối: ${body.bannedTopics.join(", ")}.`
        : "Không có chủ đề cấm.";

      const response = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: 1024,
        system: SYSTEM,
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
        messages: [
          {
            role: "user",
            content: `Vòng ${round}. Cung ${zodiac}, số chủ đạo ${lifePath}. ${banned}${
              body.rage ? " Đây là vòng Thầy Phán nổi giận — án nặng hơn bình thường." : ""
            } Phán mức uống cho người này.`,
          },
        ],
      });

      if (response.stop_reason !== "refusal") {
        const text = response.content.find((b) => b.type === "text");
        const parsed = text ? (JSON.parse(text.text) as VerdictPayload) : null;
        if (parsed && [100, 50, 25].includes(parsed.dose)) {
          const verdict: VerdictPayload = {
            dose: parsed.dose,
            label: DOSE_LABEL(parsed.dose),
            line: parsed.line.trim(),
          };
          cache.set(key, verdict);
          return NextResponse.json({ verdict, source: "claude" });
        }
      }
    } catch {
      // Tiếp tục xuống local fallback
    }
  }

  return NextResponse.json({ verdict: fallback(), source: "local" });
}
