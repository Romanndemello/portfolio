"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Content } from "@/content/types";
import type { IconColor } from "@/lib/palette";
import { GLASS } from "@/lib/palette";
import { AppIcon } from "@/components/ui/AppIcon";
import { Contacts, FolderGlyph, Heart, Sparkles, TerminalGlyph } from "@/components/ui/Icons";

export type DockId = "home" | "superpowers" | "highlights" | "about" | "meeting" | "contact" | "terminal";

function DateIcon({ lang }: { lang: Content["lang"] }) {
  const [d, setD] = useState<Date | null>(null);
  useEffect(() => setD(new Date()), []);
  return (
    <span className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[24%] border border-black/10 bg-white leading-none">
      <span className="text-[8px] font-bold uppercase text-[#F92D50]">{d ? d.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", { weekday: "short" }).replace(".", "") : ""}</span>
      <span className="text-[17px] font-bold text-black">{d ? d.getDate() : ""}</span>
    </span>
  );
}

const ICONS: { id: DockId; color: IconColor | "white" | "date"; glyph: ReactNode }[] = [
  { id: "home", color: "white", glyph: <span className="text-[15px] font-extrabold tracking-tight">DR</span> },
  { id: "superpowers", color: "blue", glyph: <FolderGlyph className="h-1/2 w-1/2" /> },
  { id: "highlights", color: "purple", glyph: <Sparkles className="h-1/2 w-1/2" /> },
  { id: "about", color: "pink", glyph: <Heart className="h-1/2 w-1/2" /> },
  { id: "meeting", color: "date", glyph: null },
  { id: "contact", color: "green", glyph: <Contacts className="h-1/2 w-1/2" /> },
  { id: "terminal", color: "ink", glyph: <TerminalGlyph className="h-1/2 w-1/2" /> },
];

export function Dock({ content, onOpen }: { content: Content; onOpen: (id: DockId) => void }) {
  return (
    <div className="pointer-events-none sticky top-4 z-[60] flex justify-center px-4 py-3 md:-mt-32 md:h-32 md:items-start md:py-0">
      <nav aria-label="Dock" className={`${GLASS} pointer-events-auto flex items-center gap-2.5 px-3 py-2`}>
        {ICONS.map(({ id, color, glyph }, i) => (
          <span key={id} className="flex items-center gap-2.5">
            {(i === 1 || id === "terminal") && <span aria-hidden className="h-8 w-px bg-black/15" />}
            <button type="button" onClick={() => onOpen(id)} aria-label={content.dock[id]} title={content.dock[id]}
              className="block h-10 w-10 transition-[filter,transform] duration-200 hover:-translate-y-1 hover:brightness-105 motion-reduce:hover:translate-y-0">
              {color === "date" ? <DateIcon lang={content.lang} /> : <AppIcon color={color}>{glyph}</AppIcon>}
            </button>
          </span>
        ))}
      </nav>
    </div>
  );
}
