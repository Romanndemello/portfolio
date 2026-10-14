"use client";
import { useCallback, useState } from "react";
import type { Content } from "@/content/types";
import { MenuBar } from "./desktop/MenuBar";
import { Dock, type DockId } from "./desktop/Dock";
import { DesktopFolders } from "./desktop/DesktopFolders";
import { Draggable } from "./desktop/Draggable";
import { Window } from "./desktop/Window";
import { Clock } from "./widgets/Clock";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { Contributions } from "./widgets/Contributions";
import { Weather } from "./widgets/Weather";
import { Photo } from "./widgets/Photo";
import { AppGrid } from "./widgets/AppGrid";
import { Hero } from "./sections/Hero";
import { Highlights } from "./sections/Highlights";
import { StackMarquee } from "./sections/StackMarquee";
import { Superpowers } from "./sections/Superpowers";
import { Experience } from "./sections/Experience";
import { Projects } from "./sections/Projects";
import { TerminalPromo } from "./sections/TerminalPromo";
import { AboutTxt } from "./sections/AboutTxt";
import { Contact } from "./sections/Contact";
import { TerminalWindow } from "./terminal/TerminalWindow";
import { useTerminalHotkey } from "./terminal/useTerminalHotkey";
import { langPath } from "@/lib/lang";

const GITHUB_USER = "Romanndemello";

export function Site({ content }: { content: Content }) {
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const project = content.projects.find((p) => p.id === openProject);
  const toggle = useCallback(() => setTerminalOpen((o) => !o), []);
  useTerminalHotkey(toggle);

  const openTerminal = () => {
    if (window.matchMedia("(max-width: 767px)").matches) window.location.href = langPath(content.lang, "terminal");
    else setTerminalOpen(true);
  };

  const scrollTo = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  const onDock = (id: DockId) => {
    if (id === "terminal") openTerminal();
    else if (id === "meeting") window.location.href = content.contact.meeting;
    else if (id === "home") window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    else scrollTo(id);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative">
        <div className="z-0 min-h-[100svh] w-full bg-white md:h-[100dvh] md:min-h-0 md:overflow-hidden">
          <div className="relative h-full w-full overflow-hidden bg-[#fafafa]">
            <MenuBar content={content} />
            {/* desktop: mesa com widgets soltos */}
            <div className="hidden h-full md:block">
              <DesktopFolders content={content} onOpen={setOpenProject} />
              <Draggable style={{ top: 90, left: 24 }} delay={0}><Clock city={content.widgets.city} /></Draggable>
              <Draggable style={{ top: 90, left: 194 }} delay={60}><CalendarWidget lang={content.lang} href={content.contact.meeting} /></Draggable>
              <Draggable style={{ top: 90, left: 364 }} delay={120}><Contributions user={GITHUB_USER} labels={content.contributions} /></Draggable>
              <Draggable style={{ top: 264, left: 24 }} delay={180}><Weather city={content.widgets.weatherCity} lang={content.lang} /></Draggable>
              <Draggable style={{ top: 404, left: 24 }} delay={240}><Photo src="/darta.jpg" alt={content.widgets.photoAlt} caption={content.widgets.monogram} /></Draggable>
              <Draggable style={{ bottom: 120, right: 48 }} delay={300}><AppGrid content={content} onTerminal={openTerminal} /></Draggable>
              <Hero content={content} />
            </div>
            {/* celular: tudo empilhado */}
            <div className="flex min-h-full flex-col px-5 pb-10 pt-12 md:hidden">
              <Hero content={content} variant="card" />
              <div className="mt-4 grid grid-cols-2 justify-items-center gap-4">
                <Photo src="/darta.jpg" alt={content.widgets.photoAlt} caption={content.widgets.monogram} />
                <Clock city={content.widgets.city} />
                <div className="col-span-2"><CalendarWidget lang={content.lang} href={content.contact.meeting} /></div>
              </div>
              <div className="mt-6"><DesktopFolders content={content} onOpen={setOpenProject} layout="grid" /></div>
              <AppGrid content={content} onTerminal={openTerminal} className="mt-6 self-center" />
            </div>
          </div>
        </div>
      </div>
      <Dock content={content} onOpen={onDock} />
      <main className="relative z-50 bg-white">
        <Highlights content={content} />
        <StackMarquee content={content} />
        <Superpowers content={content} onOpen={setOpenProject} />
        <Experience content={content} />
        <Projects content={content} onOpen={setOpenProject} />
        <TerminalPromo content={content} onOpen={openTerminal} />
        <AboutTxt content={content} />
      </main>
      <Contact content={content} />
      {project && (
        <Window title={project.name} closeLabel={content.closeLabel} onClose={() => setOpenProject(null)}>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">{project.role} · {project.period}</p>
          <p className="mt-3 text-[15px] font-bold leading-snug">{project.summary}</p>
          <ul className="mt-4 space-y-2 text-black/60">{project.bullets.map((b) => <li key={b} className="flex gap-2"><span aria-hidden className="text-black/30">•</span>{b}</li>)}</ul>
          <p className="mt-5 font-mono text-xs text-black/45">{project.stack.join(" · ")}</p>
        </Window>
      )}
      {terminalOpen && (
        <TerminalWindow content={content} onClose={() => setTerminalOpen(false)}
          onOpenProject={(id) => { setTerminalOpen(false); setOpenProject(id); }} />
      )}
    </div>
  );
}
