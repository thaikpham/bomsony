import { initialsOf } from "@/lib/identity";

/**
 * Production dùng ảnh Gmail thật (`picture` từ Google OAuth), bo tròn 50%.
 * Nền #23231C + chữ cái đầu màu accent chỉ là fallback khi chưa có ảnh.
 */
export function Avatar({
  name,
  src,
  size,
  fontSize,
  className = "",
  dark = false,
}: {
  name: string;
  src?: string | null;
  size: number;
  fontSize?: number;
  className?: string;
  /** Bục hạng 1 nền vàng → avatar đảo sang nền đen. */
  dark?: boolean;
}) {
  const style = {
    width: size,
    height: size,
    fontSize: fontSize ?? Math.round(size * 0.3),
  };
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- ảnh Google OAuth, không qua loader
      <img
        src={src}
        alt={name}
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      style={style}
      className={`flex shrink-0 items-center justify-center rounded-full font-black ${
        dark ? "bg-ink text-accent" : "bg-surface-alt text-accent"
      } ${className}`}
    >
      {initialsOf(name)}
    </div>
  );
}

/** Ô chờ người vào — vòng tròn nét đứt, thở đều. */
export function EmptySeat({ size = 70 }: { size?: number }) {
  return (
    <div className="flex animate-[bsBreathe_1.8s_ease-in-out_infinite] flex-col items-center gap-2.5">
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full border-2 border-dashed border-[rgb(245_243_238/0.2)] text-[26px] font-black text-[rgb(245_243_238/0.3)]"
      >
        +
      </div>
    </div>
  );
}
