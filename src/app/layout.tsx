import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

/**
 * Noto Sans là font duy nhất toàn app. Không thay, không thêm font thứ hai.
 * Subset `vietnamese` là bắt buộc — thiếu nó thì dấu chữ Việt rơi về font hệ thống.
 */
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bợm Sony",
  description: "Game nhậu nhiều người qua QR. Thầy Phán quyết định ai uống bao nhiêu.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${notoSans.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
