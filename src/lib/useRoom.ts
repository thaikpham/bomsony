"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Action } from "./engine";
import type { Room } from "./types";

export type ToastKind = "ok" | "deny";
export type Toast = { text: string; kind: ToastKind } | null;

export type RoomChannel = {
  room: Room | null;
  status: "connecting" | "live" | "gone";
  toast: Toast;
  /** Hiện toast vàng (thông báo thường). */
  say: (text: string) => void;
  /** Hiện toast đỏ (từ chối hành động) — dùng cho guard chạy ngay trên phone. */
  deny: (text: string) => void;
  /** Gửi action lên server. Bị từ chối → toast đỏ với đúng câu của Thầy Phán. */
  send: (action: Action) => Promise<boolean>;
};

/**
 * Một kênh realtime cho cả host lẫn phone.
 *
 * Người chơi tap → phone gọi server → server tính → broadcast tới tất cả phone
 * + host cùng lúc. Host là màn hình thuần đọc, không tự tính gì.
 * Đây là chỗ thay bằng Supabase Realtime channel nếu muốn chạy nhiều instance.
 */
export function useRoom(code: string | null): RoomChannel {
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState<RoomChannel["status"]>("connecting");
  const [toast, setToast] = useState<Toast>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flash = useCallback((text: string, kind: ToastKind) => {
    setToast({ text, kind });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    let source: EventSource | null = null;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const open = () => {
      if (cancelled) return;
      source = new EventSource(`/api/room/${code}/stream`);
      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as { room: Room };
          if (data.room) {
            setRoom(data.room);
            setStatus("live");
          }
        } catch {
          /* ping hoặc gói hỏng — bỏ qua */
        }
      };
      source.onerror = () => {
        source?.close();
        if (cancelled) return;
        // Phòng đã hết hạn thì fetch sẽ trả 404 và ta dừng hẳn.
        fetch(`/api/room/${code}`)
          .then((r) => {
            if (r.status === 404) {
              setStatus("gone");
              return;
            }
            retry = setTimeout(open, 1200);
          })
          .catch(() => {
            retry = setTimeout(open, 1200);
          });
      };
    };

    open();
    return () => {
      cancelled = true;
      clearTimeout(retry);
      source?.close();
    };
  }, [code]);

  const send = useCallback(
    async (action: Action) => {
      if (!code) return false;
      try {
        const res = await fetch(`/api/room/${code}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action),
        });
        const data = (await res.json()) as { room?: Room; message?: string };
        if (res.ok && data.room) {
          setRoom(data.room);
          return true;
        }
        if (res.status === 409 && data.message) flash(data.message, "deny");
        else if (res.status === 404) setStatus("gone");
        return false;
      } catch {
        flash("Mất mạng rồi", "deny");
        return false;
      }
    },
    [code, flash],
  );

  const say = useCallback((text: string) => flash(text, "ok"), [flash]);
  const deny = useCallback((text: string) => flash(text, "deny"), [flash]);

  return { room, status, toast, say, deny, send };
}
