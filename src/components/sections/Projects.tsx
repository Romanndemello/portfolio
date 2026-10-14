import type { Content } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Projects({ content, onOpen }: { content: Content; onOpen: (id: string) => void }) {
  return (
    <section id="projects" aria-label={content.projectsTitle} className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-20">
      <div className="mx-auto max-w-[1060px]">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">{content.projectsTitle}</h2>
            <p className="text-sm text-black/50">{content.projectsSub}</p>
          </div>
        </Reveal>
        <ul>
          {content.projects.map((p) => (
            <li key={p.id}>
              <Reveal>
                <button type="button" onClick={() => onOpen(p.id)}
                  className="group flex w-full flex-col gap-1 border-b border-black/10 py-4 text-left sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="flex items-baseline gap-3">
                    <span className="text-[15px] font-bold leading-snug group-hover:underline group-hover:decoration-black/30 group-hover:underline-offset-4">{p.name}</span>
                    <span className="text-xs text-black/40">{p.role} · {p.period}</span>
                  </span>
                  <span className="text-sm text-black/55 sm:max-w-md sm:text-right">{p.summary}</span>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
