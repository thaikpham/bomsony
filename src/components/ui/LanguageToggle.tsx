"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-1 rounded-full bg-surface-card border border-white/10 backdrop-blur-md shadow-lg text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        onClick={() => setLang("vi")}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
          lang === "vi"
            ? "bg-accent text-white shadow-md font-bold scale-105"
            : "text-text-dim hover:text-white"
        }`}
        title="Tiếng Việt"
      >
        <span>🇻🇳</span>
        <span>VI</span>
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
          lang === "en"
            ? "bg-accent text-white shadow-md font-bold scale-105"
            : "text-text-dim hover:text-white"
        }`}
        title="English"
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
