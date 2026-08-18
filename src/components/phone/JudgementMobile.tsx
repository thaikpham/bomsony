"use client";

import type { Player, Round } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { HAPTIC, vibrate } from "@/lib/haptics";
import { useLanguage } from "@/lib/i18n";

export function JudgementMobile({
  round,
  spotlight,
  next,
  onTroll,
  onNextRound,
}: {
  round: Round;
  spotlight: Player | null;
  next: Player | null;
  onTroll: (label: string) => void;
  onNextRound: () => void;
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
          title: lang === "en" ? "CAUGHT LYING!" : "NÓI DỐI RÀNH RÀNH",
          sips: 2 * mult,
          line: lang === "en"
            ? `${name} drinks ${2 * mult} sips. ${nextName} is up next.`
            : `${name} uống ${2 * mult} ngụm. ${nextName} ra câu tiếp.`,
        };
      case "skipped":
        return {
          bg: "bg-accent text-ink",
          tag: lang === "en" ? "PASSED QUESTION" : "KHÔNG DÁM KHAI",
          title: lang === "en" ? "NICE PASS" : "NÉ ĐẸP LẮM",
          sips: reversed ? 0 : 1 * mult,
          line: reversed
            ? (lang === "en" ? `Reversed round — ${name} passed so free!` : `Vòng ngược đời — ${name} né nên thoát.`)
            : (lang === "en" ? `${name} drinks ${1 * mult} sip. ${nextName} is up next.` : `${name} ngụm ${1 * mult} cái. ${nextName} ra câu tiếp.`),
        };
      case "immune":
        return {
          bg: "bg-ink text-text",
          tag: lang === "en" ? "IMMUNITY SHIELD" : "QUYỀN MIỄN TRỪ",
          title: lang === "en" ? "COMPLETELY SAFE" : "THOÁT SẠCH",
          sips: 0,
          line: lang === "en"
            ? `${name} used immunity shield. ${nextName} is up next.`
            : `${name} dùng quyền miễn trừ. ${nextName} ra câu tiếp.`,
        };
      default:
        return {
          bg: "bg-safe text-ink",
          tag: `${tin} – ${doi} · ${lang === "en" ? "MOSTLY TRUTH VOTES" : "CẢ BÀN TIN"}`,
          title: lang === "en" ? "HONEST TRUTH!" : "THẦY TIN THẬT THÀ",
          sips: reversed ? 1 * mult : 0,
          line: reversed
            ? (lang === "en" ? `Reversed round — honest drinks! ${name} drink up.` : `Vòng ngược đời — thật thà thì uống. ${name} ngụm đi.`)
            : (lang === "en" ? `${name} is safe! ${nextName} is up next.` : `${name} thoát! ${nextName} ra câu tiếp.`),
        };
    }
  })();

  return (
    <div className={`-mx-6 -my-14 flex min-h-dvh flex-col justify-between p-6 ${view.bg}`}>
      <div className="t-label opacity-75">{view.tag}</div>

      <div className="flex flex-col items-center gap-4 text-center">
        <Avatar name={name} src={spotlight?.avatarUrl} size={88} fontSize={28} />
        <div className="text-[36px] font-black leading-tight tracking-tight">{view.title}</div>

        <div className="flex h-[140px] w-[140px] animate-[bsPop_0.4s_cubic-bezier(0.2,1.5,0.4,1)_both] flex-col items-center justify-center rounded-full bg-ink text-accent shadow-lg">
          {view.sips > 0 ? (
            <>
              <div className="text-[64px] font-black leading-none">{view.sips}</div>
              <div className="text-[18px] font-black">{lang === "en" ? "SIP" : "NGỤM"}</div>
            </>
          ) : (
            <div className="text-[64px] font-black leading-none text-safe">✓</div>
          )}
        </div>

        <div className="t-body max-w-[320px] opacity-85">{view.line}</div>
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            onNextRound();
          }}
          className="flex h-[66px] w-full items-center justify-center rounded-sub bg-ink text-[22px] font-black text-accent shadow-xl active:scale-95 transition-transform"
        >
          {lang === "en" ? "NEXT ROUND ➔" : "VÒNG TIẾP ➔"}
        </button>

        <div className="flex shrink-0 gap-2">
          {(lang === "en" ? ["CHEERS!", "COWARD", "FAKE!"] : ["DZÔ!", "HÈN", "BỊA DỞ"]).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                vibrate(HAPTIC.chip);
                onTroll(label);
              }}
              className="btn-soft h-[48px] flex-1 rounded-sub border border-line bg-ink/30 text-[16px] font-black text-text backdrop-blur-sm active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
