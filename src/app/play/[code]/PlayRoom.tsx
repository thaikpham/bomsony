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
import { TrollLayer } from "@/components/host/TrollLayer";
import { HAPTIC, vibrate } from "@/lib/haptics";
import { useIdentity } from "@/lib/identity";
import { useRoom } from "@/lib/useRoom";
import type { VoteValue, Mode } from "@/lib/types";

/** Bước cục bộ trong màn hiện tại — server không cần biết. */
type Step = "auto" | "push" | "speak" | "judged";

export function PlayRoom({ code }: { code: string }) {
  const { room, status, toast, say, deny, send } = useRoom(code);
  const me = useIdentity();
  const [step, setStep] = useState<Step>("auto");
  const rejoined = useRef(false);

  // Reload giữa trận / rớt mạng → tự vào lại phòng, không bắt gõ tên lần nữa.
  useEffect(() => {
    if (!me || !room || rejoined.current) return;
    rejoined.current = true;
    if (!room.players.some((p) => p.id === me.id)) {
      void send({ t: "join", playerId: me.id, name: me.name, avatarUrl: me.avatarUrl });
    } else {
      void send({ t: "presence", playerId: me.id, connected: true });
    }
  }, [me, room, send]);

  const round = room?.current ?? null;

  // Vòng mới thì mọi bước cục bộ về mặc định — reset ngay trong lúc render
  const stepKey = `${room?.phase ?? ""}:${round?.index ?? 0}`;
  const [prevStepKey, setPrevStepKey] = useState(stepKey);
  if (prevStepKey !== stepKey) {
    setPrevStepKey(stepKey);
    setStep("auto");
  }

  const player = useMemo(
    () => room?.players.find((p) => p.id === me?.id) ?? null,
    [room, me],
  );

  if (status === "gone") {
    return (
      <PhoneShell>
        <PhoneWait label="BỢM SONY" title="PHÒNG ĐÃ TAN" line="Mở trang chủ để tạo phòng mới." />
      </PhoneShell>
    );
  }
  if (!me) return <JoinForm initialCode={code} />;
  if (!room || !player) {
    return (
      <PhoneShell>
        <PhoneWait label="BỢM SONY" title="ĐANG NỐI" line="Chờ một nhịp." />
      </PhoneShell>
    );
  }

  const spotlight = round?.spotlightPlayerId
    ? (room.players.find((p) => p.id === round.spotlightPlayerId) ?? null)
    : null;
  const connected = room.players.filter((p) => p.connected);
  const nextUp =
    spotlight && connected.length > 1
      ? connected[(connected.findIndex((p) => p.id === spotlight.id) + 1) % connected.length]
      : null;

  const isSpotlight = round?.spotlightPlayerId === player.id;
  const myVerdict = round?.verdicts.find((v) => v.playerId === player.id) ?? null;
  const myVote = round?.votes.find((v) => v.voterId === player.id) ?? null;
  const tin = round?.votes.filter((v) => v.value === "tin").length ?? 0;
  const doi = round?.votes.filter((v) => v.value === "doi").length ?? 0;
  const reversed = round?.type === "reverse";
  const rage = round?.type === "rage";
  const duel = round?.type === "duel";

  const body = (() => {
    // ── 1. Trước trận / Phòng chờ trên điện thoại ───────────────────────
    if (room.phase === "lobby") {
      if (room.mode === "que" && !player.birthDate) {
        return (
          <Birthdate
            onSubmit={(iso) => {
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

    // ── 2. Chốt Vùng Cấm trên điện thoại ────────────────────────────────
    if (room.phase === "safety") {
      return (
        <SafetyMobile
          banned={room.bannedTopics}
          onToggle={(topic) =>
            void send({
              t: "setSafety",
              bannedTopics: room.bannedTopics.includes(topic)
                ? room.bannedTopics.filter((x) => x !== topic)
                : [...room.bannedTopics, topic],
            })
          }
          onStart={() => void send({ t: "startGame" })}
        />
      );
    }

    // ── 3. Tổng kết / Podium trên điện thoại ─────────────────────────────
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

    // ── 4. Chế độ 1 — Quẻ (Số trời đã định) ─────────────────────────────
    if (room.mode === "que") {
      if (round.type === "table" && !myVerdict) {
        return (
          <>
            <div className="t-label shrink-0 text-accent">CẢ BÀN DÍNH</div>
            <div className="flex min-h-0 flex-1 items-center">
              <div className="animate-[bsPop_0.34s_cubic-bezier(0.2,1.5,0.4,1)_both] text-[40px] leading-[1.28] font-black tracking-[-0.025em] text-accent [text-wrap:pretty]">
                {round.question}
              </div>
            </div>
            <ChunkyButton
              tone="danger"
              onClick={() => void send({ t: "tableHit", playerId: player.id })}
            >
              DÍNH
            </ChunkyButton>
            <ChunkyButton tone="surface" height={66} fontSize={20} onClick={() => say("Thầy tin bạn")}>
              KHÔNG DÍNH
            </ChunkyButton>
          </>
        );
      }
      if (!myVerdict) {
        return <PhoneWait label={`VÒNG ${round.index}`} title={<>THOÁT VÒNG NÀY</>} line="Chờ cả bàn cạn xong." />;
      }
      if (myVerdict.drunk) {
        return (
          <QueDone
            dose={myVerdict.dose}
            drunkCount={round.verdicts.filter((v) => v.drunk).length}
            totalPlayers={room.players.length}
            onNextRound={() => void send({ t: "nextRound" })}
          />
        );
      }
      if (step === "push") {
        return (
          <PushPick
            players={room.players.filter((p) => p.id !== player.id)}
            onPick={(targetId) => {
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
        ? round.clashPair!.find((id) => id !== player.id)!
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
            if (player.pushUsed) deny("Hết lượt đẩy");
            else setStep("push");
          }}
          onDuel={() => {
            void send({ t: "duel", playerId: player.id });
            say("Thách đấu — 100%");
          }}
          onFlipLuck={() => void send({ t: "flipLuck", playerId: player.id })}
          onClashResult={(win) =>
            void send({
              t: "clashResult",
              winnerId: win ? player.id : opponentId,
              loserId: win ? opponentId : player.id,
            })
          }
        />
      );
    }

    // ── 5. Chế độ 2 — Truth or Drink ────────────────────────────────────
    // Khi chốt phiếu / Reveal ➔ Tất cả điện thoại hiện màn Phán Xét đồng bộ
    if (room.phase === "reveal" && round.spotlightPlayerId) {
      const opts = round.nextQuestionOptions;
      if (isSpotlight && opts && opts[0] !== opts[1]) {
        return (
          <NextQuestionPick
            options={opts}
            onPick={(index) => void send({ t: "chooseNext", playerId: player.id, index })}
          />
        );
      }
      return (
        <JudgementMobile
          round={round}
          spotlight={spotlight}
          next={nextUp}
          onTroll={(label) => void send({ t: "troll", playerId: player.id, label })}
          onNextRound={() => void send({ t: "nextRound" })}
        />
      );
    }

    // Người bị hỏi (Spotlight Player)
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
            label={`VÒNG ${round.index}`}
            title={<>ĐANG ĐẾM PHIẾU</>}
            line={`${tin} tin · ${doi} nói dối. Chờ cả bàn bấm xong.`}
          />
        );
      }
      return (
        <TurnAsk
          question={round.question ?? ""}
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

    // Những người chơi còn lại: Bỏ phiếu trên điện thoại
    return (
      <>
        <VoteHeader spotlight={spotlight} question={round.question} />
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
      <PhoneShell>{body}</PhoneShell>
      <TrollLayer trolls={room.trolls} />
      <Toast value={toast} />
    </>
  );
}
