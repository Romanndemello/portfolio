import type { Content, Lang } from "@/content/types";

export type TerminalAction =
  | { type: "clear" }
  | { type: "lang"; lang: Lang }
  | { type: "download"; href: string }
  | { type: "open"; projectId: string };

export type TerminalResult = { lines: string[]; action?: TerminalAction };

export const COMMANDS = [
  "help", "whoami", "superpoderes", "superpowers", "projetos", "projects",
  "stack", "contato", "contact", "cv", "lang", "clear",
] as const;

const MAX_ECHO = 40;

export function runCommand(input: string, c: Content): TerminalResult {
  const parts = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { lines: [] };
  const [cmd, ...args] = parts;
  const arg = args.join(" ");

  switch (cmd) {
    case "help":
      return { lines: c.terminal.help };
    case "whoami":
      return { lines: c.terminal.whoami };
    case "superpoderes":
    case "superpowers":
      return {
        lines: c.superpowers.flatMap((s) => [
          `${s.kicker} · ${s.title}`,
          ...s.metrics.map((m) => `  ${m.value}  ${m.label}`),
        ]),
      };
    case "projetos":
    case "projects": {
      if (!arg) return { lines: c.projects.map((p) => `${p.id.padEnd(12)} ${p.name} · ${p.role}`) };
      const p = c.projects.find((x) => x.id === arg || x.name.toLowerCase() === arg);
      if (!p) return { lines: [c.terminal.projectNotFound.replace("{name}", arg.slice(0, MAX_ECHO))] };
      return { lines: [`${p.name} · ${p.summary}`], action: { type: "open", projectId: p.id } };
    }
    case "stack":
      return { lines: c.stack.map((g) => `${g.group}: ${g.items.join(", ")}`) };
    case "contato":
    case "contact":
      return {
        lines: [
          `email     ${c.contact.email.replace("mailto:", "")}`,
          `linkedin  ${c.contact.linkedin}`,
          `github    ${c.contact.github}`,
          `whatsapp  ${c.contact.whatsapp}`,
        ],
      };
    case "cv":
      return { lines: [c.terminal.cvDownloading], action: { type: "download", href: c.cvHref } };
    case "lang":
      if (arg === "pt" || arg === "en") return { lines: [], action: { type: "lang", lang: arg } };
      return { lines: ["lang pt | lang en"] };
    case "clear":
      return { lines: [], action: { type: "clear" } };
    case "sudo":
      if (arg === "contratar" || arg === "hire") return { lines: [c.terminal.hire] };
      break;
    case "ls":
      if (arg === "agentes" || arg === "agents") return { lines: c.terminal.agents };
      break;
  }
  return { lines: [c.terminal.unknown.replace("{cmd}", cmd.slice(0, MAX_ECHO))] };
}

export function complete(prefix: string): string | null {
  const p = prefix.trim().toLowerCase();
  if (!p) return null;
  const hits = COMMANDS.filter((c) => c.startsWith(p));
  return hits.length === 1 ? hits[0] : null;
}
