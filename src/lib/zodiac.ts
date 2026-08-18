/** Cung hoàng đạo + số chủ đạo thần số học — suy ra 1 lần khi join. */

const SIGNS: { name: string; until: [number, number] }[] = [
  { name: "MA KẾT", until: [1, 19] },
  { name: "BẢO BÌNH", until: [2, 18] },
  { name: "SONG NGƯ", until: [3, 20] },
  { name: "BẠCH DƯƠNG", until: [4, 19] },
  { name: "KIM NGƯU", until: [5, 20] },
  { name: "SONG TỬ", until: [6, 20] },
  { name: "CỰ GIẢI", until: [7, 22] },
  { name: "SƯ TỬ", until: [8, 22] },
  { name: "XỬ NỮ", until: [9, 22] },
  { name: "THIÊN BÌNH", until: [10, 22] },
  { name: "BỌ CẠP", until: [11, 21] },
  { name: "NHÂN MÃ", until: [12, 21] },
];

/** @param iso yyyy-mm-dd */
export function zodiacOf(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  if (!m || !d) return "MA KẾT";
  for (const s of SIGNS) {
    const [sm, sd] = s.until;
    if (m < sm || (m === sm && d <= sd)) return s.name;
  }
  // 22/12 – 31/12 quay lại Ma Kết.
  return "MA KẾT";
}

/** Cộng dồn mọi chữ số ngày sinh về 1 chữ số (giữ 11/22/33 rồi rút tiếp). */
export function lifePathOf(iso: string): number {
  let n = iso.replace(/\D/g, "").split("").reduce((a, c) => a + Number(c), 0);
  while (n > 9) n = String(n).split("").reduce((a, c) => a + Number(c), 0);
  return n;
}

export function isValidBirthDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return false;
  const year = Number(iso.slice(0, 4));
  return year >= 1920 && year <= new Date().getUTCFullYear() - 15;
}
