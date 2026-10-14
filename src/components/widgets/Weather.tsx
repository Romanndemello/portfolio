"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/content/types";
import { GLASS } from "@/lib/palette";
import { Cloud, Rain, Sun } from "@/components/ui/Icons";

type Day = { date: string; code: number; max: number };

// São Leopoldo, RS.
const URL = "https://api.open-meteo.com/v1/forecast?latitude=-29.76&longitude=-51.15&daily=weather_code,temperature_2m_max&timezone=America%2FSao_Paulo&forecast_days=7";

export async function fetchWeather(signal?: AbortSignal): Promise<Day[] | null> {
  try {
    const res = await fetch(URL, { signal });
    if (!res.ok) return null;
    const d = (await res.json()) as { daily?: { time?: unknown; weather_code?: unknown; temperature_2m_max?: unknown } };
    const { time, weather_code, temperature_2m_max } = d.daily ?? {};
    if (!Array.isArray(time) || !Array.isArray(weather_code) || !Array.isArray(temperature_2m_max)) return null;
    const days = time.map((t, i) => ({ date: String(t), code: Number(weather_code[i]), max: Math.round(Number(temperature_2m_max[i])) }));
    return days.every((x) => Number.isFinite(x.code) && Number.isFinite(x.max)) ? days : null;
  } catch {
    return null;
  }
}

export function iconFor(code: number) {
  if (code <= 1) return "sun";
  if (code >= 51) return "rain";
  return "cloud";
}

export function Weather({ city, lang }: { city: string; lang: Lang }) {
  const [days, setDays] = useState<Day[] | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    fetchWeather(ctrl.signal).then(setDays).finally(() => clearTimeout(t));
    return () => { clearTimeout(t); ctrl.abort(); };
  }, []);
  if (!days) return null;
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  return (
    <div className={`${GLASS} w-[320px] p-4`}>
      <p className="text-[10px] font-semibold text-black/55">{city}</p>
      <ul className="mt-2.5 grid grid-cols-7 gap-1 text-center">
        {days.map((d) => {
          const kind = iconFor(d.code);
          const Icon = kind === "sun" ? Sun : kind === "rain" ? Rain : Cloud;
          return (
            <li key={d.date} className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-semibold text-black/40">{new Date(`${d.date}T12:00`).toLocaleDateString(locale, { weekday: "short" }).slice(0, 3)}</span>
              <Icon className={`h-4 w-4 ${kind === "sun" ? "text-[#FFB800]" : kind === "rain" ? "text-[#5FB0FF]" : "text-[#A8B0B9]"}`} />
              <span className="text-[9px] font-medium tabular-nums text-black/55">{d.max}°</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
