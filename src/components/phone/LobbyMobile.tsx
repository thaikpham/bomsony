"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { HAPTIC, vibrate } from "@/lib/haptics";
import type { Mode, Player } from "@/lib/types";
import { Avatar, EmptySeat } from "@/components/ui/Avatar";
import { ChunkyButton } from "@/components/ui/Buttons";

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
  const joinUrl = typeof window !== "undefined" ? `${window.location.origin}/j/${code}` : `/j/${code}`;

  return (
    <>
      {/* Header với Mã phòng & Nút hiện QR */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="t-label text-accent">PHÒNG {code}</div>
        <button
          type="button"
          onClick={() => {
            vibrate(HAPTIC.sub);
            setShowQR(!showQR);
          }}
          className="rounded-sub border border-line bg-surface px-3.5 py-1.5 text-[14px] font-black text-text-dim hover:text-accent"
        >
          {showQR ? "ẨN QR" : "📷 MÃ QR"}
        </button>
      </div>

      {/* QR Code Popover nếu bật */}
      {showQR ? (
        <div className="flex shrink-0 animate-[bsPop_0.3s_ease_both] flex-col items-center gap-3 rounded-card border border-line bg-surface p-5 text-center">
          <div className="flex h-[180px] w-[180px] items-center justify-center rounded-sub bg-ink p-2">
            <QRCode value={joinUrl} size={164} bgColor="#0A0A0C" fgColor="#F5F3EE" level="M" />
          </div>
          <div className="t-body text-[16px] text-accent font-bold">Mã phòng: {code}</div>
          <div className="text-[13px] text-text-dim">Quét mã bằng camera điện thoại để vào bàn</div>
        </div>
      ) : null}

      {/* Chọn Chế Độ nếu chưa chọn */}
      {!mode ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3.5">
          <div className="t-title text-[32px] text-accent leading-tight">CHỌN CHẾ ĐỘ CHƠI</div>
          <button
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onPickMode("que");
            }}
            className="card-soft flex flex-col gap-2 rounded-card border border-line bg-surface p-5 text-left active:border-accent"
          >
            <div className="t-label text-accent">NHANH · ỒN</div>
            <div className="text-[28px] font-black leading-tight text-text">SỐ TRỜI ĐÃ ĐỊNH</div>
            <div className="t-body text-[16px] text-text-dim">Ngày sinh ra mức uống (100% · 50% · 25%). Cả bàn uống cùng lúc.</div>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrate(HAPTIC.sub);
              onPickMode("tod");
            }}
            className="card-soft flex flex-col gap-2 rounded-card border border-line bg-surface p-5 text-left active:border-danger"
          >
            <div className="t-label text-danger">CHẬM · CAY</div>
            <div className="text-[28px] font-black leading-tight text-text">TRUTH OR DRINK</div>
            <div className="t-body text-[16px] text-text-dim">Chai quay 1 người ➔ Trả lời thật hoặc uống (1–2 ngụm). Cả bàn bỏ phiếu.</div>
          </button>
        </div>
      ) : (
        /* Danh sách người chơi đã vào */
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between shrink-0">
            <div className="t-title text-[28px]">{players.length} BỢM ĐÃ VÀO</div>
            <div className="t-label text-accent">
              {mode === "que" ? "SỐ TRỜI ĐÃ ĐỊNH" : "TRUTH OR DRINK"}
            </div>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-3.5 overflow-y-auto pr-1">
            {players.map((p) => (
              <div key={p.id} className="flex animate-[bsPop_0.3s_ease_both] flex-col items-center gap-1.5 rounded-card border border-line bg-surface p-3 text-center">
                <Avatar name={p.name} src={p.avatarUrl} size={52} fontSize={18} />
                <div className="text-[16px] font-bold truncate w-full">{p.name}</div>
                {p.birthDate ? (
                  <div className="text-[12px] text-accent font-black">{p.zodiac}</div>
                ) : null}
              </div>
            ))}
            <EmptySeat />
          </div>
        </div>
      )}

      {/* Nút Bắt đầu */}
      <ChunkyButton
        tone={mode && players.length > 0 ? "accent" : "surface"}
        disabled={!mode || players.length === 0}
        onClick={() => {
          vibrate(HAPTIC.sub);
          onStart();
        }}
      >
        {!mode ? "CHỌN CHẾ ĐỘ ĐI" : players.length === 0 ? "CHỜ NGƯỜI VÀO" : "BẮT ĐẦU GAME 🍺"}
      </ChunkyButton>
    </>
  );
}
