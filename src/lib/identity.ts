"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Danh tính người chơi trên máy này.
 *
 * Production dùng Google OAuth để lấy tên + ảnh Gmail thật (`picture` claim).
 * Ở đây là bản nhập tên: giữ nguyên hình dạng dữ liệu (`id`, `name`,
 * `avatarUrl`) nên khi cắm OAuth vào chỉ cần đổi hàm này, phần còn lại không đổi.
 */

export type Identity = { id: string; name: string; avatarUrl: string | null };

const KEY = "bomsony.identity";

export function loadIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Identity;
    return parsed?.id && parsed?.name ? parsed : null;
  } catch {
    return null;
  }
}

export function saveIdentity(name: string, avatarUrl: string | null = null): Identity {
  const existing = loadIdentity();
  const identity: Identity = {
    id: existing?.id ?? crypto.randomUUID(),
    name: name.trim().slice(0, 24),
    avatarUrl,
  };
  window.localStorage.setItem(KEY, JSON.stringify(identity));
  window.dispatchEvent(new Event(EVENT));
  return identity;
}

/** Chữ cái đầu — fallback khi chưa có ảnh Gmail. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const EVENT = "bomsony.identity.changed";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * Đọc danh tính từ localStorage mà không cần effect — server render ra `null`,
 * client render ra giá trị thật ngay lần đầu, không nhấp nháy một khung hình.
 */
export function useIdentity(): Identity | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(KEY),
    () => null,
  );
  return useMemo(() => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Identity;
      return parsed?.id && parsed?.name ? parsed : null;
    } catch {
      return null;
    }
  }, [raw]);
}
