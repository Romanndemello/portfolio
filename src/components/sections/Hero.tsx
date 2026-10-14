import type { Content } from "@/content/types";
import { GLASS } from "@/lib/palette";

export function Hero({ content, variant = "desk" }: { content: Content; variant?: "desk" | "card" }) {
  if (variant === "card") {
    return (
      <div className={`${GLASS} p-5`}>
        <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight">{content.hero.line1}<br />{content.hero.line2}</h1>
        <p className="mt-3 text-sm leading-relaxed text-black/55">{content.hero.sub}</p>
      </div>
    );
  }
  return (
    <div className="pointer-events-none flex h-full items-center justify-center px-6">
      <div className="max-w-5xl text-center">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl 2xl:text-6xl">
          <span className="hero-line hero-line-1">{content.hero.line1}</span>
          <br />
          <span className="hero-line hero-line-2">{content.hero.line2}</span>
        </h1>
        <p className="hero-line hero-line-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-black/50">{content.hero.sub}</p>
      </div>
    </div>
  );
}
