import "server-only";
import { DEFAULT_BANNED, type Room } from "./types";
import { apply, type Action } from "./engine";

/**
 * Nguồn sự thật của phòng — bản in-memory.
 *
 * Đủ cho một máy chủ (chạy `npm run dev` rồi cả bàn vào bằng wifi quán, hoặc
 * một instance `next start`). Đây là chỗ để thay bằng Supabase: đổi `getRoom` /
 * `dispatch` sang Postgres + Realtime channel, phần còn lại của app không đổi
 * vì mọi thứ đều đi qua hai hàm này.
 */

type Listener = (room: Room) => void;

type Store = {
  rooms: Map<string, Room>;
  listeners: Map<string, Set<Listener>>;
};

const g = globalThis as unknown as { __bomSony?: Store };
const store: Store =
  g.__bomSony ?? (g.__bomSony = { rooms: new Map(), listeners: new Map() });

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_TTL_MS = 12 * 60 * 60 * 1000;

function newCode(): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = "";
    const bytes = crypto.getRandomValues(new Uint8Array(5));
    for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
    if (!store.rooms.has(code)) return code;
  }
  return `R${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

function sweep(): void {
  const cutoff = Date.now() - ROOM_TTL_MS;
  for (const [code, room] of store.rooms) {
    if (room.updatedAt < cutoff) {
      store.rooms.delete(code);
      store.listeners.delete(code);
    }
  }
  if (store.rooms.size > 200) {
    const sorted = [...store.rooms.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt);
    const toDelete = sorted.slice(0, store.rooms.size - 200);
    for (const [code] of toDelete) {
      store.rooms.delete(code);
      store.listeners.delete(code);
    }
  }
}

export function createRoom(): Room {
  sweep();
  const now = Date.now();
  const room: Room = {
    code: newCode(),
    mode: null,
    phase: "lobby",
    round: 0,
    tier: "warm",
    bannedTopics: DEFAULT_BANNED.slice(),
    players: [],
    current: null,
    trolls: [],
    usedQuestions: [],
    createdAt: now,
    updatedAt: now,
  };
  store.rooms.set(room.code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return store.rooms.get(code.toUpperCase());
}

/** Áp action rồi broadcast tới tất cả phone + host cùng lúc. */
export function dispatch(code: string, action: Action): Room {
  const room = getRoom(code);
  if (!room) throw new Error("NO_ROOM");
  apply(room, action);
  broadcast(room);
  return room;
}

export function broadcast(room: Room): void {
  const set = store.listeners.get(room.code);
  if (!set) return;
  for (const fn of set) {
    try {
      fn(room);
    } catch {
      set.delete(fn);
    }
  }
}

export function subscribe(code: string, fn: Listener): () => void {
  const key = code.toUpperCase();
  let set = store.listeners.get(key);
  if (!set) store.listeners.set(key, (set = new Set()));
  set.add(fn);
  return () => {
    set!.delete(fn);
    if (set!.size === 0) store.listeners.delete(key);
  };
}
