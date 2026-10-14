import type { Content } from "@/content/types";

// Uma pasta entreaberta com o terminal saindo de dentro. Clique abre o terminal.
export function TerminalPromo({ content, onOpen }: { content: Content; onOpen: () => void }) {
  const p = content.playground;
  return (
    <section aria-label={`${p.before} ${p.after}`} className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-28">
      <button type="button" onClick={onOpen} className="group mx-auto flex w-fit flex-col items-center">
        <span className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
          <span className="text-5xl font-extrabold tracking-tight md:text-7xl">{p.before}</span>
          <span aria-hidden className="relative block h-[108px] w-[150px] md:h-[126px] md:w-[176px]">
            <span className="absolute left-0 top-[8%] h-[34%] w-[42%] rounded-t-xl bg-[#c8ccd3]" />
            <span className="absolute inset-x-0 bottom-0 h-[78%] rounded-2xl bg-gradient-to-b from-[#c8ccd3] to-[#b6bac2]" />
            <span className="absolute bottom-[30%] left-1/2 block w-[48%] -translate-x-[80%] -rotate-0 overflow-hidden rounded-lg border-[3px] border-white bg-[#1c1c1e] p-1.5 font-mono text-[7px] leading-tight text-[#e5e5ea] shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-[45%] group-hover:-rotate-12 md:text-[8px]">
              $ whoami<br />darta<br />$ help
            </span>
            <span className="absolute bottom-[30%] left-1/2 block w-[44%] -translate-x-[15%] overflow-hidden rounded-lg border-[3px] border-white bg-white p-1.5 font-mono text-[7px] leading-tight text-black/60 shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-[55%] group-hover:rotate-12 md:text-[8px]">
              cv.pdf<br />stack<br />contato
            </span>
            <span className="absolute bottom-[30%] left-1/2 flex aspect-square w-[40%] -translate-x-1/2 -rotate-1 items-center justify-center rounded-lg bg-[#FFE066] p-1 font-mono text-[9px] font-semibold text-black/70 shadow-md transition-transform duration-300 ease-out group-hover:-translate-y-[68%]">&gt;_</span>
            <span className="absolute inset-x-0 bottom-0 z-10 block h-[62%] origin-bottom rounded-2xl bg-gradient-to-b from-[#f2f3f5] to-[#dfe1e6] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_-2px_8px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out [transform:perspective(700px)] group-hover:[transform:perspective(700px)_rotateX(-24deg)]" />
            <span className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-90 rounded-full bg-[#F7CE46] px-5 py-2 text-sm font-semibold text-black opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100">{p.cta}</span>
          </span>
          <span className="text-5xl font-extrabold tracking-tight md:text-7xl">{p.after}</span>
        </span>
        <span className="mt-8 block max-w-md text-center text-sm text-black/50">{p.sub}</span>
      </button>
    </section>
  );
}
