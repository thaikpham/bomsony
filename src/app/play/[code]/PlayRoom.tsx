"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Birthdate } from "@/components/phone/Birthdate";
import { JoinForm } from "@/components/phone/JoinForm";
import { PushPick, QueDone, QueVerdict } from "@/components/phone/QueVerdict";
import {
  NextQuestionPick,
  TurnAsk,
  TurnImmune,
  TurnJudge,
  TurnSip,
  TurnSpeak,
} from "@/components/phone/Turn";
import { PhoneWait, VoteChoice, VoteCount, VoteHeader, VoteResult } from "@/components/phone/Vote";
import { ChunkyButton } from "@/components/ui/Buttons";
import { PhoneShell } from "@/components/ui/Stage";
import { Toast } from "@/components/ui/Toast";
import { HAPTIC, vibrate } from "@/lib/haptics";
import { useIdentity } from "@/lib/identity";
import { useRoom } from "@/lib/useRoom";
import type { VoteValue } from "@/lib/types";

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

  // Vòng mới thì mọi bước cục bộ về mặc định — reset ngay trong lúc render,
  // không qua effect, nên không có khung hình nào hiện bước cũ.
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
        <PhoneWait label="BỢM SONY" title="PHÒNG ĐÃ TAN" line="Hỏi chủ xị mã mới." />
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
  const isSpotlight = round?.spotlightPlayerId === player.id;
  const myVerdict = round?.verdicts.find((v) => v.playerId === player.id) ?? null;
  const myVote = round?.votes.find((v) => v.voterId === player.id) ?? null;
  const tin = round?.votes.filter((v) => v.value === "tin").length ?? 0;
  const doi = round?.votes.filter((v) => v.value === "doi").length ?? 0;
  const liar = round?.outcome === "liar";
  const reversed = round?.type === "reverse";
  const rage = round?.type === "rage";
  const duel = round?.type === "duel";

  const body = (() => {
    // ── Trước trận ────────────────────────────────────────────────────────
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
        <PhoneWait
          label={`PHÒNG ${room.code}`}
          title={<>ĐANG CHỜ CHỦ XỊ</>}
          line={
            player.birthDate
              ? `${player.zodiac} · số ${player.lifePathNumber}. Thầy xem rồi.`
              : `${room.players.length} người đã vào. Rót sẵn đi.`
          }
        />
      );
    }

    if (room.phase === "safety") {
      return (
        <PhoneWait
          label={`PHÒNG ${room.code}`}
          title={<>CHỐT VÙNG CẤM</>}
          line="Nhìn màn hình lớn. Gạch cái nào không muốn bị hỏi."
        />
      );
    }

    if (room.phase === "final") {
      return (
        <PhoneWait
          label="HẾT TRẬN"
          title={<>{player.totalGlasses.toFixed(1)} LY</>}
          line={`Soi đúng ${player.detectivePoints} lần. Uống nước lọc đi.`}
        />
      );
    }

    if (!round) {
      return <PhoneWait label="BỢM SONY" title={<>ĐANG XẾP VÒNG</>} line="Chờ Thầy Phán." />;
    }

    // ── Chế độ 1 — quẻ, cả bàn cùng lúc ───────────────────────────────────
    // Vòng tính theo phần trăm ly — chỉ có ở chế độ quẻ.
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
      if (myVerdict.drunk) return <QueDone dose={myVerdict.dose} />;
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
      return (
        <QueVerdict
          round={round.index}
          zodiac={player.zodiac}
          lifePath={player.lifePathNumber}
          verdict={myVerdict}
          appealUsed={player.appealUsed}
          pushUsed={player.pushUsed}
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
        />
      );
    }

    // ── Chế độ 2 — Truth or Drink ─────────────────────────────────────────
    if (isSpotlight) {
      if (room.phase === "reveal") {
        if (round.outcome === "immune") return <TurnImmune onNext={() => setStep("judged")} />;
        if (round.outcome === "skipped" && step !== "judged") {
          return <TurnSip reversed={reversed} rage={rage} duel={duel} onDone={() => setStep("judged")} />;
        }
        if (step !== "judged" && (round.outcome === "liar" || round.outcome === "truth")) {
          return (
            <TurnJudge tin={tin} doi={doi} liar={liar} rage={rage} duel={duel} onNext={() => setStep("judged")} />
          );
        }
        const opts = round.nextQuestionOptions;
        if (opts && opts[0] !== opts[1]) {
          return (
            <NextQuestionPick
              options={opts}
              onPick={(index) => void send({ t: "chooseNext", playerId: player.id, index })}
            />
          );
        }
        return <PhoneWait label={`VÒNG ${round.index}`} title={<>XONG LƯỢT</>} line="Câu đã giao. Chờ vòng sau." />;
      }
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

    // ── Người còn lại: bỏ phiếu, không ai ngồi không ──────────────────────
    if (room.phase === "reveal") {
      if (!myVote) {
        return (
          <PhoneWait
            label={`VÒNG ${round.index}`}
            title={<>CHỐT RỒI</>}
            line={
              round.outcome === "immune"
                ? `${spotlight?.name} dùng quyền miễn trừ.`
                : round.outcome === "skipped"
                  ? `${spotlight?.name} né. Chờ vòng sau.`
                  : `${tin}–${doi}. Chờ vòng sau.`
            }
          />
        );
      }
      const correct = liar ? myVote.value === "doi" : myVote.value === "tin";
      return (
        <>
          <VoteHeader spotlight={spotlight} question={round.question} />
          <VoteResult
            correct={correct}
            line={`${doi}–${tin}. ${spotlight?.name ?? "Người đó"} ${
              liar ? "uống 2 ngụm" : "thoát"
            }. Bạn soi ${correct ? "đúng" : "hụt"}.`}
            onTroll={(label) => {
              void send({ t: "troll", playerId: player.id, label });
              say(`“${label}” lên màn hình lớn`);
            }}
          />
        </>
      );
    }

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
    <PhoneShell>
      {body}
      <Toast value={toast} />
    </PhoneShell>
  );
}
