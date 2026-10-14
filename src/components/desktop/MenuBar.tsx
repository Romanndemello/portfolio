"use client";
import { useEffect, useState } from "react";
import type { Content } from "@/content/types";
import { langPath, saveLang } from "@/lib/lang";

export function MenuBar({ content }: { content: Content }) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () => new Date().toLocaleString(content.lang === "pt" ? "pt-BR" : "en-US", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    setNow(fmt());
    const t = setInterval(() => setNow(fmt()), 30_000);
    return () => clearInterval(t);
  }, [content.lang]);

  return (
    <header className="absolute inset-x-0 top-0 z-30 flex h-7 items-center gap-4 border-b border-black/10 bg-white/70 px-4 text-[11px] font-medium text-black/55 backdrop-blur-md">
      <span className="font-semibold text-black/70">DR</span>
      <span className="hidden sm:inline">{content.menu.name}</span>
      <span className="hidden text-black/35 sm:inline">{content.menu.role}</span>
      <nav className="ml-auto flex gap-1" aria-label="Idioma / Language">
        {(["pt", "en"] as const).map((l) => (
          <a key={l} href={langPath(l, "", { explicit: true })} onClick={() => saveLang(l)} aria-current={content.lang === l ? "true" : undefined}
             className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded px-1 ${content.lang === l ? "font-semibold text-black/80" : "hover:text-black/80"}`}>{l.toUpperCase()}</a>
        ))}
      </nav>
      <time className="hidden min-w-[124px] text-right tabular-nums sm:block" suppressHydrationWarning>{now}</time>
    </header>
  );
}
