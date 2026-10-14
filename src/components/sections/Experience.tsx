import type { Content } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Experience({ content }: { content: Content }) {
  return (
    <section id="experience" aria-label={content.experienceTitle} className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-20">
      <div className="mx-auto max-w-[1060px]">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">{content.experienceTitle}</h2>
            <p className="text-sm text-black/50">{content.experienceSub}</p>
          </div>
        </Reveal>
        <div>
          {content.jobs.map((j) => (
            <Reveal key={j.company + j.period}>
              <article className="grid gap-2 border-b border-black/10 py-6 sm:grid-cols-[220px_1fr] sm:gap-8">
                <p className="font-mono text-xs leading-relaxed text-black/45">{j.period}<br />{j.place}</p>
                <div>
                  <h3 className="text-lg font-bold leading-snug">{j.company}</h3>
                  <p className="text-sm text-black/50">{j.role}</p>
                  <ul className="mt-3 space-y-1.5 text-[15px] text-black/70">
                    {j.bullets.map((b) => <li key={b} className="flex gap-2"><span aria-hidden className="text-black/30">•</span>{b}</li>)}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
