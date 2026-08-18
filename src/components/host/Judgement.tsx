"use client";

import type { Player, Round } from "@/lib/types";
import { HostFrame } from "@/components/ui/Stage";
import { useLanguage } from "@/lib/i18n";

export function Judgement({
  round,
  spotlight,
  next,
}: {
  round: Round;
  spotlight: Player | null;
  next: Player | null;
}) {
  const { lang } = useLanguage();
  const tin = round.votes.filter((v) => v.value === "tin").length;
  const doi = round.votes.filter((v) => v.value === "doi").length;
  const name = spotlight?.name ?? (lang === "en" ? "Player" : "Người đó");
  const nextName = next?.name ?? (lang === "en" ? "Next player" : "Người kế");
  const reversed = round.type === "reverse";
  const rage = round.type === "rage";
  const duel = round.type === "duel";
  const mult = rage || duel ? 2 : 1;

  const view = (() => {
    switch (round.outcome) {
      case "liar":
        return {
          bg: "bg-danger",
          tag: rage
            ? `${doi} – ${tin} · ${lang === "en" ? "ORACLE RAGE" : "THẦY PHÁN NỔI GIẬN"}`
            : duel
              ? `${doi} – ${tin} · ${lang === "en" ? "DUEL" : "ĐẤU TAY ĐÔI"}`
              : `${doi} – ${tin} · ${lang === "en" ? "MOSTLY LIAR VOTES" : "CẢ BÀN KHÔNG TIN"}`,
          title: (
            <>
              {lang === "en" ? <>CAUGHT<br />LYING</> : <>NÓI DỐI<br />RÀNH RÀNH</>}
            </>
          ),
          sips: 2 * mult,
          line: lang === "en" ? `${name} drinks ${2 * mult} sips. ${nextName} is up next.` : `${name} uống ${2 * mult} ngụm. ${nextName} ra câu tiếp.`,
        };
      case "skipped":
        return {
          bg: "bg-accent",
          tag: lang === "en" ? "PASSED QUESTION" : "KHÔNG DÁM KHAI",
          title: (
            <>
              {lang === "en" ? <>NICE<br />PASS</> : <>NÉ ĐẸP<br />LẮM</>}
            </>
          ),
          sips: reversed ? 0 : 1 * mult,
          line: reversed
            ? (lang === "en" ? `Reversed round — ${name} passed so free!` : `Vòng ngược đời — ${name} né nên thoát.`)
            : (lang === "en" ? `${name} drinks ${1 * mult} sip. ${nextName} is up next.` : `${name} ngụm một cái. ${nextName} ra câu tiếp.`),
        };
      case "immune":
        return {
          bg: "bg-ink",
          tag: lang === "en" ? "IMMUNITY SHIELD" : "QUYỀN MIỄN TRỪ",
          title: (
            <>
              {lang === "en" ? <>COMPLETELY<br />SAFE</> : <>THOÁT<br />SẠCH</>}
            </>
          ),
          sips: 0,
          line: lang === "en" ? `${name} used immunity shield. ${nextName} is up next.` : `${name} hết quyền miễn trừ. ${nextName} ra câu tiếp.`,
        };
      default:
        return {
          bg: "bg-safe",
          tag: `${tin} – ${doi} · ${lang === "en" ? "MOSTLY TRUTH VOTES" : "CẢ BÀN TIN"}`,
          title: (
            <>
              {lang === "en" ? <>HONEST<br />TRUTH</> : <>THẦY TIN<br />THẬT THÀ</>}
            </>
          ),
          sips: reversed ? 1 * mult : 0,
          line: reversed
            ? (lang === "en" ? `Reversed round — honest drinks! ${name} drink up.` : `Vòng ngược đời — thật thà thì uống. ${name} ngụm đi.`)
            : (lang === "en" ? `${name} is safe. ${nextName} is up next.` : `${name} thoát. ${nextName} ra câu tiếp.`),
        };
    }
  })();

  const onDark = round.outcome === "immune";

  return (
    <HostFrame spread className={`${view.bg} ${onDark ? "text-text" : "text-ink"}`}>
      <div className={`t-label ${onDark ? "text-text-faint" : "opacity-55"}`}>{view.tag}</div>

      <div className="flex items-center gap-10">
        <div className={`t-display flex-1 ${onDark ? "text-safe" : ""}`}>{view.title}</div>
        <div className="flex h-[220px] w-[220px] shrink-0 animate-[bsPop_0.45s_cubic-bezier(0.2,1.5,0.4,1)_both] flex-col items-center justify-center rounded-full bg-ink text-accent">
          {view.sips > 0 ? (
            <>
              <div className="text-[104px] leading-[0.82] font-black tracking-[-0.05em] tabular-nums">
                {view.sips}
              </div>
              <div className="text-[26px] leading-[1.18] font-black">{lang === "en" ? "SIP" : "NGỤM"}</div>
            </>
          ) : (
            <div className="text-[104px] leading-none font-black text-safe">✓</div>
          )}
        </div>
      </div>

      <div className={`t-body ${onDark ? "text-text-dim" : "opacity-70"}`}>{view.line}</div>
    </HostFrame>
  );
}
