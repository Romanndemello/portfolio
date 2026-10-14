"use client";
import { en } from "@/content/en";
import { TerminalView } from "@/components/terminal/TerminalView";
import { langPath } from "@/lib/lang";

export default function Page() {
  return <main className="h-dvh"><TerminalView content={en} onOpenProject={() => { window.location.href = `${langPath("en")}#projects`; }} /></main>;
}
