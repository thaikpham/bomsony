import { TIER_LABEL, type Player, type Round } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { HostFrame } from "@/components/ui/Stage";

/**
 * 4c · Màn hình lớn — một người lên thớt.
 * Cả bàn cùng đọc câu hỏi; thấy phiếu đổ về live.
 */
export function Spotlight({
  round,
  spotlight,
}: {
  round: Round;
  spotlight: Player | null;
}) {
  const tin = round.votes.filter((v) => v.value === "tin").length;
  const doi = round.votes.filter((v) => v.value === "doi").length;

  return (
    <HostFrame>
      <div className="flex shrink-0 items-baseline justify-between">
        <div className="t-label text-text-faint">VÒNG {round.index}</div>
        <div className="t-label text-text-faint">
          {round.type === "reverse"
            ? "NGƯỢC ĐỜI"
            : round.type === "rage"
              ? "THẦY PHÁN NỔI GIẬN"
              : round.type === "duel"
                ? "ĐẤU TAY ĐÔI"
                : TIER_LABEL[round.tier]}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-9">
        <div className="flex w-[180px] shrink-0 flex-col items-center gap-4">
          <Avatar
            name={spotlight?.name ?? "?"}
            src={spotlight?.avatarUrl}
            size={140}
            fontSize={46}
            className="animate-[bsPop_0.45s_cubic-bezier(0.2,1.5,0.4,1)_both]"
          />
          <div className="t-title tracking-[-0.02em]">
            {(spotlight?.name ?? "AI ĐÓ").toUpperCase()}
          </div>
        </div>
        <div className="flex-1 text-[56px] leading-[1.24] font-black tracking-[-0.035em] text-accent [text-wrap:pretty]">
          {round.question}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <Tally count={tin} label="TIN" className="text-safe" />
        <Tally count={doi} label="NÓI DỐI" className="text-danger" />
        <div className="t-label shrink-0 animate-[bsBreathe_1.6s_ease-in-out_infinite] text-[rgb(245_243_238/0.35)]">
          ĐANG KHAI
        </div>
      </div>
    </HostFrame>
  );
}

function Tally({
  count,
  label,
  className,
}: {
  count: number;
  label: string;
  className: string;
}) {
  return (
    <div className={`flex flex-1 items-baseline gap-3 ${className}`}>
      <span className="text-[56px] leading-none font-black tabular-nums">{count}</span>
      <span className="t-label">{label}</span>
    </div>
  );
}
