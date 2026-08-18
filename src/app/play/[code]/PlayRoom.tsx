"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Birthdate } from "@/components/phone/Birthdate";
import { JoinForm } from "@/components/phone/JoinForm";
import { LobbyMobile } from "@/components/phone/LobbyMobile";
import { SafetyMobile } from "@/components/phone/SafetyMobile";
import { JudgementMobile } from "@/components/phone/JudgementMobile";
import { PodiumMobile } from "@/components/phone/PodiumMobile";
import { PushPick, QueDone, QueVerdict } from "@/components/phone/QueVerdict";
import {
  NextQuestionPick,
  TurnAsk,
  TurnSpeak,
} from "@/components/phone/Turn";
import { PhoneWait, VoteChoice, VoteCount, VoteHeader } from "@/components/phone/Vote";
import { ChunkyButton } from "@/components/ui/Buttons";
import { PhoneShell } from "@/components/ui/Stage";
import { Toast } from "@/components/ui/Toast";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { TrollLayer } from "@/components/host/TrollLayer";
import { HAPTIC, vibrate } from "@/lib/haptics";
import { useRouter } from "next/navigation";
import { useIdentity } from "@/lib/identity";
import { useRoom } from "@/lib/useRoom";
import { useLanguage } from "@/lib/i18n";
import type { VoteValue, Mode, Player, Verdict, Vote } from "@/lib/types";
import { LeaderboardModal } from "@/components/phone/LeaderboardModal";

type Step = "auto" | "push" | "speak" | "judged";

export function PlayRoom({ code }: { code: string }) {
  const router = useRouter();
  const { room, status, toast, say, deny, send } = useRoom(code);
  const me = useIdentity();
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<Step>("auto");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const rejoined = useRef(false);

  useEffect(() => {
    if (!me || !room || rejoined.current) return;
    rejoined.current = true;
    if (!room.players.some((p: Player) => p.id === me.id)) {
      void send({ t: "join", playerId: me.id, name: me.name, avatarUrl: me.avatarUrl });
    } else {
      void send({ t: "presence", playerId: me.id, connected: true });
    }
  }, [me, room, send]);

  const round = room?.current ?? null;

  const stepKey = `${room?.phase ?? ""}:${round?.index ?? 0}`;
  const [prevStepKey, setPrevStepKey] = useState(stepKey);
  if (prevStepKey !== stepKey) {
    setPrevStepKey(stepKey);
    setStep("auto");
  }

  const player = useMemo(
    () => room?.players.find((p: Player) => p.id === me?.id) ?? null,
    [room, me],
  );

  if (status === "gone") {
    return (
      <PhoneShell>
        <PhoneWait label="BỢM SONY" title={t("roomGone")} line="Mở trang chủ để tạo phòng mới." />
      </PhoneShell>
    );
  }
  if (!me) return <JoinForm initialCode={code} />;
  if (!room || !player) {
    return (
      <PhoneShell>
        <PhoneWait label="BỢM SONY" title={t("reconnectNotice")} line="Chờ một nhịp." />
      </PhoneShell>
    );
  }

  const spotlight = round?.spotlightPlayerId
    ? (room.players.find((p: Player) => p.id === round.spotlightPlayerId) ?? null)
    : null;
  const connected = room.players.filter((p: Player) => p.connected);
  const nextUp =
    spotlight && connected.length > 1
      ? connected[(connected.findIndex((p: Player) => p.id === spotlight.id) + 1) % connected.length]
      : null;

  const isSpotlight = round?.spotlightPlayerId === player.id;
  const myVerdict = round?.verdicts.find((v: Verdict) => v.playerId === player.id) ?? null;
  const myVote = round?.votes.find((v: Vote) => v.voterId === player.id) ?? null;
  const tin = round?.votes.filter((v: Vote) => v.value === "tin").length ?? 0;
  const doi = round?.votes.filter((v: Vote) => v.value === "doi").length ?? 0;
  const reversed = round?.type === "reverse";
  const rage = round?.type === "rage";
  const duel = round?.type === "duel";

  const questionText = lang === "en" && round?.questionEn ? round.questionEn : (round?.question ?? "");
  const nextQuestionOptions = (lang === "en" && round?.nextQuestionOptionsEn ? round.nextQuestionOptionsEn : round?.nextQuestionOptions) ?? null;

  const body = (() => {
    if (room.phase === "lobby") {
      if (room.mode === "que" && !player.birthDate) {
        return (
          <Birthdate
            onSubmit={(iso: string) => {
              vibrate(HAPTIC.sub);
              void send({ t: "setBirthDate", playerId: player.id, birthDate: iso });
            }}
          />
        );
      }
      return (
        <LobbyMobile
          code={room.code}
          mode={room.mode}
          players={room.players}
          onPickMode={(mode: Mode) => void send({ t: "setMode", mode })}
          onStart={() => void send({ t: "startGame" })}
        />
      );
    }

    if (room.phase === "safety") {
      return (
        <SafetyMobile
          banned={room.bannedTopics}
          onToggle={(topic: string) =>
            void send({
              t: "setSafety",
              bannedTopics: room.bannedTopics.includes(topic)
                ? room.bannedTopics.filter((x: string) => x !== topic)
                : [...room.bannedTopics, topic],
            })
          }
          onStart={() => void send({ t: "startGame" })}
        />
      );
    }

    if (room.phase === "final") {
      return (
        <PodiumMobile
          players={room.players}
          onNewGame={() => void send({ t: "newGame" })}
        />
      );
    }

    if (!round) {
      return <PhoneWait label="BỢM SONY" title={<>ĐANG XẾP VÒNG</>} line="Chờ Thầy Phán." />;
    }

    if (room.mode === "que") {
      if (round.type === "table" && !myVerdict) {
        return (
          <>
            <div className="t-label shrink-0 text-accent">{t("tableRound")}</div>
            <div className="flex min-h-0 flex-1 items-center">
              <div className="animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[36px] leading-[1.28] font-black tracking-[-0.025em] text-accent [text-wrap:pretty]">
                {questionText}
              </div>
            </div>
            <ChunkyButton
              tone="danger"
              onClick={() => void send({ t: "tableHit", playerId: player.id })}
            >
              {lang === "en" ? "HIT" : "DÍNH"}
            </ChunkyButton>
            <ChunkyButton tone="surface" height={66} fontSize={20} onClick={() => say(lang === "en" ? "Oracle trusts you" : "Thầy tin bạn")}>
              {lang === "en" ? "SAFE" : "KHÔNG DÍNH"}
            </ChunkyButton>
          </>
        );
      }
      if (!myVerdict) {
        return (
          <PhoneWait
            label={`${t("round")} ${round.index}`}
            title={<>{lang === "en" ? "SAFE THIS ROUND" : "THOÁT VÒNG NÀY"}</>}
            line={lang === "en" ? "Waiting for others to finish." : "Chờ cả bàn cạn xong."}
            cta={{ text: `${lang === "en" ? "NEXT ROUND" : "VÒNG TIẾP"} ➔`, onClick: () => void send({ t: "nextRound" }) }}
          />
        );
      }
      if (myVerdict.drunk) {
        return (
          <QueDone
            dose={myVerdict.dose}
            drunkCount={round.verdicts.filter((v: Verdict) => v.drunk).length}
            totalPlayers={room.players.length}
            onNextRound={() => void send({ t: "nextRound" })}
          />
        );
      }
      if (step === "push") {
        return (
          <PushPick
            players={room.players.filter((p: Player) => p.id !== player.id)}
            onPick={(targetId: string) => {
              setStep("auto");
              void send({ t: "push", playerId: player.id, targetId });
            }}
            onCancel={() => setStep("auto")}
          />
        );
      }
      const isClashing = Boolean(
        round.clashPair && round.clashPair.includes(player.id),
      );
      const opponentId = isClashing
        ? round.clashPair!.find((id: string) => id !== player.id)!
        : "";

      return (
        <QueVerdict
          round={round.index}
          zodiac={player.zodiac}
          lifePath={player.lifePathNumber}
          verdict={myVerdict}
          appealUsed={player.appealUsed}
          pushUsed={player.pushUsed}
          clash={isClashing}
          onDrink={() => void send({ t: "drink", playerId: player.id })}
          onAppeal={() => void send({ t: "appeal", playerId: player.id })}
          onPush={() => {
            if (player.pushUsed) deny(lang === "en" ? "No pushes left" : "Hết lượt đẩy");
            else setStep("push");
          }}
          onDuel={() => {
            void send({ t: "duel", playerId: player.id });
            say(lang === "en" ? "Duel - 100%" : "Thách đấu — 100%");
          }}
          onFlipLuck={() => void send({ t: "flipLuck", playerId: player.id })}
          onClashResult={(win: boolean) =>
            void send({
              t: "clashResult",
              winnerId: win ? player.id : opponentId,
              loserId: win ? opponentId : player.id,
            })
          }
        />
      );
    }

    if (room.phase === "reveal" && round.spotlightPlayerId) {
      if (isSpotlight && nextQuestionOptions && nextQuestionOptions[0] !== nextQuestionOptions[1]) {
        return (
          <NextQuestionPick
            options={nextQuestionOptions}
            onPick={(index: 0 | 1) => void send({ t: "chooseNext", playerId: player.id, index })}
          />
        );
      }
      return (
        <JudgementMobile
          round={round}
          spotlight={spotlight}
          next={nextUp}
          onTroll={(label: string) => void send({ t: "troll", playerId: player.id, label })}
          onNextRound={() => void send({ t: "nextRound" })}
        />
      );
    }

    if (isSpotlight) {
      if (step === "speak") {
        return (
          <TurnSpeak
            onDone={() => {
              void send({ t: "speakDone", playerId: player.id });
              setStep("judged");
            }}
          />
        );
      }
      if (step === "judged") {
        return (
          <PhoneWait
            label={`${t("round")} ${round.index}`}
            title={<>{lang === "en" ? "COUNTING VOTES" : "ĐANG ĐẾM PHIẾU"}</>}
            line={`${tin} ${t("voteTin")} · ${doi} ${t("voteDoi")}. ${lang === "en" ? "Waiting for everyone to vote." : "Chờ cả bàn bấm xong."}`}
          />
        );
      }
      return (
        <TurnAsk
          question={questionText}
          reversed={reversed}
          rage={rage}
          duel={duel}
          immunityUsed={player.immunityUsed}
          onSpeak={() => setStep("speak")}
          onSip={() => void send({ t: "sip", playerId: player.id })}
          onImmune={() => void send({ t: "immune", playerId: player.id })}
        />
      );
    }

    return (
      <>
        <VoteHeader spotlight={spotlight} question={questionText} />
        {myVote ? (
          <VoteCount tin={tin} doi={doi} />
        ) : (
          <VoteChoice
            onVote={(value: VoteValue) => void send({ t: "vote", playerId: player.id, value })}
          />
        )}
      </>
    );
  })();

  return (
    <>
      <PhoneShell>
        <div className="flex shrink-0 items-center justify-between border-b border-line/40 pb-2 mb-1 gap-2">
          <div className="flex items-center gap-1.5">
            {room.phase === "round" || room.phase === "reveal" ? (
              <span className="t-label text-accent">{t("round")} {round?.index}</span>
            ) : (
              <span className="t-label text-accent font-bold">BỢM SONY</span>
            )}
            <button
              type="button"
              onClick={() => {
                vibrate(HAPTIC.chip);
                setShowLeaderboard(true);
              }}
              className="rounded-sub border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-black text-accent active:scale-95 transition-transform"
            >
              📊 {lang === "en" ? "RANKS" : "BXH"}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            {room.phase === "round" || room.phase === "reveal" ? (
              room.players[0]?.id === player.id ? (
                <button
                  type="button"
                  onClick={() => {
                    vibrate(HAPTIC.sub);
                    void send({ t: "endGame", playerId: player.id });
                  }}
                  className="rounded-sub border border-danger/40 bg-danger-surface px-2 py-0.5 text-[11px] font-black text-danger-text active:scale-95 transition-transform"
                >
                  👑 {t("endGameBtn")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    vibrate(HAPTIC.sub);
                    void send({ t: "leave", playerId: player.id });
                    router.push("/");
                  }}
                  className="rounded-sub border border-line bg-surface px-2 py-0.5 text-[11px] font-black text-text-dim active:scale-95 transition-transform"
                >
                  🚪 {lang === "en" ? "LEAVE" : "RỜI"}
                </button>
              )
            ) : null}
          </div>
        </div>

        {body}
      </PhoneShell>

      {showLeaderboard ? (
        <LeaderboardModal
          players={room.players}
          onClose={() => setShowLeaderboard(false)}
        />
      ) : null}
      <TrollLayer trolls={room.trolls} />
      <Toast value={toast} />
    </>
  );
}
