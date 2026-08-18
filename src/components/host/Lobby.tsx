"use client";

import QRCode from "react-qr-code";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Player } from "@/lib/types";
import { Avatar, EmptySeat } from "@/components/ui/Avatar";
import { HostFrame } from "@/components/ui/Stage";
import { useLanguage } from "@/lib/i18n";

export function Lobby({
  code,
  joinUrl,
  players,
  onStart,
}: {
  code: string;
  joinUrl: string;
  players: Player[];
  onStart: () => void;
}) {
  const { lang, t } = useLanguage();
  const host = joinUrl.replace(/^https?:\/\//, "").split("/")[0].toUpperCase();

  return (
    <HostFrame>
      <div className="flex shrink-0 items-baseline justify-between">
        <div className="t-title">{players.length} {lang === "en" ? "PLAYERS" : "BỢM"}</div>
        <div className="t-label text-text-faint">{host || "BOMSONY.APP"}</div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-9">
        <div className="flex shrink-0 flex-col items-center gap-5">
          <div className="flex h-[236px] w-[236px] items-center justify-center rounded-sub border-2 border-[rgb(255_230_0/0.35)] bg-surface p-3">
            <QRCode
              value={joinUrl}
              size={212}
              bgColor="#14141A"
              fgColor="#F5F3EE"
              level="M"
              style={{ width: 212, height: 212 }}
            />
          </div>
          <div className="text-[60px] leading-none font-black tracking-[0.02em] text-accent">
            {code}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-4 gap-4">
          {players.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-2.5">
              <Avatar name={p.name} src={p.avatarUrl} size={70} fontSize={22} />
              <div className="text-[20px] font-bold">{p.name}</div>
            </div>
          ))}
          <EmptySeat />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between">
        <a
          href="/host"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-main border border-line bg-surface px-5 py-[18px] text-[18px] font-black text-text-dim hover:text-accent transition-colors"
        >
          {lang === "en" ? "+ CREATE ANOTHER ROOM" : "+ TẠO PHÒNG KHÁC"}
        </a>
        <button
          type="button"
          disabled={players.length === 0}
          onClick={() => {
            vibrate(HAPTIC.sub);
            onStart();
          }}
          className={`rounded-main px-[34px] py-[18px] text-[24px] font-black ${
            players.length ? "bg-accent text-ink" : "bg-surface text-[rgb(245_243_238/0.32)]"
          }`}
        >
          {t("startBtn")}
        </button>
      </div>
    </HostFrame>
  );
}
