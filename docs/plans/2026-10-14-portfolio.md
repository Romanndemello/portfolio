# Portfólio pessoal · plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site portfólio bilíngue do Darta, com metáfora de desktop, terminal funcional e números reais, publicado na Vercel.

**Architecture:** Next.js App Router com `output: 'export'` (só estático). Todo texto vem de um objeto de conteúdo tipado por idioma (`src/content/`). O terminal é um interpretador puro (`src/terminal/`), testado sem React, e a UI só renderiza o que ele devolve. Único dado ao vivo: gráfico de contribuições do GitHub, buscado no cliente e escondido em falha.

**Tech Stack:** Node 20+, Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Vitest + Testing Library, Playwright, Vercel.

**Spec:** `docs/specs/2026-10-14-portfolio-design.md`

## Global Constraints

- Bilíngue: `/` português, `/en` inglês. PT e EN têm exatamente as mesmas chaves de conteúdo.
- Nenhum número sem fonte em `docs/dados/`.
- Carmillion: nenhum cliente pelo nome ("concessionárias e lojas de veículos"), nenhum código, só números agregados.
- Texto sem travessão (`—` e `–` proibidos no conteúdo).
- `output: 'export'`: nada de rota de API, nada de server action, nada de `cookies()`/`headers()`.
- Framer Motion respeita `prefers-reduced-motion`.
- Terminal é opcional: todo conteúdo dele existe na página normal.
- Lighthouse mobile: performance e acessibilidade ≥ 90.
- localStorage sempre dentro de try/catch.

## Review Focus

1. **localStorage indisponível** (aba anônima, bloqueado): o site renderiza normal, idioma vem da URL. → teste em Task 4.
2. **Entrada esquisita no terminal** (vazia, só espaços, MAIÚSCULA, comando inexistente, 500 caracteres): nunca quebra; vazia não gera saída; inexistente sugere `help`. → testes em Task 3.
3. **API de contribuições fora ou lenta**: widget some sem deslocar o layout; nada mais quebra. → teste em Task 8.
4. **Celular 375px**: sem rolagem horizontal; janelas não arrastam pra fora da tela. → e2e em Task 10 e clamp em Task 5.
5. **Tecla `` ` `` digitada dentro de um campo de texto** não abre/fecha o terminal; `Esc` fecha. → teste em Task 7.

---

## Mapa de arquivos

```
portfolio/
  next.config.ts                  export estático
  vitest.config.ts / playwright.config.ts
  src/
    content/
      types.ts                    tipo Content (fonte única do formato)
      pt.ts / en.ts               conteúdo por idioma
      index.ts                    getContent(lang), Lang
      content.test.ts             paridade PT/EN, sem travessão, sem valor vazio
    terminal/
      interpreter.ts              runCommand, complete, COMMANDS
      history.ts                  navegação ↑↓ pura
      interpreter.test.ts / history.test.ts
    lib/
      lang.ts                     detectLang, saveLang, readSavedLang (try/catch)
      lang.test.ts
      clamp.ts                    clampPosition (janela dentro da tela)
      clamp.test.ts
    components/
      desktop/MenuBar.tsx Dock.tsx DesktopFolders.tsx Window.tsx
      sections/Hero.tsx Superpowers.tsx Projects.tsx AboutTxt.tsx Contact.tsx
      terminal/TerminalWindow.tsx useTerminalHotkey.ts
      widgets/Contributions.tsx
      Site.tsx                    monta tudo pra um idioma
    app/
      layout.tsx globals.css
      page.tsx                    PT
      en/page.tsx                 EN
      terminal/page.tsx en/terminal/page.tsx   terminal em página cheia (celular)
      cv/page.tsx en/cv/page.tsx  CV imprimível
  scripts/build-cv.mjs            gera public/cv-pt.pdf e public/cv-en.pdf
  e2e/site.spec.ts
  docs/dados/                     fontes dos números
```

---

### Task 1: Esqueleto do projeto

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `.gitignore`
- Test: `src/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` (Vitest), `npm run build` gera `out/`, `npm run e2e` (Playwright, configurado na Task 10).

- [ ] **Step 1: Gerar o app**

```bash
cd ~/Projects/portfolio
npx create-next-app@15 . --ts --tailwind --app --src-dir --eslint --import-alias "@/*" --use-npm --no-turbopack --yes
npm i framer-motion
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```
Se reclamar de pasta não vazia (há `docs/`), mover `docs/` pra `/tmp/portfolio-docs`, rodar, e mover de volta.

- [ ] **Step 2: Export estático**

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
```

- [ ] **Step 3: Vitest**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```
`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```
Em `package.json` → `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 4: Teste de fumaça**

`src/smoke.test.ts`:
```ts
import { expect, test } from "vitest";
test("vitest roda", () => expect(1 + 1).toBe(2));
```
Run: `npm test` → PASS.

- [ ] **Step 5: Build**

Run: `npm run build` → termina sem erro e cria `out/index.html`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: esqueleto Next.js com export estático e Vitest"
```

---

### Task 2: Levantar os números que faltam

Números dos superpoderes 2 (agentes) e 3 (produto). O 4 (comercial) usa só fatos já conhecidos (sócio em 3 negócios, comercial da Favo) e não tem número.

**Files:**
- Create: `docs/dados/ovis-numeros.md`, `docs/dados/favo-os-numeros.md`, `docs/dados/agentes-numeros.md`

- [ ] **Step 1: Ovis e Favo OS**

```bash
for d in ~/ovis/ovis-front-mob ~/Projects/favo-os; do
  cd "$d"; echo "== $d"
  git log --all --no-merges --author='dartagnanromann@gmail.com' --author='Romanndemello' --format=%h | wc -l
  git log --all --no-merges --format=%h | wc -l
  git log --all --format=%ad --date=short | sort | sed -n '1p;$p'
  git log --all --merges --grep='Merge pull request' --format=%h | wc -l
  ls src/app 2>/dev/null | head -30   # telas/rotas, pra citar módulos
done
```
Escrever em cada arquivo: período, commits do Darta / total, PRs, módulos principais (lidos das rotas). Data do snapshot no topo.

- [ ] **Step 2: Agentes**

```bash
ls ~/.claude/agents/ 2>/dev/null; ls ~/Documents/ccos-ratos-main/.claude/skills/ | wc -l
ls -d ~/aiox-cored ~/agent-office ~/dartabrain ~/romann-brain 2>/dev/null
for d in ~/aiox-cored ~/agent-office; do [ -d "$d/.git" ] && git -C "$d" log --all --format=%h | wc -l; done
```
Escrever `agentes-numeros.md`: nº de agentes com papel definido (arquivos em `~/.claude/agents/`), nº de skills do sistema pessoal, Hermes rodando numa VPS, commits nos repos de agentes. Só o que o comando devolver.

- [ ] **Step 3: Conferência com o Darta**

Mostrar os três arquivos ao Darta e aguardar o ok antes da Task 3 (ele confere antes de publicar, regra da spec).

- [ ] **Step 4: Commit**

```bash
git add docs/dados && git commit -m "docs: números de Ovis, Favo OS e agentes"
```

---

### Task 3: Conteúdo tipado e interpretador do terminal

Conteúdo e terminal andam juntos: o terminal só formata o conteúdo.

**Files:**
- Create: `src/content/types.ts`, `src/content/pt.ts`, `src/content/en.ts`, `src/content/index.ts`, `src/terminal/interpreter.ts`, `src/terminal/history.ts`
- Test: `src/content/content.test.ts`, `src/terminal/interpreter.test.ts`, `src/terminal/history.test.ts`

**Interfaces:**
- Produces:
  - `type Lang = "pt" | "en"`; `getContent(lang: Lang): Content`
  - `type Content` (abaixo)
  - `runCommand(input: string, content: Content): TerminalResult`
  - `type TerminalResult = { lines: string[]; action?: { type: "clear" } | { type: "lang"; lang: Lang } | { type: "download"; href: string } | { type: "open"; projectId: string } }`
  - `complete(prefix: string): string | null`
  - `COMMANDS: readonly string[]`
  - `historyStep(history: string[], index: number, dir: "up" | "down"): { index: number; value: string }`

- [ ] **Step 1: Tipo do conteúdo**

`src/content/types.ts`:
```ts
export type Lang = "pt" | "en";

export type Metric = { value: string; label: string; source: string };

export type Superpower = {
  id: "producao" | "agentes" | "produto" | "comercial";
  kicker: string;
  title: string;
  body: string;
  metrics: Metric[];
};

export type Project = {
  id: string;
  name: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
  bullets: string[];
};

export type Job = { company: string; role: string; period: string; place: string; bullets: string[] };

export type Content = {
  lang: Lang;
  meta: { title: string; description: string };
  menu: { name: string; role: string };
  hero: { line1: string; line2: string; sub: string };
  folders: { id: string; label: string }[];
  dock: { terminal: string; projects: string; github: string; contact: string; cv: string };
  superpowersTitle: string;
  superpowers: Superpower[];
  projectsTitle: string;
  projects: Project[];
  about: { file: string; then: string; now: string; next: string; labels: { then: string; now: string; next: string } };
  jobs: Job[];
  stack: { group: string; items: string[] }[];
  contact: { title: string; email: string; linkedin: string; github: string; whatsapp: string; meeting: string };
  terminal: {
    welcome: string;
    help: string[];
    whoami: string[];
    unknown: string; // contém "{cmd}"
    hire: string;
    agents: string[];
    langChanged: string;
    cvDownloading: string;
    projectNotFound: string; // contém "{name}"
  };
  cvHref: string;
};
```

- [ ] **Step 2: Teste de paridade e regras (falha)**

`src/content/content.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { pt } from "./pt";
import { en } from "./en";

function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)]));
  return typeof v;
}

function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

describe("conteúdo", () => {
  test("PT e EN têm o mesmo formato", () => {
    const { lang: _a, ...p } = pt;
    const { lang: _b, ...e } = en;
    expect(shape(e)).toEqual(shape(p));
  });

  test.each([["pt", pt], ["en", en]])("%s: nenhum texto vazio", (_, c) => {
    for (const s of strings(c)) expect(s.trim().length).toBeGreaterThan(0);
  });

  test.each([["pt", pt], ["en", en]])("%s: sem travessão", (_, c) => {
    for (const s of strings(c)) expect(s).not.toMatch(/[—–]/);
  });

  test.each([["pt", pt], ["en", en]])("%s: nenhum cliente da Carmillion pelo nome", (_, c) => {
    const text = strings(c).join(" ").toLowerCase();
    for (const nome of nomesConfidenciais /* lista fora do git */) expect(text).not.toContain(nome);
  });

  test.each([["pt", pt], ["en", en]])("%s: toda métrica tem fonte em docs/dados", (_, c) => {
    for (const sp of c.superpowers) for (const m of sp.metrics) expect(m.source).toMatch(/^docs\/dados\/.+\.md$/);
  });

  test.each([["pt", pt], ["en", en]])("%s: nenhuma métrica com valor provisório", (_, c) => {
    for (const sp of c.superpowers) for (const m of sp.metrics) expect(m.value).not.toBe("N");
  });
});
```
Run: `npm test` → FAIL (módulos não existem).

- [ ] **Step 3: Conteúdo PT**

`src/content/pt.ts`. Superpoder 1 usa os números de `docs/dados/crmillion-numeros.md`; 2 e 3 usam os da Task 2 (substituir os `value` abaixo pelos números conferidos; os rótulos ficam). Exemplo completo:
```ts
import type { Content } from "./types";

export const pt: Content = {
  lang: "pt",
  meta: {
    title: "D'Artagnan Romann · Tech Lead",
    description: "Tech Lead e dev full stack. Sistemas que vão pra produção e agentes de IA que ajudam a construir.",
  },
  menu: { name: "D'Artagnan Romann", role: "Tech Lead" },
  hero: {
    line1: "Eu sou o Darta.",
    line2: "Construo sistemas que vão pra produção.",
    sub: "E agentes de IA que ajudam a construir. Tech Lead, full stack, sócio de três negócios.",
  },
  folders: [
    { id: "crmillion", label: "Carmillion" },
    { id: "ovis", label: "Ovis" },
    { id: "favo-os", label: "Favo OS" },
    { id: "agentes", label: "Agentes" },
  ],
  dock: { terminal: "Terminal", projects: "Projetos", github: "GitHub", contact: "Contato", cv: "CV" },
  superpowersTitle: "Superpoderes",
  superpowers: [
    {
      id: "producao",
      kicker: "SUPERPODER Nº1",
      title: "Engenharia que vai pra produção.",
      body: "Tech Lead do CRMillion, um CRM pra concessionárias e lojas de veículos. Infra em Docker Swarm com Traefik, deploy, Postgres com Prisma e integrações de WhatsApp em fila.",
      metrics: [
        { value: "360 de 414", label: "PRs do time revisados e mergeados por mim (87%)", source: "docs/dados/crmillion-numeros.md" },
        { value: "805", label: "commits em 7 meses, API e app", source: "docs/dados/crmillion-numeros.md" },
        { value: "5", label: "integrações: WhatsApp Cloud API, ZapperHub, OLX, Mercado Livre, Messenger", source: "docs/dados/crmillion-numeros.md" },
      ],
    },
    {
      id: "agentes",
      kicker: "SUPERPODER Nº2",
      title: "Agentes de IA no dia a dia.",
      body: "Trabalho com uma frota de agentes com papéis definidos: um planeja, outro implementa, outro verifica. Tenho um agente autônomo rodando numa VPS e um sistema operacional pessoal que guarda contexto entre sessões.",
      metrics: [
        { value: "N", label: "agentes com papel definido", source: "docs/dados/agentes-numeros.md" },
        { value: "N", label: "skills no meu sistema pessoal", source: "docs/dados/agentes-numeros.md" },
      ],
    },
    {
      id: "produto",
      kicker: "SUPERPODER Nº3",
      title: "Produto do zero.",
      body: "Ovis, app de gestão de ovinocultura (rebanho, pesagem, manejo), e Favo OS, o sistema interno de um estúdio criativo com portal do cliente. Do 0 ao 1, como sócio.",
      metrics: [
        { value: "N", label: "commits no app da Ovis", source: "docs/dados/ovis-numeros.md" },
        { value: "N", label: "commits no Favo OS", source: "docs/dados/favo-os-numeros.md" },
      ],
    },
    {
      id: "comercial",
      kicker: "SUPERPODER Nº4",
      title: "Dev que vende.",
      body: "Toco o comercial da Favo e sou sócio de três negócios. Entendo o cliente antes de abrir o editor.",
      metrics: [
        { value: "3", label: "negócios como sócio: Favo, Ovis e uma consultoria de automação de vendas", source: "docs/dados/linkedin.md" },
      ],
    },
  ],
  projectsTitle: "Projetos",
  projects: [
    {
      id: "crmillion", name: "CRMillion", role: "Tech Lead", period: "2026",
      summary: "CRM pra concessionárias e lojas de veículos, com WhatsApp e marketplaces integrados.",
      stack: ["Node.js", "TypeScript", "Prisma", "Postgres", "Docker Swarm", "Traefik"],
      bullets: ["87% dos PRs do time passaram pela minha revisão", "Integrações com WhatsApp, OLX, Mercado Livre e Messenger"],
    },
    {
      id: "ovis", name: "Ovis", role: "Sócio e dev", period: "2025 a hoje",
      summary: "App e sistema web de gestão de ovinocultura.",
      stack: ["React Native", "Expo", "TypeScript"],
      bullets: ["Rebanho, pesagem e manejo no celular", "Design system próprio"],
    },
    {
      id: "favo-os", name: "Favo OS", role: "Sócio e dev", period: "2025 a hoje",
      summary: "Sistema interno de estúdio criativo: clientes, conteúdo, aprovações e portal do cliente.",
      stack: ["Next.js", "Supabase", "TypeScript"],
      bullets: ["Portal de aprovação pro cliente", "Ficha de cliente e fluxo de conteúdo"],
    },
    {
      id: "agentes", name: "Frota de agentes", role: "Autor", period: "2026",
      summary: "Agentes com papéis e um sistema que guarda contexto entre sessões.",
      stack: ["Claude Code", "Codex", "VPS"],
      bullets: ["Pipeline spec, plano, código, verificação, PR", "Agente autônomo rodando 24h"],
    },
    {
      id: "b3dev", name: "IELB · B3dev", role: "Full stack e Project Owner", period: "2021 a 2025",
      summary: "Modernização do sistema de gestão da IELB, de legado pra web.",
      stack: ["Vue", "Quasar", "Node.js", "Koa", "MongoDB"],
      bullets: ["Migração de SQL pra MongoDB", "Express pra Koa, +20% de eficiência", "Mentoria e onboarding de devs"],
    },
    {
      id: "saipos", name: "Saipos", role: "Full stack", period: "2025 a 2026",
      summary: "Ponte técnica entre desenvolvimento web e marketing.",
      stack: ["React", "TypeScript", "n8n"],
      bullets: ["Interfaces com foco em conversão", "Integração de leads com o iFood", "Automações com n8n e IA"],
    },
  ],
  about: {
    file: "sobre-mim.txt",
    labels: { then: "ANTES", now: "AGORA", next: "DEPOIS" },
    then: "Comecei em 2021 como full stack na B3dev, migrando sistema legado pra web. Virei Project Owner e passei a treinar quem chegava.",
    now: "Tech Lead, full stack e sócio de três negócios. Escrevo código que vai pra produção e uso agentes de IA pra multiplicar o que um time entrega.",
    next: "Liderar um time de produto que trata agente de IA como colega de trabalho, não como brinquedo.",
  },
  jobs: [
    { company: "Carmillion", role: "Tech Lead", period: "mar/2026 a out/2026", place: "São Leopoldo, RS", bullets: ["Liderança técnica do CRMillion", "360 de 414 PRs do time revisados e mergeados"] },
    { company: "Infusio Studio", role: "CTO", period: "jan/2025 a hoje", place: "Remoto", bullets: ["Automações com n8n e sites em Next.js"] },
    { company: "Saipos", role: "Desenvolvedor full stack", period: "set/2025 a mar/2026", place: "São Leopoldo, RS", bullets: ["Interfaces React e TypeScript com foco em conversão", "Integração de leads com o iFood"] },
    { company: "Sinosbyte", role: "Estágio SAP ABAP", period: "mai/2025 a ago/2025", place: "São Leopoldo, RS", bullets: ["ABAP e MySQL"] },
    { company: "B3dev", role: "Full stack e Project Owner", period: "dez/2021 a mai/2025", place: "Porto Alegre, RS", bullets: ["Migração de legado pra web", "SQL pra MongoDB", "Express pra Koa, +20% de eficiência"] },
  ],
  stack: [
    { group: "Linguagens", items: ["TypeScript", "JavaScript", "SQL"] },
    { group: "Front", items: ["React", "Next.js", "Vue", "React Native", "Astro", "Tailwind"] },
    { group: "Back", items: ["Node.js", "Koa", "Prisma", "Postgres", "MongoDB", "Supabase"] },
    { group: "Infra", items: ["Docker Swarm", "Traefik", "Vercel", "AWS"] },
    { group: "IA e automação", items: ["Claude Code", "Codex", "n8n"] },
  ],
  contact: {
    title: "Vamos conversar",
    email: "mailto:dartagnanromann@gmail.com",
    linkedin: "https://www.linkedin.com/in/dartagnanromann",
    github: "https://github.com/Romanndemello",
    whatsapp: "https://wa.me/5551984931844",
    meeting: "mailto:dartagnanromann@gmail.com?subject=Conversa",
  },
  terminal: {
    welcome: "darta@portfolio ~ digite help pra ver os comandos",
    help: [
      "whoami          quem sou eu",
      "superpoderes    o que eu faço melhor, com números",
      "projetos [nome] lista os projetos ou abre um",
      "stack           tecnologias",
      "contato         como falar comigo",
      "cv              baixa o currículo",
      "lang pt|en      troca o idioma",
      "clear           limpa a tela",
    ],
    whoami: [
      "D'Artagnan Romann de Mello (Darta), 23 anos, São Leopoldo, RS.",
      "Tech Lead e dev full stack. Sistemas em produção e agentes de IA.",
      "Aberto a vagas híbridas ou remotas.",
    ],
    unknown: "comando não encontrado: {cmd}. Digite help.",
    hire: "permissão concedida. Falta só me mandar um email: dartagnanromann@gmail.com",
    agents: ["planner.md", "backend-engineer.md", "frontend-engineer.md", "tester.md", "verifier.md", "pr-reviewer.md", "hermes (vps)"],
    langChanged: "idioma: português",
    cvDownloading: "baixando cv-pt.pdf",
    projectNotFound: "projeto não encontrado: {name}. Digite projetos.",
  },
  cvHref: "/cv-pt.pdf",
};
```
Antes de commitar, trocar todo `value: "N"` pelos números conferidos na Task 2. Se a lista `agents` divergir de `~/.claude/agents/`, usar a lista real.

- [ ] **Step 4: Conteúdo EN**

`src/content/en.ts`: mesma estrutura, tradução fiel de cada string, `lang: "en"`, `cvHref: "/cv-en.pdf"`, `kicker: "SUPERPOWER Nº1"` etc., `labels: { then: "THEN", now: "NOW", next: "NEXT" }`, `file: "about-me.txt"`, `superpowersTitle: "Superpowers"`, `projectsTitle: "Projects"`, `contact.title: "Let's talk"`, `dock: { terminal: "Terminal", projects: "Projects", github: "GitHub", contact: "Contact", cv: "Resume" }`, `terminal.help` com `superpowers` e `projects`/`contact` nos nomes, `unknown: "command not found: {cmd}. Type help."`, `hire: "permission granted. Just send me an email: dartagnanromann@gmail.com"`, `langChanged: "language: english"`, `cvDownloading: "downloading cv-en.pdf"`, `projectNotFound: "project not found: {name}. Type projects."`. Os `source` das métricas são idênticos aos do PT.

`src/content/index.ts`:
```ts
import type { Content, Lang } from "./types";
import { pt } from "./pt";
import { en } from "./en";

export type { Content, Lang } from "./types";
export const getContent = (lang: Lang): Content => (lang === "en" ? en : pt);
```
Run: `npm test` → testes de conteúdo PASS.

- [ ] **Step 5: Testes do interpretador (falha)**

`src/terminal/interpreter.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { complete, runCommand } from "./interpreter";
import { pt } from "@/content/pt";
import { en } from "@/content/en";

describe("runCommand", () => {
  test("help lista os comandos", () => {
    expect(runCommand("help", pt).lines).toEqual(pt.terminal.help);
  });
  test("whoami", () => {
    expect(runCommand("whoami", pt).lines).toEqual(pt.terminal.whoami);
  });
  test("entrada vazia ou só espaços não gera saída", () => {
    expect(runCommand("", pt)).toEqual({ lines: [] });
    expect(runCommand("    ", pt)).toEqual({ lines: [] });
  });
  test("ignora maiúsculas e espaços nas pontas", () => {
    expect(runCommand("  WHOAMI ", pt).lines).toEqual(pt.terminal.whoami);
  });
  test("comando inexistente sugere help", () => {
    expect(runCommand("rm -rf /", pt).lines).toEqual(["comando não encontrado: rm. Digite help."]);
  });
  test("entrada gigante não quebra e é truncada na mensagem", () => {
    const r = runCommand("x".repeat(500), pt);
    expect(r.lines).toHaveLength(1);
    expect(r.lines[0].length).toBeLessThan(120);
  });
  test("aliases PT e EN funcionam nos dois idiomas", () => {
    expect(runCommand("superpowers", pt).lines.join(" ")).toContain(pt.superpowers[0].title);
    expect(runCommand("superpoderes", en).lines.join(" ")).toContain(en.superpowers[0].title);
    expect(runCommand("projects", pt).lines.length).toBe(pt.projects.length);
    expect(runCommand("contact", pt).lines.join(" ")).toContain("linkedin.com/in/dartagnanromann");
  });
  test("projetos <nome> abre o projeto", () => {
    expect(runCommand("projetos ovis", pt).action).toEqual({ type: "open", projectId: "ovis" });
  });
  test("projetos <nome inexistente>", () => {
    expect(runCommand("projetos xyz", pt).lines).toEqual(["projeto não encontrado: xyz. Digite projetos."]);
  });
  test("lang troca idioma; lang inválido mostra ajuda", () => {
    expect(runCommand("lang en", pt).action).toEqual({ type: "lang", lang: "en" });
    expect(runCommand("lang fr", pt).action).toBeUndefined();
  });
  test("clear e cv devolvem ação", () => {
    expect(runCommand("clear", pt).action).toEqual({ type: "clear" });
    expect(runCommand("cv", pt).action).toEqual({ type: "download", href: "/cv-pt.pdf" });
  });
  test("easter eggs", () => {
    expect(runCommand("sudo contratar", pt).lines).toEqual([pt.terminal.hire]);
    expect(runCommand("sudo hire", en).lines).toEqual([en.terminal.hire]);
    expect(runCommand("ls agentes", pt).lines).toEqual(pt.terminal.agents);
  });
});

describe("complete", () => {
  test("completa prefixo único", () => expect(complete("who")).toBe("whoami"));
  test("prefixo ambíguo ou vazio devolve null", () => {
    expect(complete("")).toBeNull();
    expect(complete("c")).toBeNull(); // clear, contato, contact, cv
  });
  test("sem correspondência devolve null", () => expect(complete("zzz")).toBeNull());
});
```
Run: `npm test` → FAIL (módulo não existe).

- [ ] **Step 6: Interpretador**

`src/terminal/interpreter.ts`:
```ts
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
```
Run: `npm test` → PASS.

- [ ] **Step 7: Histórico (teste e implementação)**

`src/terminal/history.test.ts`:
```ts
import { expect, test } from "vitest";
import { historyStep } from "./history";

const h = ["help", "whoami", "stack"];

test("↑ a partir do fim pega o último", () => expect(historyStep(h, h.length, "up")).toEqual({ index: 2, value: "stack" }));
test("↑ no topo fica no topo", () => expect(historyStep(h, 0, "up")).toEqual({ index: 0, value: "help" }));
test("↓ passando do fim volta pro campo vazio", () => expect(historyStep(h, 2, "down")).toEqual({ index: 3, value: "" }));
test("histórico vazio", () => expect(historyStep([], 0, "up")).toEqual({ index: 0, value: "" }));
```
`src/terminal/history.ts`:
```ts
export function historyStep(history: string[], index: number, dir: "up" | "down") {
  if (history.length === 0) return { index: 0, value: "" };
  const next = dir === "up" ? Math.max(0, index - 1) : Math.min(history.length, index + 1);
  return { index: next, value: next === history.length ? "" : history[next] };
}
```
Run: `npm test` → PASS.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: conteúdo PT/EN tipado e interpretador do terminal"
```

---

### Task 4: Idioma (detecção, preferência salva, rotas)

**Files:**
- Create: `src/lib/lang.ts`, `src/app/en/page.tsx`, `src/components/LangRedirect.tsx`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`
- Test: `src/lib/lang.test.ts`

**Interfaces:**
- Produces: `detectLang(navigatorLanguages: readonly string[]): Lang`; `readSavedLang(): Lang | null`; `saveLang(lang: Lang): void`; `langPath(lang: Lang, path?: string): string`
- Consumes: `Lang` (Task 3)

- [ ] **Step 1: Testes (falha)**

`src/lib/lang.test.ts`:
```ts
import { afterEach, expect, test, vi } from "vitest";
import { detectLang, langPath, readSavedLang, saveLang } from "./lang";

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

test("detecta pt quando o navegador prefere português", () => expect(detectLang(["pt-BR", "en"])).toBe("pt"));
test("detecta en pra qualquer outro idioma", () => expect(detectLang(["de-DE"])).toBe("en"));
test("lista vazia cai em pt", () => expect(detectLang([])).toBe("pt"));

test("salva e lê a preferência", () => { saveLang("en"); expect(readSavedLang()).toBe("en"); });
test("valor estranho salvo é ignorado", () => { localStorage.setItem("lang", "fr"); expect(readSavedLang()).toBeNull(); });

test("localStorage que lança não quebra nada", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
  expect(readSavedLang()).toBeNull();
  expect(() => saveLang("pt")).not.toThrow();
});

test("langPath", () => {
  expect(langPath("pt")).toBe("/");
  expect(langPath("en")).toBe("/en/");
  expect(langPath("en", "terminal")).toBe("/en/terminal/");
  expect(langPath("pt", "cv")).toBe("/cv/");
});
```

- [ ] **Step 2: Implementação**

`src/lib/lang.ts`:
```ts
import type { Lang } from "@/content/types";

const KEY = "lang";

export function detectLang(languages: readonly string[]): Lang {
  const first = languages[0]?.toLowerCase() ?? "pt";
  return first.startsWith("pt") ? "pt" : "en";
}

export function readSavedLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "pt" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* sem storage: a URL continua mandando */
  }
}

export function langPath(lang: Lang, path = ""): string {
  const base = lang === "en" ? "/en/" : "/";
  return path ? `${base}${path}/` : base;
}
```
Run: `npm test` → PASS.

- [ ] **Step 3: Redirecionamento da primeira visita**

Só em `/` (PT). Se não há preferência salva e o navegador não é português, vai pra `/en/`. Se há preferência `en`, vai pra `/en/`. Nunca redireciona a partir de `/en/` (quem chegou por link em inglês fica).

`src/components/LangRedirect.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import { detectLang, readSavedLang } from "@/lib/lang";

export function LangRedirect() {
  useEffect(() => {
    const saved = readSavedLang();
    const want = saved ?? detectLang(navigator.languages ?? [navigator.language]);
    if (want === "en") window.location.replace("/en/");
  }, []);
  return null;
}
```

- [ ] **Step 4: Páginas**

`src/app/page.tsx`:
```tsx
import { Site } from "@/components/Site";
import { LangRedirect } from "@/components/LangRedirect";
import { pt } from "@/content/pt";

export const metadata = { title: pt.meta.title, description: pt.meta.description };

export default function Page() {
  return (<><LangRedirect /><Site content={pt} /></>);
}
```
`src/app/en/page.tsx`:
```tsx
import { Site } from "@/components/Site";
import { en } from "@/content/en";

export const metadata = { title: en.meta.title, description: en.meta.description };

export default function Page() {
  return <Site content={en} />;
}
```
`Site` é criado na Task 5; até lá, criar `src/components/Site.tsx` mínimo:
```tsx
import type { Content } from "@/content/types";
export function Site({ content }: { content: Content }) {
  return <main><h1>{content.hero.line1}</h1></main>;
}
```

- [ ] **Step 5: Build e commit**

Run: `npm test && npm run build` → PASS; `out/index.html` e `out/en/index.html` existem.
```bash
git add -A && git commit -m "feat: idioma por rota, detecção e preferência salva"
```

---

### Task 5: Casca do desktop (barra de menu, dock, pastas, janela)

**Files:**
- Create: `src/lib/clamp.ts`, `src/components/desktop/MenuBar.tsx`, `Dock.tsx`, `DesktopFolders.tsx`, `Window.tsx`
- Modify: `src/components/Site.tsx`, `src/app/globals.css`, `src/app/layout.tsx`
- Test: `src/lib/clamp.test.ts`, `src/components/desktop/desktop.test.tsx`

**Interfaces:**
- Consumes: `Content`, `langPath`, `saveLang`
- Produces:
  - `clampPosition(pos: {x:number;y:number}, size: {w:number;h:number}, viewport: {w:number;h:number}): {x:number;y:number}`
  - `<MenuBar content />`, `<Dock content onOpen={(id: DockId) => void} />` com `type DockId = "terminal" | "projects" | "github" | "contact" | "cv"`
  - `<DesktopFolders content onOpen={(projectId: string) => void} />`
  - `<Window title onClose children initial?={{x,y}} />`
  - `Site` passa a manter estado `openProject: string | null` e `terminalOpen: boolean`

- [ ] **Step 1: clamp (teste e implementação)**

`src/lib/clamp.test.ts`:
```ts
import { expect, test } from "vitest";
import { clampPosition } from "./clamp";

const vp = { w: 375, h: 700 }, size = { w: 300, h: 200 };
test("dentro da tela não muda", () => expect(clampPosition({ x: 10, y: 50 }, size, vp)).toEqual({ x: 10, y: 50 }));
test("não sai pela direita nem por baixo", () => expect(clampPosition({ x: 999, y: 999 }, size, vp)).toEqual({ x: 75, y: 500 }));
test("não sai pela esquerda nem por cima da barra de menu", () => expect(clampPosition({ x: -50, y: -50 }, size, vp)).toEqual({ x: 0, y: 32 }));
test("janela maior que a tela gruda no canto", () => expect(clampPosition({ x: 10, y: 10 }, { w: 500, h: 900 }, vp)).toEqual({ x: 0, y: 32 }));
```
`src/lib/clamp.ts`:
```ts
const MENU_H = 32;

export function clampPosition(
  pos: { x: number; y: number },
  size: { w: number; h: number },
  vp: { w: number; h: number },
) {
  const maxX = Math.max(0, vp.w - size.w);
  const maxY = Math.max(MENU_H, vp.h - size.h);
  return { x: Math.min(Math.max(0, pos.x), maxX), y: Math.min(Math.max(MENU_H, pos.y), maxY) };
}
```
Run: `npm test` → PASS.

- [ ] **Step 2: Teste dos componentes (falha)**

`src/components/desktop/desktop.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { pt } from "@/content/pt";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { DesktopFolders } from "./DesktopFolders";
import { Window } from "./Window";

test("menu mostra nome, cargo e chave de idioma", () => {
  render(<MenuBar content={pt} />);
  expect(screen.getByText("D'Artagnan Romann")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/");
});

test("dock chama onOpen com o id", async () => {
  const onOpen = vi.fn();
  render(<Dock content={pt} onOpen={onOpen} />);
  await userEvent.click(screen.getByRole("button", { name: "Terminal" }));
  expect(onOpen).toHaveBeenCalledWith("terminal");
});

test("pasta abre o projeto", async () => {
  const onOpen = vi.fn();
  render(<DesktopFolders content={pt} onOpen={onOpen} />);
  await userEvent.click(screen.getByRole("button", { name: "Ovis" }));
  expect(onOpen).toHaveBeenCalledWith("ovis");
});

test("janela fecha com o botão e com Esc", async () => {
  const onClose = vi.fn();
  render(<Window title="Ovis" onClose={onClose}>x</Window>);
  await userEvent.click(screen.getByRole("button", { name: /fechar|close/i }));
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(2);
});
```

- [ ] **Step 3: Componentes**

`src/components/desktop/MenuBar.tsx`:
```tsx
"use client";
import { useEffect, useState } from "react";
import type { Content } from "@/content/types";
import { langPath, saveLang } from "@/lib/lang";

export function MenuBar({ content }: { content: Content }) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = () => new Date().toLocaleString(content.lang === "pt" ? "pt-BR" : "en-US", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    setNow(fmt());
    const t = setInterval(() => setNow(fmt()), 30_000);
    return () => clearInterval(t);
  }, [content.lang]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-8 items-center gap-3 border-b border-black/5 bg-white/70 px-3 text-xs backdrop-blur dark:bg-neutral-900/70">
      <span className="font-semibold">DR</span>
      <span>{content.menu.name}</span>
      <span className="text-neutral-500">{content.menu.role}</span>
      <nav className="ml-auto flex gap-1" aria-label="Idioma / Language">
        {(["pt", "en"] as const).map((l) => (
          <a key={l} href={langPath(l)} onClick={() => saveLang(l)} aria-current={content.lang === l ? "true" : undefined}
             className={content.lang === l ? "font-semibold" : "text-neutral-500"}>{l.toUpperCase()}</a>
        ))}
      </nav>
      <time className="hidden text-neutral-500 sm:block" suppressHydrationWarning>{now}</time>
    </header>
  );
}
```
`src/components/desktop/Dock.tsx`:
```tsx
"use client";
import type { Content } from "@/content/types";

export type DockId = "terminal" | "projects" | "github" | "contact" | "cv";
const ORDER: DockId[] = ["terminal", "projects", "github", "contact", "cv"];
const ICON: Record<DockId, string> = { terminal: ">_", projects: "▦", github: "⌥", contact: "@", cv: "CV" };

export function Dock({ content, onOpen }: { content: Content; onOpen: (id: DockId) => void }) {
  return (
    <nav aria-label="Dock" className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-fit gap-2 rounded-2xl border border-black/5 bg-white/70 p-2 shadow-lg backdrop-blur dark:bg-neutral-900/70 max-sm:bottom-0 max-sm:w-full max-sm:justify-around max-sm:rounded-none">
      {ORDER.map((id) => (
        <button key={id} type="button" onClick={() => onOpen(id)} aria-label={content.dock[id]} title={content.dock[id]}
                className="grid h-11 w-11 place-items-center rounded-xl bg-neutral-100 font-mono text-sm transition hover:-translate-y-1 dark:bg-neutral-800 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
          {ICON[id]}
        </button>
      ))}
    </nav>
  );
}
```
`src/components/desktop/DesktopFolders.tsx`:
```tsx
"use client";
import type { Content } from "@/content/types";

export function DesktopFolders({ content, onOpen }: { content: Content; onOpen: (id: string) => void }) {
  return (
    <ul className="absolute right-6 top-14 hidden flex-col gap-4 md:flex">
      {content.folders.map((f) => (
        <li key={f.id}>
          <button type="button" onClick={() => onOpen(f.id)} aria-label={f.label} className="flex w-20 flex-col items-center gap-1 text-xs">
            <span aria-hidden className="h-12 w-14 rounded-md bg-sky-200/80" />
            {f.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
```
`src/components/desktop/Window.tsx`:
```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { clampPosition } from "@/lib/clamp";

type Props = { title: string; onClose: () => void; children: ReactNode; initial?: { x: number; y: number } };

export function Window({ title, onClose, children, initial = { x: 80, y: 80 } }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fit = (p: { x: number; y: number }) => {
    const el = ref.current;
    if (!el) return p;
    return clampPosition(p, { w: el.offsetWidth, h: el.offsetHeight }, { w: window.innerWidth, h: window.innerHeight });
  };

  useEffect(() => { setPos((p) => fit(p)); }, []);

  return (
    <motion.div ref={ref} role="dialog" aria-label={title}
      initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-50 w-[min(560px,calc(100vw-16px))] overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:bg-neutral-900">
      <div className="flex cursor-grab items-center gap-2 border-b border-black/5 px-3 py-2 text-xs"
        onPointerDown={(e) => {
          const start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
          const move = (ev: PointerEvent) => setPos(fit({ x: ev.clientX - start.x, y: ev.clientY - start.y }));
          const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        }}>
        <button type="button" onClick={onClose} aria-label="Fechar / Close" className="h-3 w-3 rounded-full bg-red-400" />
        <span className="mx-auto font-medium">{title}</span>
      </div>
      <div className="max-h-[70vh] overflow-auto p-4 text-sm">{children}</div>
    </motion.div>
  );
}
```
Run: `npm test` → PASS.

- [ ] **Step 4: Site monta a casca**

`src/components/Site.tsx`:
```tsx
"use client";
import { useState } from "react";
import type { Content } from "@/content/types";
import { MenuBar } from "./desktop/MenuBar";
import { Dock, type DockId } from "./desktop/Dock";
import { DesktopFolders } from "./desktop/DesktopFolders";
import { Window } from "./desktop/Window";

export function Site({ content }: { content: Content }) {
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const project = content.projects.find((p) => p.id === openProject);

  const onDock = (id: DockId) => {
    if (id === "terminal") setTerminalOpen(true);
    else if (id === "cv") window.location.href = content.cvHref;
    else if (id === "github") window.open(content.contact.github, "_blank", "noopener");
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <MenuBar content={content} />
      <main className="relative min-h-dvh overflow-x-hidden pb-24 pt-8">
        <DesktopFolders content={content} onOpen={setOpenProject} />
        {/* seções entram na Task 6 */}
      </main>
      <Dock content={content} onOpen={onDock} />
      {project && (
        <Window title={project.name} onClose={() => setOpenProject(null)}>
          <p className="mb-2 text-neutral-500">{project.role} · {project.period}</p>
          <p className="mb-3">{project.summary}</p>
          <ul className="list-disc pl-5">{project.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
        </Window>
      )}
      {/* terminal entra na Task 7; terminalOpen já está pronto */}
      {terminalOpen && null}
    </>
  );
}
```
`src/app/layout.tsx`: `<html lang="pt">` fica; fontes via `next/font/google` (`Inter` pro corpo, `Instrument_Serif` pro hero), `body` com `bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased`.

- [ ] **Step 5: Build e commit**

Run: `npm test && npm run build` → PASS.
```bash
git add -A && git commit -m "feat: casca do desktop com menu, dock, pastas e janela"
```

---

### Task 6: Seções da página

**Files:**
- Create: `src/components/sections/Hero.tsx`, `Superpowers.tsx`, `Projects.tsx`, `AboutTxt.tsx`, `Contact.tsx`
- Modify: `src/components/Site.tsx`
- Test: `src/components/sections/sections.test.tsx`

**Interfaces:**
- Consumes: `Content`
- Produces: cada seção `({ content }: { content: Content })`; `Projects` também recebe `onOpen(projectId)`. Ids de âncora: `projects`, `contact` (usados pelo Dock).

- [ ] **Step 1: Testes (falha)**

`src/components/sections/sections.test.tsx`:
```tsx
import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { pt } from "@/content/pt";
import { en } from "@/content/en";
import { Hero } from "./Hero";
import { Superpowers } from "./Superpowers";
import { Projects } from "./Projects";
import { AboutTxt } from "./AboutTxt";
import { Contact } from "./Contact";

test("hero tem um h1 com as duas linhas", () => {
  render(<Hero content={pt} />);
  const h1 = screen.getByRole("heading", { level: 1 });
  expect(h1).toHaveTextContent(pt.hero.line1);
  expect(h1).toHaveTextContent(pt.hero.line2);
});

test("quatro superpoderes com todas as métricas", () => {
  render(<Superpowers content={pt} />);
  expect(screen.getAllByRole("article")).toHaveLength(4);
  for (const s of pt.superpowers) for (const m of s.metrics) expect(screen.getAllByText(m.value).length).toBeGreaterThan(0);
});

test("projetos com âncora e um card por projeto", () => {
  const { container } = render(<Projects content={pt} onOpen={() => {}} />);
  expect(container.querySelector("#projects")).not.toBeNull();
  expect(screen.getAllByRole("button")).toHaveLength(pt.projects.length);
});

test("sobre-mim tem as três fases", () => {
  render(<AboutTxt content={en} />);
  for (const k of ["THEN", "NOW", "NEXT"]) expect(screen.getByText(k)).toBeInTheDocument();
});

test("contato tem os links certos", () => {
  render(<Contact content={pt} />);
  const s = screen.getByRole("region", { name: pt.contact.title });
  expect(within(s).getByRole("link", { name: /linkedin/i })).toHaveAttribute("href", pt.contact.linkedin);
});
```

- [ ] **Step 2: Componentes**

`src/components/sections/Hero.tsx`:
```tsx
import type { Content } from "@/content/types";

export function Hero({ content }: { content: Content }) {
  return (
    <section className="grid min-h-[80dvh] place-items-center px-4 text-center">
      <div>
        <h1 className="font-serif text-5xl leading-tight tracking-tight sm:text-7xl">
          <span className="block">{content.hero.line1}</span>
          <span className="block">{content.hero.line2}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-neutral-500">{content.hero.sub}</p>
      </div>
    </section>
  );
}
```
`src/components/sections/Superpowers.tsx`:
```tsx
import type { Content } from "@/content/types";

export function Superpowers({ content }: { content: Content }) {
  return (
    <section aria-label={content.superpowersTitle} className="mx-auto grid max-w-5xl gap-16 px-4 py-24">
      {content.superpowers.map((s) => (
        <article key={s.id} className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs tracking-widest text-neutral-500">{s.kicker}</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{s.title}</h2>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">{s.body}</p>
          </div>
          <dl className="grid gap-4">
            {s.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-black/5 bg-white p-4 dark:bg-neutral-900">
                <dt className="text-sm text-neutral-500">{m.label}</dt>
                <dd className="mt-1 text-2xl font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </section>
  );
}
```
`src/components/sections/Projects.tsx`:
```tsx
import type { Content } from "@/content/types";

export function Projects({ content, onOpen }: { content: Content; onOpen: (id: string) => void }) {
  return (
    <section id="projects" aria-label={content.projectsTitle} className="mx-auto max-w-5xl px-4 py-24">
      <h2 className="font-serif text-3xl">{content.projectsTitle}</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.projects.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onOpen(p.id)} className="h-full w-full rounded-xl border border-black/5 bg-white p-4 text-left transition hover:shadow-md dark:bg-neutral-900">
              <span className="block font-semibold">{p.name}</span>
              <span className="block text-xs text-neutral-500">{p.role} · {p.period}</span>
              <span className="mt-2 block text-sm">{p.summary}</span>
              <span className="mt-3 block font-mono text-xs text-neutral-500">{p.stack.join(" · ")}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```
`src/components/sections/AboutTxt.tsx`:
```tsx
import type { Content } from "@/content/types";

export function AboutTxt({ content }: { content: Content }) {
  const a = content.about;
  return (
    <section aria-label={a.file} className="mx-auto max-w-3xl px-4 py-24">
      <div className="rounded-xl border border-black/10 bg-white font-mono text-sm dark:bg-neutral-900">
        <p className="border-b border-black/5 px-4 py-2 text-xs text-neutral-500">{a.file}</p>
        <dl className="grid gap-6 p-6">
          {(["then", "now", "next"] as const).map((k) => (
            <div key={k}><dt className="text-xs text-neutral-500">{a.labels[k]}</dt><dd className="mt-1">{a[k]}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```
`src/components/sections/Contact.tsx`:
```tsx
import type { Content } from "@/content/types";

export function Contact({ content }: { content: Content }) {
  const c = content.contact;
  const links = [
    ["Email", c.email], ["LinkedIn", c.linkedin], ["GitHub", c.github], ["WhatsApp", c.whatsapp],
  ] as const;
  return (
    <section id="contact" aria-label={c.title} className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h2 className="font-serif text-4xl">{c.title}</h2>
      <ul className="mt-8 flex flex-wrap justify-center gap-3">
        {links.map(([label, href]) => (
          <li key={label}><a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">{label} →</a></li>
        ))}
      </ul>
    </section>
  );
}
```
Em `Site.tsx`, trocar o comentário `{/* seções entram na Task 6 */}` por:
```tsx
<Hero content={content} />
<Superpowers content={content} />
<Projects content={content} onOpen={setOpenProject} />
<AboutTxt content={content} />
<Contact content={content} />
```
com os imports correspondentes.

Run: `npm test` → PASS.

- [ ] **Step 3: Conferir a página**

Run: `npm run dev`, abrir `http://localhost:3000` e `/en`, olhar em 1440px e 375px. Nada de rolagem horizontal.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: seções hero, superpoderes, projetos, sobre e contato"
```

---

### Task 7: Terminal na tela

**Files:**
- Create: `src/components/terminal/TerminalWindow.tsx`, `src/components/terminal/TerminalView.tsx`, `src/components/terminal/useTerminalHotkey.ts`, `src/app/terminal/page.tsx`, `src/app/en/terminal/page.tsx`
- Modify: `src/components/Site.tsx`
- Test: `src/components/terminal/terminal.test.tsx`

**Interfaces:**
- Consumes: `runCommand`, `complete`, `historyStep`, `Content`, `langPath`, `saveLang`, `Window`
- Produces: `<TerminalView content onOpenProject />` (só a área do terminal, usada na janela e na página cheia); `<TerminalWindow content onClose onOpenProject />`; `useTerminalHotkey(toggle: () => void)`

- [ ] **Step 1: Testes (falha)**

`src/components/terminal/terminal.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { pt } from "@/content/pt";
import { TerminalView } from "./TerminalView";
import { useTerminalHotkey } from "./useTerminalHotkey";

test("roda comando e mostra saída", async () => {
  render(<TerminalView content={pt} onOpenProject={() => {}} />);
  const input = screen.getByRole("textbox", { name: /terminal/i });
  await userEvent.type(input, "whoami{Enter}");
  expect(screen.getByText(pt.terminal.whoami[0])).toBeInTheDocument();
});

test("Tab completa e ↑ recupera o anterior", async () => {
  render(<TerminalView content={pt} onOpenProject={() => {}} />);
  const input = screen.getByRole("textbox", { name: /terminal/i }) as HTMLInputElement;
  await userEvent.type(input, "who{Tab}");
  expect(input.value).toBe("whoami");
  await userEvent.type(input, "{Enter}{ArrowUp}");
  expect(input.value).toBe("whoami");
});

test("clear limpa a saída", async () => {
  render(<TerminalView content={pt} onOpenProject={() => {}} />);
  const input = screen.getByRole("textbox", { name: /terminal/i });
  await userEvent.type(input, "whoami{Enter}clear{Enter}");
  expect(screen.queryByText(pt.terminal.whoami[0])).not.toBeInTheDocument();
});

test("projetos ovis abre o projeto", async () => {
  const onOpen = vi.fn();
  render(<TerminalView content={pt} onOpenProject={onOpen} />);
  await userEvent.type(screen.getByRole("textbox", { name: /terminal/i }), "projetos ovis{Enter}");
  expect(onOpen).toHaveBeenCalledWith("ovis");
});

function Hotkey({ toggle }: { toggle: () => void }) {
  useTerminalHotkey(toggle);
  return <input aria-label="campo" />;
}

test("` abre o terminal fora de campos de texto, mas não dentro deles", async () => {
  const toggle = vi.fn();
  render(<Hotkey toggle={toggle} />);
  await userEvent.keyboard("`");
  expect(toggle).toHaveBeenCalledTimes(1);
  await userEvent.type(screen.getByRole("textbox", { name: "campo" }), "`");
  expect(toggle).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Hotkey**

`src/components/terminal/useTerminalHotkey.ts`:
```ts
"use client";
import { useEffect } from "react";

export function useTerminalHotkey(toggle: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "`") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);
}
```

- [ ] **Step 3: TerminalView**

`src/components/terminal/TerminalView.tsx`:
```tsx
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
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { input.current?.focus(); }, []);
  useEffect(() => { end.current?.scrollIntoView?.({ block: "end" }); }, [lines]);

  const submit = () => {
    const r = runCommand(value, content);
    const nextHistory = value.trim() ? [...history, value] : history;
    setHistory(nextHistory);
    setHIndex(nextHistory.length);
    setValue("");
    if (r.action?.type === "clear") { setLines([]); return; }
    setLines((l) => [...l, { kind: "in", text: value }, ...r.lines.map((text) => ({ kind: "out" as const, text }))]);
    if (r.action?.type === "lang") { saveLang(r.action.lang); window.location.href = langPath(r.action.lang); }
    if (r.action?.type === "download") window.location.href = r.action.href;
    if (r.action?.type === "open") onOpenProject(r.action.projectId);
  };

  return (
    <div className="flex h-full flex-col bg-neutral-950 p-3 font-mono text-[13px] text-neutral-100" onClick={() => input.current?.focus()}>
      <div className="flex-1 overflow-auto" aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i} className="whitespace-pre-wrap break-words">{l.kind === "in" ? `$ ${l.text}` : l.text}</pre>
        ))}
        <div ref={end} />
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
```

- [ ] **Step 4: Janela, página cheia e ligação no Site**

`src/components/terminal/TerminalWindow.tsx`:
```tsx
"use client";
import type { Content } from "@/content/types";
import { Window } from "@/components/desktop/Window";
import { TerminalView } from "./TerminalView";

export function TerminalWindow({ content, onClose, onOpenProject }: { content: Content; onClose: () => void; onOpenProject: (id: string) => void }) {
  return (
    <Window title="darta@portfolio" onClose={onClose} initial={{ x: 120, y: 120 }}>
      <div className="-m-4 h-[360px]"><TerminalView content={content} onOpenProject={onOpenProject} /></div>
    </Window>
  );
}
```
`src/app/terminal/page.tsx`:
```tsx
"use client";
import { pt } from "@/content/pt";
import { TerminalView } from "@/components/terminal/TerminalView";
import { langPath } from "@/lib/lang";

export default function Page() {
  return <main className="h-dvh"><TerminalView content={pt} onOpenProject={() => { window.location.href = `${langPath("pt")}#projects`; }} /></main>;
}
```
`src/app/en/terminal/page.tsx`: igual, com `en` e `langPath("en")`.

Em `Site.tsx`:
- importar `TerminalWindow` e `useTerminalHotkey`;
- `const toggle = useCallback(() => setTerminalOpen((o) => !o), []); useTerminalHotkey(toggle);`
- em `onDock`, quando `id === "terminal"`: em telas < 640px (`window.matchMedia("(max-width: 639px)").matches`) ir pra `langPath(content.lang, "terminal")`; senão `setTerminalOpen(true)`;
- trocar `{terminalOpen && null}` por `{terminalOpen && <TerminalWindow content={content} onClose={() => setTerminalOpen(false)} onOpenProject={(id) => { setTerminalOpen(false); setOpenProject(id); }} />}`.

Run: `npm test && npm run build` → PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: terminal em janela, atalho e página cheia no celular"
```

---

### Task 8: Widget de contribuições do GitHub

**Files:**
- Create: `src/components/widgets/Contributions.tsx`
- Modify: `src/components/Site.tsx` (widget na mesa, abaixo das pastas, só em `md+`)
- Test: `src/components/widgets/contributions.test.tsx`

**Interfaces:**
- Produces: `<Contributions user="Romanndemello" />`; `fetchContributions(user: string, signal?: AbortSignal): Promise<{ date: string; count: number; level: 0|1|2|3|4 }[] | null>`
- Fonte: `https://github-contributions-api.jogruber.de/v4/<user>?y=last` (pública, sem token). Formato: `{ contributions: [{ date, count, level }] }`.

- [ ] **Step 1: Testes (falha)**

`src/components/widgets/contributions.test.tsx`:
```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { Contributions, fetchContributions } from "./Contributions";

afterEach(() => vi.restoreAllMocks());

test("devolve null quando a API falha", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("x", { status: 500 }));
  expect(await fetchContributions("u")).toBeNull();
});

test("devolve null quando a rede cai", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
  expect(await fetchContributions("u")).toBeNull();
});

test("devolve null quando o formato é inesperado", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ foo: 1 }));
  expect(await fetchContributions("u")).toBeNull();
});

test("renderiza a grade quando dá certo", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ contributions: [{ date: "2026-10-01", count: 3, level: 2 }] }));
  render(<Contributions user="u" />);
  await waitFor(() => expect(screen.getByRole("img", { name: /github/i })).toBeInTheDocument());
});

test("falha não renderiza nada", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("x", { status: 500 }));
  const { container } = render(<Contributions user="u" />);
  await waitFor(() => expect(container).toBeEmptyDOMElement());
});
```

- [ ] **Step 2: Implementação**

`src/components/widgets/Contributions.tsx`:
```tsx
"use client";
import { useEffect, useState } from "react";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
const SHADES = ["bg-neutral-200 dark:bg-neutral-800", "bg-emerald-200", "bg-emerald-400", "bg-emerald-600", "bg-emerald-800"];

export async function fetchContributions(user: string, signal?: AbortSignal): Promise<Day[] | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`, { signal });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const list = (data as { contributions?: unknown }).contributions;
    if (!Array.isArray(list)) return null;
    return list as Day[];
  } catch {
    return null;
  }
}

export function Contributions({ user }: { user: string }) {
  const [days, setDays] = useState<Day[] | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    fetchContributions(user, ctrl.signal).then(setDays).finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); ctrl.abort(); };
  }, [user]);

  if (!days || days.length === 0) return null;
  const total = days.reduce((s, d) => s + d.count, 0);
  return (
    <figure role="img" aria-label={`GitHub: ${total} contribuições no último ano`} className="rounded-xl border border-black/5 bg-white/80 p-3 backdrop-blur dark:bg-neutral-900/80">
      <div className="grid grid-flow-col grid-rows-7 gap-[2px]">
        {days.slice(-182).map((d) => <span key={d.date} className={`h-2 w-2 rounded-[2px] ${SHADES[d.level] ?? SHADES[0]}`} />)}
      </div>
      <figcaption className="mt-2 text-[11px] text-neutral-500">{total} · GitHub</figcaption>
    </figure>
  );
}
```
O widget fica posicionado em `absolute` (fora do fluxo), então sumir não desloca o layout.

Run: `npm test` → PASS.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: widget de contribuições do GitHub com falha silenciosa"
```

---

### Task 9: CV em PDF

**Files:**
- Create: `src/components/Cv.tsx`, `src/app/cv/page.tsx`, `src/app/en/cv/page.tsx`, `scripts/build-cv.mjs`
- Modify: `package.json` (script `cv`)
- Test: `src/components/cv.test.tsx`

**Interfaces:**
- Consumes: `Content.jobs`, `Content.stack`, `Content.contact`, `Content.hero`
- Produces: `public/cv-pt.pdf`, `public/cv-en.pdf` (versionados, gerados por `npm run cv`)

- [ ] **Step 1: Teste (falha)**

`src/components/cv.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { pt } from "@/content/pt";
import { Cv } from "./Cv";

test("CV lista todas as experiências em ordem e o contato", () => {
  render(<Cv content={pt} />);
  const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
  expect(headings).toEqual(pt.jobs.map((j) => `${j.role} · ${j.company}`));
  expect(screen.getByText(/dartagnanromann@gmail.com/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Componente e páginas**

`src/components/Cv.tsx`:
```tsx
import type { Content } from "@/content/types";

export function Cv({ content }: { content: Content }) {
  const email = content.contact.email.replace("mailto:", "");
  return (
    <article className="mx-auto max-w-[800px] bg-white p-10 text-[12px] leading-relaxed text-neutral-900 print:p-0">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">D'Artagnan Romann de Mello</h1>
        <p>{content.menu.role} · São Leopoldo, RS</p>
        <p>{email} · linkedin.com/in/dartagnanromann · github.com/Romanndemello</p>
      </header>
      <p className="mb-6">{content.about.now}</p>
      <section className="mb-6">
        {content.jobs.map((j) => (
          <div key={j.company + j.period} className="mb-3">
            <h3 className="font-semibold">{j.role} · {j.company}</h3>
            <p className="text-neutral-500">{j.period} · {j.place}</p>
            <ul className="list-disc pl-5">{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        ))}
      </section>
      <section>
        {content.stack.map((g) => <p key={g.group}><b>{g.group}:</b> {g.items.join(", ")}</p>)}
      </section>
    </article>
  );
}
```
`src/app/cv/page.tsx`:
```tsx
import { Cv } from "@/components/Cv";
import { pt } from "@/content/pt";
export const metadata = { title: "CV · D'Artagnan Romann", robots: { index: false } };
export default function Page() { return <Cv content={pt} />; }
```
`src/app/en/cv/page.tsx`: igual com `en` e título `"Resume · D'Artagnan Romann"`.

Run: `npm test` → PASS.

- [ ] **Step 3: Gerar os PDFs**

```bash
npm i -D playwright serve
npx playwright install chromium
```
`scripts/build-cv.mjs`:
```js
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const server = spawn("npx", ["serve", "out", "-l", "4173"], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 2000));
const browser = await chromium.launch();
try {
  for (const [lang, path] of [["pt", "/cv/"], ["en", "/en/cv/"]]) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:4173${path}`, { waitUntil: "networkidle" });
    await page.pdf({ path: `public/cv-${lang}.pdf`, format: "A4", margin: { top: "16mm", bottom: "16mm", left: "16mm", right: "16mm" }, printBackground: true });
  }
} finally {
  await browser.close();
  server.kill();
}
```
`package.json` → `"cv": "next build && node scripts/build-cv.mjs && next build"` (o segundo build leva os PDFs pro `out/`).

Run: `npm run cv` → `public/cv-pt.pdf` e `public/cv-en.pdf` existem. Abrir os dois e conferir: uma ou duas páginas, nada cortado.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: CV em PDF gerado do conteúdo, PT e EN"
```

---

### Task 10: Testes de ponta a ponta, Lighthouse e deploy

**Files:**
- Create: `playwright.config.ts`, `e2e/site.spec.ts`
- Modify: `package.json` (script `e2e`), `README.md`

- [ ] **Step 1: Configuração**

`playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  webServer: { command: "npx serve out -l 4173", port: 4173, reuseExistingServer: true },
  use: { baseURL: "http://localhost:4173" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
  ],
});
```
`npm i -D @playwright/test`; `package.json` → `"e2e": "next build && playwright test"`.

- [ ] **Step 2: Testes**

`e2e/site.spec.ts`:
```ts
import { expect, test } from "@playwright/test";

test.use({ locale: "pt-BR" });

test("PT carrega com hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Eu sou o Darta.");
});

test("EN carrega com hero", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Darta");
});

test("sem rolagem horizontal", async ({ page }) => {
  for (const path of ["/", "/en/", "/terminal/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("terminal responde help", async ({ page, isMobile }) => {
  await page.goto(isMobile ? "/terminal/" : "/");
  if (!isMobile) await page.getByRole("button", { name: "Terminal" }).click();
  const input = page.getByRole("textbox", { name: "Terminal" });
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText("whoami", { exact: false }).first()).toBeVisible();
});

test("troca de idioma pelo menu e fica salva", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
});

test.describe("navegador em inglês", () => {
  test.use({ locale: "en-US" });
  test("primeira visita vai pra /en/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test("CV em PDF existe", async ({ request }) => {
  for (const f of ["/cv-pt.pdf", "/cv-en.pdf"]) {
    const r = await request.get(f);
    expect(r.status(), f).toBe(200);
  }
});
```
Run: `npm run e2e` → PASS nos dois projetos (desktop e mobile).

- [ ] **Step 3: Lighthouse**

```bash
npx serve out -l 4173 &
npx lighthouse http://localhost:4173/ --preset=perf --form-factor=mobile --only-categories=performance,accessibility --quiet --chrome-flags="--headless" --output=json --output-path=./lighthouse.json
node -e "const r=require('./lighthouse.json').categories;console.log(r.performance.score*100,r.accessibility.score*100)"
kill %1
```
Expected: os dois números ≥ 90. Abaixo disso: corrigir (fonte, imagem, contraste) antes de seguir. `lighthouse.json` vai pro `.gitignore`.

- [ ] **Step 4: Repositório e Vercel (com ok do Darta antes de cada passo externo)**

Perguntar ao Darta antes de criar o repo público e antes de ligar a Vercel.
```bash
gh repo create Romanndemello/portfolio --public --source=. --push
npx vercel link --yes && npx vercel --prod
```
Conferir a URL `*.vercel.app` em `/`, `/en/`, `/terminal/`, `/cv-pt.pdf`.

- [ ] **Step 5: README e commit**

`README.md`: o que é, `npm run dev`, `npm test`, `npm run e2e`, `npm run cv`, onde editar texto (`src/content/`), regra de que número novo precisa de fonte em `docs/dados/`.
```bash
git add -A && git commit -m "test: e2e, lighthouse e deploy na Vercel" && git push
```
