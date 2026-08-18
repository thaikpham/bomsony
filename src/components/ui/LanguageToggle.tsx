"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  const toggleLanguage = () => {
    setLang(lang === "vi" ? "en" : "vi");
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={lang === "vi" ? "Đổi sang Tiếng Anh (English)" : "Switch to Vietnamese (Tiếng Việt)"}
      className={`h-[38px] px-2.5 rounded-full border border-line bg-surface/90 text-text shadow-md flex items-center gap-1 font-black text-[12px] active:scale-95 transition-all duration-150 select-none touch-manipulation hover:border-accent/40 ${className}`}
    >
      <span className="text-[15px]">{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
      <span className="tracking-wider">{lang === "vi" ? "VI" : "EN"}</span>
    </button>
  );
}
