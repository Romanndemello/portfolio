"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content/types";
import { complete, runCommand } from "@/terminal/interpreter";
import { historyStep } from "@/terminal/history";
import { langPath, saveLang } from "@/lib/lang";

type Line = { kind: "in" | "out"; text: string };

export function TerminalView({ content, onOpenProject }: { content: Content; onOpenProject: (id: string) => void }) {
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: content.terminal.welcome }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const out = useRef<HTMLDivElement>(null);

  useEffect(() => { input.current?.focus(); }, []);
  useEffect(() => { const el = out.current; if (el) el.scrollTop = el.scrollHeight; }, [lines]);

  const submit = () => {
    const r = runCommand(value, content);
    const nextHistory = value.trim() ? [...history, value] : history;
    setHistory(nextHistory);
    setHIndex(nextHistory.length);
    setValue("");
    if (r.action?.type === "clear") { setLines([]); return; }
    setLines((l) => [...l, { kind: "in", text: value }, ...r.lines.map((text) => ({ kind: "out" as const, text }))]);
    if (r.action?.type === "lang") { saveLang(r.action.lang); window.location.href = langPath(r.action.lang, "", { explicit: true }); }
    if (r.action?.type === "download") window.location.href = r.action.href;
    if (r.action?.type === "open") onOpenProject(r.action.projectId);
  };

  return (
    <div className="flex h-full flex-col bg-neutral-950 p-3 font-mono text-[13px] text-neutral-100" onClick={() => input.current?.focus()}>
      <div ref={out} className="flex-1 overflow-auto" aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i} className="whitespace-pre-wrap break-words">{l.kind === "in" ? `$ ${l.text}` : l.text}</pre>
        ))}
      </div>
      <label className="mt-2 flex items-center gap-2">
        <span aria-hidden>$</span>
        <input ref={input} aria-label="Terminal" value={value} maxLength={200} autoCapitalize="off" autoComplete="off" spellCheck={false}
          className="flex-1 bg-transparent outline-none"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); submit(); }
            else if (e.key === "Tab") { e.preventDefault(); const c = complete(value); if (c) setValue(c); }
            else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              const s = historyStep(history, hIndex, e.key === "ArrowUp" ? "up" : "down");
              setHIndex(s.index); setValue(s.value);
            }
          }} />
      </label>
    </div>
  );
}
