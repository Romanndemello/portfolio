import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { pt } from "./pt";
import { en } from "./en";

// Lista fora do git: o repositório é público e não pode citar os nomes que este teste barra.
const CONFIDENCIAL = "docs/dados/.confidencial.txt";
const nomesConfidenciais = existsSync(CONFIDENCIAL)
  ? readFileSync(CONFIDENCIAL, "utf8").split("\n").map((l) => l.trim().toLowerCase()).filter(Boolean)
  : [];

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
    expect(shape({ ...en, lang: "x" })).toEqual(shape({ ...pt, lang: "x" }));
  });

  test.each([["pt", pt], ["en", en]])("%s: nenhum texto vazio", (_, c) => {
    for (const s of strings(c)) expect(s.trim().length).toBeGreaterThan(0);
  });

  test.each([["pt", pt], ["en", en]])("%s: sem travessão", (_, c) => {
    for (const s of strings(c)) expect(s).not.toMatch(/[—–]/);
  });

  test.skipIf(nomesConfidenciais.length === 0).each([["pt", pt], ["en", en]])("%s: nenhum cliente da Carmillion pelo nome", (_, c) => {
    const text = strings(c).join(" ").toLowerCase();
    for (const nome of nomesConfidenciais) expect(text).not.toContain(nome);
  });

  test.each([["pt", pt], ["en", en]])("%s: toda métrica tem fonte em docs/dados", (_, c) => {
    for (const sp of c.superpowers) for (const m of sp.metrics) expect(m.source).toMatch(/^docs\/dados\/.+\.md$/);
  });

  test.each([["pt", pt], ["en", en]])("%s: nenhuma métrica com valor provisório", (_, c) => {
    for (const sp of c.superpowers) for (const m of sp.metrics) expect(m.value).not.toBe("N");
  });

  test.each([["pt", pt], ["en", en]])("%s: o destaque fala de solução, não de cargo nem de sociedade", (_, c) => {
    const vitrine = strings([c.meta, c.menu, c.hero, c.superpowers, c.highlights, c.footer, c.widgets]).join(" ");
    expect(vitrine).not.toMatch(/tech lead|sócio|partner/i);
    expect(vitrine).toMatch(/500/);
    expect(vitrine).toMatch(/SEO/);
  });

  test.each([["pt", pt], ["en", en]])("%s: se apresenta como full stack pleno, com foco em sistemas e automação", (_, c) => {
    const vitrine = strings([c.meta, c.menu, c.hero, c.widgets]).join(" ");
    expect(vitrine).toMatch(/pleno|mid-level/i);
    expect(vitrine).toMatch(/sistemas|systems/i);
    expect(vitrine).toMatch(/automa/i);
  });

  test.each([["pt", pt], ["en", en]])("%s: cada empresa tem pelo menos duas conquistas", (_, c) => {
    for (const j of c.jobs) expect(j.bullets.length, j.company).toBeGreaterThanOrEqual(2);
  });
});
