import type { Content } from "@/content/types";
import type { IconColor } from "@/lib/palette";
import { gradient } from "@/lib/palette";
import { Bot, Briefcase, Commit, Phone, Plug, Users } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

const LOOK: Record<Content["highlights"][number]["icon"], { color: IconColor; Icon: typeof Commit }> = {
  years: { color: "yellow", Icon: Briefcase },
  users: { color: "blue", Icon: Users },
  plug: { color: "green", Icon: Plug },
  commits: { color: "purple", Icon: Commit },
  agents: { color: "ink", Icon: Bot },
  screens: { color: "pink", Icon: Phone },
};

export function Highlights({ content }: { content: Content }) {
  return (
    <section id="highlights" aria-label={content.highlightsTitle} className="relative z-50 scroll-mt-24 bg-white px-6 py-20">
      <div className="mx-auto max-w-[1060px]">
        <Reveal><h2 className="mb-8 text-3xl font-extrabold tracking-tight">{content.highlightsTitle}</h2></Reveal>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {content.highlights.map((h, i) => {
            const { color, Icon } = LOOK[h.icon];
            return (
              <li key={h.value}>
                <Reveal delay={i * 80}>
                  <div className="mb-4 flex h-36 items-center justify-center rounded-2xl border border-black/[0.06] bg-black/[0.03]">
                    <span style={{ backgroundImage: gradient(color) }}
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-[22%] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.25)]">
                      <Icon className="h-9 w-9 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" />
                    </span>
                  </div>
                  <p className="text-[15px] font-bold leading-snug">{h.value}</p>
                  <p className="mt-1 text-sm leading-snug text-black/55">{h.label}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
