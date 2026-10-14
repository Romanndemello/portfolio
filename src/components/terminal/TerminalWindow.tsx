"use client";
import type { Content } from "@/content/types";
import { Window } from "@/components/desktop/Window";
import { TerminalView } from "./TerminalView";

export function TerminalWindow({ content, onClose, onOpenProject }: { content: Content; onClose: () => void; onOpenProject: (id: string) => void }) {
  return (
    <Window title="darta@portfolio" closeLabel={content.closeLabel} onClose={onClose} initial={{ x: 120, y: 120 }} bare>
      <div className="h-[360px]"><TerminalView content={content} onOpenProject={onOpenProject} /></div>
    </Window>
  );
}
