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
