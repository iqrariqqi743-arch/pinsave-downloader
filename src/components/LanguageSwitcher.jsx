"use client";
import { Globe2, ChevronDown } from "lucide-react";
import { languages } from "@/lib/translations";
export default function LanguageSwitcher({ language, setLanguage }) {
  return (
    <div className="relative shrink-0">
      <Globe2
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <select
        dir="ltr"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Select language"
        className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm font-semibold text-slate-700 outline-none focus:border-rose-400"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.flag} {item.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
