"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Mode, Player } from "@/lib/types";
import { Avatar, EmptySeat } from "@/components/ui/Avatar";
import { ChunkyButton } from "@/components/ui/Buttons";
import { useLanguage } from "@/lib/i18n";
import { getZodiacName } from "@/lib/zodiac";

export function LobbyMobile({
  code,
  mode,
  players,
  onPickMode,
  onStart,
}: {
  code: string;
  mode: Mode | null;
  players: Player[];
  onPickMode: (mode: Mode) => void;
  onStart: () => void;
}) {
  const [showQR, setShowQR] = useState(false);
  const { lang, t } = useLanguage();
  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/j/${code}` : `/j/${code}`;

  return (
    <>
      <div className="flex shrink-0 items-center justify-between">
        <div className="t-label text-accent">{t("roomCode")} {code}</div>
        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            setShowQR(!showQR);
          }}
          className="rounded-sub border border-line bg-surface px-3.5 py-1.5 text-[14px] font-black text-text-dim hover:text-accent"
        >
          {showQR ? (lang === "en" ? "HIDE QR" : "ẨN QR") : (lang === "en" ? "📷 QR CODE" : "📷 MÃ QR")}
        </button>
      </div>

      {showQR ? (
        <div className="flex shrink-0 animate-[bsPop_0.3s_ease_both] flex-col items-center gap-3 rounded-card border border-line bg-surface p-5 text-center">
          <div className="flex h-[180px] w-[180px] items-center justify-center rounded-sub bg-ink p-2">
            <QRCode value={joinUrl} size={164} bgColor="#0A0A0C" fgColor="#F5F3EE" level="M" />
          </div>
          <div className="t-body text-[16px] text-accent font-bold">{t("roomCodeIs")} {code}</div>
          <div className="text-[13px] text-text-dim">{t("scanQr")}</div>
        </div>
      ) : null}

      {!mode ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3.5">
          <div className="t-title text-[32px] text-accent leading-tight">{t("modeTitle")}</div>
          <button
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onPickMode("que");
            }}
            className="card-soft flex flex-col gap-2 rounded-card border border-line bg-surface p-5 text-left active:border-accent"
          >
            <div className="t-label text-accent">{lang === "en" ? "FAST · LOUD" : "NHANH · ỒN"}</div>
            <div className="text-[28px] font-black leading-tight text-text">{t("modeQueTitle")}</div>
            <div className="t-body text-[16px] text-text-dim">{t("modeQueDesc")}</div>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onPickMode("tod");
            }}
            className="card-soft flex flex-col gap-2 rounded-card border border-line bg-surface p-5 text-left active:border-danger"
          >
            <div className="t-label text-danger">{lang === "en" ? "SPICY · FUN" : "CHẬM · CAY"}</div>
            <div className="text-[28px] font-black leading-tight text-text">{t("modeTodTitle")}</div>
            <div className="t-body text-[16px] text-text-dim">{t("modeTodDesc")}</div>
          </button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between shrink-0">
            <div className="t-title text-[24px]">{players.length} {t("playersJoined")}</div>
            <div className="t-label text-accent">
              {mode === "que" ? t("modeQueTitle") : t("modeTodTitle")}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-3.5 overflow-y-auto pr-1">
            {players.map((p) => (
              <div key={p.id} className="flex animate-[bsPop_0.3s_ease_both] flex-col items-center gap-1.5 rounded-card border border-line bg-surface p-3 text-center">
                <Avatar name={p.name} src={p.avatarUrl} size={52} fontSize={18} />
                <div className="text-[16px] font-bold truncate w-full">{p.name}</div>
                {p.birthDate ? (
                  <div className="text-[12px] text-accent font-black">{getZodiacName(p.zodiac, lang)}</div>
                ) : null}
              </div>
            ))}
            <EmptySeat />
          </div>
        </div>
      )}

      <ChunkyButton
        tone={mode && players.length > 0 ? "accent" : "surface"}
        disabled={!mode || players.length === 0}
        onClick={() => {
          vibrate(HAPTIC.sub);
          onStart();
        }}
      >
        {!mode ? t("modeTitle") : players.length === 0 ? t("waitingPlayers") : `${t("startBtn")} 🍺`}
      </ChunkyButton>
    </>
  );
}
