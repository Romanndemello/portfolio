"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { clampPosition } from "@/lib/clamp";

type Props = { title: string; closeLabel: string; onClose: () => void; children: ReactNode; initial?: { x: number; y: number }; bare?: boolean };

export function Window({ title, closeLabel, onClose, children, initial = { x: 80, y: 80 }, bare = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial);
  const reduce = useReducedMotion();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) el.focus();
    return () => { if (opener && opener.isConnected) opener.focus(); };
  }, []);

  const fit = (p: { x: number; y: number }) => {
    const el = ref.current;
    if (!el) return p;
    return clampPosition(p, { w: el.offsetWidth, h: el.offsetHeight }, { w: window.innerWidth, h: window.innerHeight });
  };

  useEffect(() => {
    setPos((p) => fit(p));
    const onResize = () => setPos((p) => fit(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.div ref={ref} role="dialog" aria-label={title} tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}
      initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-[70] w-[min(560px,calc(100vw-16px))] overflow-hidden rounded-xl border border-black/15 bg-white text-black shadow-[0_18px_50px_rgba(0,0,0,0.18)] outline-none">
      <div className="relative flex cursor-grab touch-none items-center gap-2 border-b border-black/10 bg-[#f5f5f5] px-4 py-2.5 active:cursor-grabbing"
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          const start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          const move = (ev: PointerEvent) => setPos(fit({ x: ev.clientX - start.x, y: ev.clientY - start.y }));
          const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
          window.addEventListener("pointercancel", up);
        }}>
        <button type="button" onClick={onClose} aria-label={closeLabel} className="-m-1.5 grid min-h-6 min-w-6 place-items-center rounded-full">
          <span aria-hidden className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        </button>
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="absolute left-1/2 -translate-x-1/2 select-none text-xs font-medium text-black/55">{title}</span>
      </div>
      <div className={bare ? "" : "max-h-[70vh] overflow-auto p-6 text-sm"}>{children}</div>
    </motion.div>
  );
}
