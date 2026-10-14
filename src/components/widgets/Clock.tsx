"use client";
import { useEffect, useState } from "react";
import { GLASS } from "@/lib/palette";

const TZ = "America/Sao_Paulo";

export function timeParts(d: Date) {
  const [h, m, s] = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" })
    .format(d).split(":").map(Number);
  return { h, m, s };
}

export function Clock({ city }: { city: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const p = now ? timeParts(now) : { h: 10, m: 10, s: 0 };
  const hand = (deg: number) => ({ transform: `rotate(${deg}deg)`, transformOrigin: "50px 50px" });
  return (
    <div className={`${GLASS} flex h-[150px] w-[150px] items-center justify-center p-3`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={city}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="50" y1="6" x2="50" y2={i % 3 === 0 ? 11 : 9} stroke="black" strokeOpacity={i % 3 === 0 ? 0.45 : 0.25} strokeWidth="1.4" strokeLinecap="round" style={hand(i * 30)} />
        ))}
        <text x="50" y="31" textAnchor="middle" fontSize="7" fontWeight="600" fill="black" fillOpacity=".4" letterSpacing=".3">{city.toUpperCase()}</text>
        <line x1="50" y1="50" x2="50" y2="27" stroke="black" strokeWidth="3" strokeLinecap="round" style={hand((p.h % 12) * 30 + p.m / 2)} />
        <line x1="50" y1="50" x2="50" y2="15" stroke="black" strokeWidth="2.2" strokeLinecap="round" style={hand(p.m * 6 + p.s / 10)} />
        <line x1="50" y1="56" x2="50" y2="12" stroke="#F92D50" strokeWidth="1" strokeLinecap="round" style={hand(p.s * 6)} />
        <circle cx="50" cy="50" r="2.2" fill="black" />
      </svg>
    </div>
  );
}
