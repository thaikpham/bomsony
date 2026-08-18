"use client";

import { useCallback, useEffect } from "react";
import { Judgement } from "@/components/host/Judgement";
import { Lobby } from "@/components/host/Lobby";
import { ModeSelect } from "@/components/host/ModeSelect";
import { Podium } from "@/components/host/Podium";
import { QueRound, TableRound } from "@/components/host/QueRound";
import { Safety } from "@/components/host/Safety";
import { Spotlight } from "@/components/host/Spotlight";
import { TrollLayer } from "@/components/host/TrollLayer";
import { HostFrame, HostStage } from "@/components/ui/Stage";
import { useRoom } from "@/lib/useRoom";
import type { Mode } from "@/lib/types";

/** Sau phán xét, để cả bàn gào một nhịp rồi mới sang vòng sau. */
const REVEAL_HOLD_MS = 5200;

export function HostRoom({ code, joinUrl }: { code: string; joinUrl: string }) {
  const { room, status, send } = useRoom(code);

  const nextRound = useCallback(() => void send({ t: "nextRound" }), [send]);

  // Host tự giữ nhịp: không bắt chủ xị quyết định vòng nào tiếp.
  useEffect(() => {
    if (room?.phase !== "reveal") return;
    const timer = setTimeout(nextRound, REVEAL_HOLD_MS);
    return () => clearTimeout(timer);
  }, [room?.phase, room?.round, nextRound]);

  // Phím tắt cho chủ xị: Space qua vòng khi bàn đã chán.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "Enter") return;
      if (room?.phase !== "round" && room?.phase !== "reveal") return;
      e.preventDefault();
      nextRound();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [room?.phase, nextRound]);

  if (status === "gone") return <HostNotice title="PHÒNG ĐÃ TAN" line="Mở /host để dựng phòng mới." />;
  if (!room) return <HostNotice title="ĐANG NỐI" line="Chờ một nhịp." />;

  const round = room.current;
  const spotlight = round?.spotlightPlayerId
    ? (room.players.find((p) => p.id === round.spotlightPlayerId) ?? null)
    : null;
  const connected = room.players.filter((p) => p.connected);
  const nextUp =
    spotlight && connected.length > 1
      ? connected[(connected.findIndex((p) => p.id === spotlight.id) + 1) % connected.length]
      : null;

  const body = (() => {
    if (room.phase === "final") {
      return <Podium players={room.players} onNewGame={() => void send({ t: "newGame" })} />;
    }
    if (room.phase === "safety") {
      return (
        <Safety
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
    if (room.phase === "lobby") {
      if (!room.mode) {
        return (
          <ModeSelect
            mode={room.mode}
            onPick={(mode: Mode) => void send({ t: "setMode", mode })}
            onStart={() => void send({ t: "startGame" })}
          />
        );
      }
      return (
        <Lobby
          code={room.code}
          joinUrl={joinUrl}
          players={room.players}
          onStart={() => void send({ t: "startGame" })}
        />
      );
    }
    if (!round) return <HostNotice title="ĐANG XẾP VÒNG" line="Thầy Phán đang xem quẻ." embedded />;

    if (room.phase === "reveal" && round.spotlightPlayerId) {
      return <Judgement round={round} spotlight={spotlight} next={nextUp} />;
    }
    // Chỉ chế độ quẻ mới có vòng tính theo phần trăm ly.
    if (room.mode === "que") {
      if (round.type === "table") return <TableRound round={round} players={room.players} />;
      return <QueRound round={round} players={room.players} />;
    }
    return <Spotlight round={round} spotlight={spotlight} />;
  })();

  const background = (() => {
    if (room.phase === "reveal" && round?.spotlightPlayerId) {
      if (round.outcome === "liar") return "bg-danger";
      if (round.outcome === "skipped") return "bg-accent";
      if (round.outcome === "immune") return "bg-ink";
      return "bg-safe";
    }
    // Thầy Phán nổi giận ở chế độ quẻ: đảo đỏ toàn màn suốt cả vòng.
    if (room.phase === "round" && round?.type === "rage" && room.mode === "que") {
      return "bg-danger";
    }
    return "bg-ink";
  })();

  return (
    <>
      <HostStage background={background}>{body}</HostStage>
      <TrollLayer trolls={room.trolls} />
    </>
  );
}

function HostNotice({
  title,
  line,
  embedded = false,
}: {
  title: string;
  line: string;
  embedded?: boolean;
}) {
  const frame = (
    <HostFrame spread>
      <div className="t-label text-text-faint">BỢM SONY</div>
      <div className="t-display text-accent">{title}</div>
      <div className="t-body text-text-dim">{line}</div>
    </HostFrame>
  );
  return embedded ? frame : <HostStage>{frame}</HostStage>;
}
