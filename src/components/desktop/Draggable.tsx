"use client";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";

// Widget solto na mesa: dá pra arrastar com mouse ou dedo. Clique sem arrastar passa direto.
export function Draggable({ style, delay = 0, children }: { style: CSSProperties; delay?: number; children: ReactNode }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const moved = useRef(false);
  return (
    <div style={{ ...style, transform: `translate(${offset.x}px, ${offset.y}px)` }} className="absolute z-20 cursor-grab touch-none select-none active:cursor-grabbing">
      <div className="widget-in" style={{ animationDelay: `${delay}ms` }}
        onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          moved.current = false;
          const start = { x: e.clientX - offset.x, y: e.clientY - offset.y };
          const origin = { x: e.clientX, y: e.clientY };
          const move = (ev: PointerEvent) => {
            if (Math.abs(ev.clientX - origin.x) + Math.abs(ev.clientY - origin.y) > 4) moved.current = true;
            if (moved.current) setOffset({ x: ev.clientX - start.x, y: ev.clientY - start.y });
          };
          const end = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", end);
          window.addEventListener("pointercancel", end);
        }}>
        {children}
      </div>
    </div>
  );
}
