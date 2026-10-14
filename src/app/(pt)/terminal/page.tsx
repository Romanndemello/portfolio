"use client";
import { pt } from "@/content/pt";
import { TerminalView } from "@/components/terminal/TerminalView";
import { langPath } from "@/lib/lang";

export default function Page() {
  return <main className="h-dvh"><TerminalView content={pt} onOpenProject={() => { window.location.href = `${langPath("pt")}#projects`; }} /></main>;
}
