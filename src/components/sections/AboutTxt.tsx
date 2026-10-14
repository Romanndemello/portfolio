"use client";
import { useState } from "react";
import type { Content } from "@/content/types";
import { Plus } from "@/components/ui/Icons";

export function AboutTxt({ content }: { content: Content }) {
  const a = content.about;
  const [open, setOpen] = useState(false);
  const label = "mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-black/40";
  return (
    <section id="about" aria-label={a.file} className="relative z-50 mx-auto max-w-[1060px] scroll-mt-24 px-6 py-16">
      <div className="overflow-hidden rounded-xl border border-black/15 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
        <div className="relative flex items-center gap-2 border-b border-black/10 bg-[#f5f5f5] px-4 py-2.5">
          <span aria-hidden className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-black/55">{a.file}</span>
        </div>
        <div className="grid gap-10 p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className={label}>{a.labels.then}</p>
            <p className="text-sm leading-relaxed text-black/60">{a.then}</p>
            <p className={`${label} mt-8`}>{content.education.title}</p>
            <p className="text-sm leading-relaxed text-black/60">{content.education.course} · {content.education.school} · {content.education.period}</p>
            <p className={`${label} mt-8`}>{a.stackTitle}</p>
            <dl className="grid gap-1 text-sm text-black/60">
              {content.stack.map((g) => (
                <div key={g.group} className="flex flex-wrap gap-x-2"><dt className="font-semibold text-black/75">{g.group}</dt><dd>{g.items.join(", ")}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <p className={label}>{a.labels.now}</p>
            <p className="text-sm leading-relaxed text-black/60">{a.now}</p>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-black/75">{a.availability}</p>
            <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}
              className="mt-8 flex cursor-pointer items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black/70">
              {a.labels.next}
              <Plus className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
            </button>
            <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
              <div className="overflow-hidden">
                <p className="pt-3 text-sm leading-relaxed text-black/60">{a.next}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
