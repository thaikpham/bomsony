import type { Player, Round } from "@/lib/types";
import { HostFrame } from "@/components/ui/Stage";

/**
 * 4d · Màn hình lớn — phán xét.
 * Khoảnh khắc cao trào, cả bàn gào. Đảo màu toàn màn để tạo cú sốc thị giác:
 * một màu chiếm hết màn, không rải vàng-đỏ-xanh cùng lúc.
 */
export function Judgement({
  round,
  spotlight,
  next,
}: {
  round: Round;
  spotlight: Player | null;
  next: Player | null;
}) {
  const tin = round.votes.filter((v) => v.value === "tin").length;
  const doi = round.votes.filter((v) => v.value === "doi").length;
  const name = spotlight?.name ?? "Người đó";
  const nextName = next?.name ?? "Người kế";
  const reversed = round.type === "reverse";
  const rage = round.type === "rage";
  const duel = round.type === "duel";
  const mult = rage || duel ? 2 : 1;

  const view = (() => {
    switch (round.outcome) {
      case "liar":
        return {
          bg: "bg-danger",
          tag: rage
            ? `${doi} – ${tin} · THẦY PHÁN NỔI GIẬN`
            : duel
              ? `${doi} – ${tin} · ĐẤU TAY ĐÔI`
              : `${doi} – ${tin} · CẢ BÀN KHÔNG TIN`,
          title: (
            <>
              NÓI DỐI
              <br />
              RÀNH RÀNH
            </>
          ),
          sips: 2 * mult,
          line: `${name} uống. ${nextName} ra câu tiếp.`,
        };
      case "skipped":
        return {
          bg: "bg-accent",
          tag: "KHÔNG DÁM KHAI",
          title: (
            <>
              NÉ ĐẸP
              <br />
              LẮM
            </>
          ),
          sips: reversed ? 0 : 1 * mult,
          line: reversed
            ? `Vòng ngược đời — ${name} né nên thoát.`
            : `${name} ngụm một cái. ${nextName} ra câu tiếp.`,
        };
      case "immune":
        return {
          bg: "bg-ink",
          tag: "QUYỀN MIỄN TRỪ",
          title: (
            <>
              THOÁT
              <br />
              SẠCH
            </>
          ),
          sips: 0,
          line: `${name} hết quyền miễn trừ. ${nextName} ra câu tiếp.`,
        };
      default:
        return {
          bg: "bg-safe",
          tag: `${tin} – ${doi} · CẢ BÀN TIN`,
          title: (
            <>
              THẦY TIN
              <br />
              THẬT THÀ
            </>
          ),
          sips: reversed ? 1 * mult : 0,
          line: reversed
            ? `Vòng ngược đời — thật thà thì uống. ${name} ngụm đi.`
            : `${name} thoát. ${nextName} ra câu tiếp.`,
        };
    }
  })();

  const onDark = round.outcome === "immune";

  return (
    <HostFrame spread className={`${view.bg} ${onDark ? "text-text" : "text-ink"}`}>
      <div className={`t-label ${onDark ? "text-text-faint" : "opacity-55"}`}>{view.tag}</div>

      <div className="flex items-center gap-10">
        <div className={`t-display flex-1 ${onDark ? "text-safe" : ""}`}>{view.title}</div>
        <div className="flex h-[220px] w-[220px] shrink-0 animate-[bsPop_0.45s_cubic-bezier(0.2,1.5,0.4,1)_both] flex-col items-center justify-center rounded-full bg-ink text-accent">
          {view.sips > 0 ? (
            <>
              <div className="text-[104px] leading-[0.82] font-black tracking-[-0.05em] tabular-nums">
                {view.sips}
              </div>
              <div className="text-[26px] leading-[1.18] font-black">NGỤM</div>
            </>
          ) : (
            <div className="text-[104px] leading-none font-black text-safe">✓</div>
          )}
        </div>
      </div>

      <div className={`t-body ${onDark ? "text-text-dim" : "opacity-70"}`}>{view.line}</div>
    </HostFrame>
  );
}
