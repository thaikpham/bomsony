import { NextResponse } from "next/server";
import { getNextQuestionOptionsAI, getQuestionAI } from "@/lib/gemini";
import type { Tier } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    type?: "single" | "options";
    tier?: Tier;
    spotlightName?: string;
    spotlightZodiac?: string;
    bannedTopics?: string[];
    usedQuestions?: string[];
  };

  const tier = body.tier ?? "warm";

  if (body.type === "options") {
    const options = await getNextQuestionOptionsAI({
      tier,
      bannedTopics: body.bannedTopics,
      usedQuestions: body.usedQuestions,
    });
    return NextResponse.json({ options, source: process.env.GEMINI_API_KEY ? "gemini" : "local" });
  }

  const question = await getQuestionAI({
    tier,
    spotlightName: body.spotlightName,
    spotlightZodiac: body.spotlightZodiac,
    bannedTopics: body.bannedTopics,
    usedQuestions: body.usedQuestions,
  });

  return NextResponse.json({ question, source: process.env.GEMINI_API_KEY ? "gemini" : "local" });
}
