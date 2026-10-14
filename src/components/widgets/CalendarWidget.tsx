"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/content/types";
import { GLASS } from "@/lib/palette";

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)] as (number | null)[];
}

export function CalendarWidget({ lang, href }: { lang: Lang; href: string }) {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  if (!today) return <div className={`${GLASS} h-[150px] w-[150px]`} />;
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const weekday = today.toLocaleDateString(locale, { weekday: "long" }).replace("-feira", "");
  const initials = Array.from({ length: 7 }, (_, i) => new Date(2026, 1, 1 + i).toLocaleDateString(locale, { weekday: "narrow" }));
  const cells = monthGrid(today.getFullYear(), today.getMonth());
  return (
    <a href={href} className={`${GLASS} block h-[150px] w-[150px] p-3.5`}>
      <p className="text-[9px] font-bold uppercase text-[#F92D50]">{weekday}</p>
      <p className="text-lg font-bold leading-none">{today.getDate()}</p>
      <div className="mt-1.5 grid grid-cols-7 gap-y-[1px] text-center text-[7px] tabular-nums text-black/55">
        {initials.map((d, i) => <span key={`h${i}`} className="font-semibold text-black/35">{d}</span>)}
        {cells.map((d, i) => (
          <span key={i} className={d === today.getDate() ? "mx-auto grid h-[11px] w-[11px] place-items-center rounded-full bg-black font-bold text-white" : ""}>{d ?? ""}</span>
        ))}
      </div>
    </a>
  );
}
