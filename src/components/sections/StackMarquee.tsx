import type { Content } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

// Faixa que corre sozinha com a stack. A segunda volta é só visual.
export function StackMarquee({ content }: { content: Content }) {
  const card = (g: Content["stack"][number], hidden: boolean) => (
    <li key={`${g.group}-${hidden}`} aria-hidden={hidden || undefined}
      className="flex w-[250px] shrink-0 flex-col rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40">{g.group}</span>
      <span className="mt-2 text-[13px] font-semibold leading-snug text-black/80">{g.items.join(", ")}</span>
    </li>
  );
  return (
    <section aria-label={content.about.stackTitle} className="relative z-50 overflow-hidden bg-[#fafafa] py-16">
      <div className="mx-auto mb-8 max-w-[1060px] px-6">
        <Reveal><h2 className="text-3xl font-extrabold tracking-tight">{content.about.stackTitle}</h2></Reveal>
      </div>
      <div className="marquee relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="marquee-track flex w-max items-stretch gap-4 py-4 pl-4">
          {[...content.stack.map((g) => card(g, false)), ...content.stack.map((g) => card(g, true))]}
        </ul>
      </div>
    </section>
  );
}
