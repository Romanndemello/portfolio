"use client";
import type { Content } from "@/content/types";
import { FolderIcon } from "@/components/ui/Icons";
import { Draggable } from "./Draggable";

function Folder({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label={label} className="group flex w-20 flex-col items-center gap-1 outline-none">
      <FolderIcon className="h-14 w-14 transition-transform group-hover:scale-105" />
      <span className="rounded-[5px] bg-white/70 px-1.5 py-0.5 text-center text-[12px] font-medium leading-tight text-black/80 backdrop-blur-sm group-hover:bg-[#0069d9] group-hover:text-white group-focus-visible:bg-[#0069d9] group-focus-visible:text-white">{label}</span>
    </button>
  );
}

// "desk": soltas na direita, arrastáveis. "grid": grade de 4, pro celular.
export function DesktopFolders({ content, onOpen, layout = "desk" }: { content: Content; onOpen: (id: string) => void; layout?: "desk" | "grid" }) {
  if (layout === "grid") {
    return (
      <ul className="grid grid-cols-4 gap-x-2 gap-y-5">
        {content.folders.map((f) => (
          <li key={f.id} className="flex justify-center"><Folder label={f.label} onOpen={() => onOpen(f.id)} /></li>
        ))}
      </ul>
    );
  }
  return (
    <>
      {content.folders.map((f, i) => (
        <Draggable key={f.id} style={{ top: 90 + i * 108, right: "2.5%" }} delay={200 + i * 60}>
          <Folder label={f.label} onOpen={() => onOpen(f.id)} />
        </Draggable>
      ))}
    </>
  );
}
