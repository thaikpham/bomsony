import type { Toast as ToastValue } from "@/lib/useRoom";

/**
 * Toast phone — dính đáy, tự tắt sau 1800ms.
 * Vàng cho thông báo thường, đỏ khi từ chối hành động.
 */
export function Toast({ value }: { value: ToastValue }) {
  if (!value) return null;
  return (
    <div
      // z-20: toast nằm ngay trên hàng nút phụ ở đáy màn — thiếu nó thì nó chui
      // xuống dưới nút và người chơi không thấy lời từ chối.
      className={`absolute right-6 bottom-14 left-6 z-20 animate-[bsPop_0.22s_ease_both] rounded-[20px] p-4 text-center text-[18px] font-black text-ink ${
        value.kind === "deny" ? "bg-danger" : "bg-accent"
      }`}
    >
      {value.text}
    </div>
  );
}
