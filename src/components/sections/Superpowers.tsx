import type { Content } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

// Cada superpoder é uma pasta com aba. No desktop elas grudam no topo e se empilham na rolagem.
export function Superpowers({ content, onOpen }: { content: Content; onOpen?: (id: string) => void }) {
  const caseFor: Record<string, string> = { automacao: "agentes", integracoes: "crmillion", marketing: "saipos", produto: "ovis" };
  return (
    <section id="superpowers" aria-label={content.superpowersTitle} className="relative scroll-mt-24 bg-[#fafafa]">
      {content.superpowers.map((s, i) => (
        <article key={s.id} aria-labelledby={`sp-${s.id}`} style={{ zIndex: 10 + i }}
          className="z-10 flex h-auto w-full flex-col max-md:mt-4 md:sticky md:top-24 md:h-[calc(100dvh_-_6rem)]">
          <div className="relative h-20 w-full shrink-0">
            <div className="absolute inset-x-0 bottom-[-32px] h-[72px] rounded-t-[30px] bg-[#e5e7eb]" />
            <div className="folder-tab absolute left-0 top-0 h-20 w-[320px] bg-[#e5e7eb]" />
            <span className="absolute left-12 top-3 flex h-9 items-center text-[13px] font-bold uppercase tracking-[0.08em] text-black/50">{s.tab}</span>
          </div>
          <div className="relative -mt-2 flex min-h-0 w-full flex-1 items-start overflow-hidden rounded-t-[28px] bg-gradient-to-b from-[#f7f8fa] via-[#f0f2f5] to-[#e7e9ed] shadow-[inset_0_2px_1px_rgba(255,255,255,0.35),0_-4px_16px_rgba(0,0,0,0.03)] max-md:rounded-b-[28px] md:items-center">
            <div className="mx-auto w-full max-w-[1100px] px-8 py-12 md:max-h-full md:overflow-y-auto md:px-12">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">{s.kicker}</p>
              <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 id={`sp-${s.id}`} className="mb-4 max-w-md text-2xl font-bold leading-tight md:text-3xl">{s.title}</h2>
                  <p className="max-w-md text-sm leading-relaxed text-black/60">{s.body}</p>
                  {onOpen && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <button type="button" onClick={() => onOpen(caseFor[s.id])}
                        className="whitespace-nowrap rounded-full bg-[#57A4F0] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#3E8FE4]">
                        {content.projects.find((p) => p.id === caseFor[s.id])?.name} →
                      </button>
                    </div>
                  )}
                </div>
                <Reveal>
                  <div className="group transition-all duration-300 hover:-translate-y-1.5 motion-reduce:hover:translate-y-0">
                    <div className="rounded-[6px] shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.24)]">
                      <div className="h-7 rounded-t-[6px] border border-b-0 border-[#d9b83a]/40 bg-gradient-to-b from-[#F4DA71] via-[#EACB4E] to-[#DFBA35]" />
                      <dl className="space-y-4 rounded-b-[6px] border border-t-0 border-white/60 bg-white/60 p-6 backdrop-blur-xl backdrop-saturate-150">
                        {s.metrics.map((m) => (
                          <div key={m.label} className="flex flex-col-reverse">
                            <dt className="mt-0.5 text-sm leading-snug text-black/55">{m.label}</dt>
                            <dd className="text-[15px] font-bold leading-snug text-black/85">{m.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
