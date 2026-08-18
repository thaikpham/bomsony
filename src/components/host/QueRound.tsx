"use client";

import type { Player, Round } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { HostFrame } from "@/components/ui/Stage";
import { useLanguage } from "@/lib/i18n";

export function QueRound({
  round,
  players,
}: {
  round: Round;
  players: Player[];
}) {
  const { lang, t } = useLanguage();
  const rage = round.type === "rage";
  const byId = new Map(players.map((p) => [p.id, p]));
  const done = round.verdicts.filter((v) => v.drunk).length;
  const total = round.verdicts.length;

  return (
    <HostFrame className={rage ? "bg-danger text-ink" : ""}>
      <div className="flex shrink-0 items-baseline justify-between">
        <div className={`t-label ${rage ? "opacity-55" : "text-text-faint"}`}>
          {t("round")} {round.index}
        </div>
        <div className={`t-label ${rage ? "opacity-55" : "text-text-faint"}`}>
          {rage ? t("rageRound") : t("modeQueTitle")}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-4 content-center gap-5">
        {round.verdicts.map((v) => {
          const p = byId.get(v.playerId);
          if (!p) return null;
          return (
            <div
              key={v.playerId}
              className={`flex animate-[bsPop_0.45s_cubic-bezier(0.2,1.5,0.4,1)_both] flex-col items-center gap-2 rounded-card p-4 ${
                rage ? "bg-ink/15" : "bg-surface"
              }`}
            >
              <Avatar name={p.name} src={p.avatarUrl} size={56} fontSize={18} />
              <div
                className={`t-numeral text-[52px] ${
                  v.drunk ? "text-safe" : rage ? "text-ink" : "text-accent"
                }`}
              >
                {v.dose}%
              </div>
              <div className="text-[18px] font-bold">{p.name}</div>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center justify-between">
        <div className={`t-body ${rage ? "opacity-70" : "text-text-dim"}`}>
          {rage ? (lang === "en" ? "Double doses. No escape!" : "Án nhân đôi. Không ai thoát.") : (lang === "en" ? "Oracle has spoken. Drink up!" : "Thầy phán xong rồi. Uống đi.")}
        </div>
        <div
          className={`t-label animate-[bsBreathe_1.6s_ease-in-out_infinite] ${
            rage ? "opacity-70" : "text-[rgb(245_243_238/0.35)]"
          }`}
        >
          {done} / {total} {lang === "en" ? "FINISHED" : "ĐÃ CẠN"}
        </div>
      </div>
    </HostFrame>
  );
}

export function TableRound({
  round,
  players,
}: {
  round: Round;
  players: Player[];
}) {
  const { lang, t } = useLanguage();
  const byId = new Map(players.map((p) => [p.id, p]));
  const hit = round.verdicts.map((v) => byId.get(v.playerId)).filter(Boolean) as Player[];
  const questionText = lang === "en" && round.questionEn ? round.questionEn : (round.question ?? "");

  return (
    <HostFrame>
      <div className="flex shrink-0 items-baseline justify-between">
        <div className="t-label text-text-faint">{t("round")} {round.index}</div>
        <div className="t-label text-text-faint">{t("tableRound")}</div>
      </div>

      <div className="flex min-h-0 flex-1 items-center">
        <div className="text-[52px] leading-[1.24] font-black tracking-[-0.035em] text-accent [text-wrap:pretty]">
          {questionText}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex flex-1 items-center gap-3">
          {hit.map((p) => (
            <Avatar key={p.id} name={p.name} src={p.avatarUrl} size={56} fontSize={18} />
          ))}
        </div>
        <div className="t-label shrink-0 animate-[bsBreathe_1.6s_ease-in-out_infinite] text-[rgb(245_243_238/0.35)]">
          {hit.length ? `${hit.length} ${lang === "en" ? "HIT" : "DÍNH"}` : (lang === "en" ? "TAP ON PHONE IF HIT" : "AI DÍNH THÌ BẤM")}
        </div>
      </div>
    </HostFrame>
  );
}
