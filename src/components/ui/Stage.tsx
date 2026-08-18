import type { ReactNode } from "react";

/**
 * Màn hình lớn. Thiết kế ở 960×540, chạy thật ở 1920×1080 — scale nguyên khối
 * thay vì nhân đôi từng con số, nên mọi kích thước trong host component khớp
 * 1:1 với file thiết kế và tự vừa mọi màn 16:9. Chỉ landscape, tối thiểu 1280px.
 */
export function HostStage({
  children,
  background = "bg-ink",
}: {
  children: ReactNode;
  background?: string;
}) {
  return (
    <div className={`fixed inset-0 grid place-items-center overflow-hidden ${background}`}>
      <div
        className="origin-center"
        style={{
          width: 960,
          height: 540,
          // Chia length cho length ra số không đơn vị — scale() cần đúng thứ đó;
          // bỏ `px` ở mẫu số thì transform thành giá trị không hợp lệ và bị bỏ qua.
          transform: "scale(min(calc(100vw / 960px), calc(100vh / 540px)))",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Khung trong của một màn host: padding 36px, cột dọc, gap 28px. */
export function HostFrame({
  children,
  className = "",
  spread = false,
}: {
  children: ReactNode;
  className?: string;
  spread?: boolean;
}) {
  return (
    <div
      className={`flex h-[540px] w-[960px] flex-col p-9 ${
        spread ? "justify-between" : "gap-7"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Phone — mobile-first, thiết kế ở 402×874.
 * Tới iPad giới hạn max-width 560px và căn giữa: nút cao 88px mà rộng 1000px
 * trông sai và khó bấm bằng ngón cái.
 */
export function PhoneShell({
  children,
  background = "bg-ink",
}: {
  children: ReactNode;
  background?: string;
}) {
  return (
    <div className={`min-h-dvh ${background}`}>
      <div
        className="relative mx-auto flex min-h-dvh w-full max-w-[560px] flex-col gap-5 overflow-hidden px-6"
        style={{
          paddingTop: "max(64px, calc(env(safe-area-inset-top) + 20px))",
          paddingBottom: "max(46px, calc(env(safe-area-inset-bottom) + 20px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
