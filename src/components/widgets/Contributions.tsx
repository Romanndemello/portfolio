"use client";
import { useEffect, useState } from "react";
import { GLASS } from "@/lib/palette";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
// Uma cor só (o azul do site) ficando mais forte com o volume, como no GitHub.
export const CONTRIBUTION_SHADES = [
  "rgb(0 0 0 / 0.06)",
  "rgb(46 124 246 / 0.3)",
  "rgb(46 124 246 / 0.55)",
  "rgb(46 124 246 / 0.8)",
  "rgb(46 124 246 / 1)",
];

type Labels = { less: string; more: string; total: string };
const DEFAULT_LABELS: Labels = { less: "menos", more: "mais", total: "{n} contribuições no último ano" };

function Square({ level }: { level: number }) {
  return <span data-level={level} className="h-[7px] w-[7px] rounded-[2px]" style={{ backgroundColor: CONTRIBUTION_SHADES[level] ?? CONTRIBUTION_SHADES[0] }} />;
}

const isDay = (d: unknown): d is Day => {
  const x = d as Day;
  return !!x && typeof x.date === "string" && typeof x.count === "number" && [0, 1, 2, 3, 4].includes(x.level);
};

export async function fetchContributions(user: string, signal?: AbortSignal): Promise<Day[] | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`, { signal });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const list = (data as { contributions?: unknown }).contributions;
    if (!Array.isArray(list)) return null;
    return list.filter(isDay);
  } catch {
    return null;
  }
}

export function Contributions({ user, href, labels = DEFAULT_LABELS }: { user: string; href?: string; labels?: Labels }) {
  const [days, setDays] = useState<Day[] | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    fetchContributions(user, ctrl.signal).then(setDays).finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); ctrl.abort(); };
  }, [user]);

  if (!days || days.length === 0) return null;
  const total = days.reduce((s, d) => s + d.count, 0);
  const text = labels.total.replace("{n}", String(total));
  return (
    <a href={href ?? `https://github.com/${user}`} target="_blank" rel="noreferrer" className={`${GLASS} block h-[150px] w-[320px] p-4`}>
      <figure role="img" aria-label={`GitHub: ${text}`}>
        <p className="text-[13px] font-semibold text-black/85">GitHub</p>
        <p className="text-[11px] text-black/45">@{user}</p>
        <div className="mt-2.5 grid grid-flow-col grid-rows-7 justify-start gap-[2px]">
          {days.slice(-189).map((d) => <Square key={d.date} level={d.level} />)}
        </div>
        <figcaption className="mt-1.5 flex items-center justify-between gap-4 text-[9px] tabular-nums text-black/40">
          <span>{text}</span>
          <span className="flex items-center gap-[2px]">
            <span className="mr-0.5">{labels.less}</span>
            {[0, 1, 2, 3, 4].map((l) => <Square key={l} level={l} />)}
            <span className="ml-0.5">{labels.more}</span>
          </span>
        </figcaption>
      </figure>
    </a>
  );
}
