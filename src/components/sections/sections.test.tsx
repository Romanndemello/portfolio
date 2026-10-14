import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { pt } from "@/content/pt";
import { en } from "@/content/en";
import { Hero } from "./Hero";
import { Superpowers } from "./Superpowers";
import { Projects } from "./Projects";
import { AboutTxt } from "./AboutTxt";
import { Contact } from "./Contact";
import { Experience } from "./Experience";

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
  for (const a of within(s).getAllByRole("link", { name: /linkedin/i })) expect(a).toHaveAttribute("href", pt.contact.linkedin);
  expect(within(s).getByRole("link", { name: pt.footer.meeting })).toHaveAttribute("href", pt.contact.meeting);
});

test("stack e disponibilidade aparecem na página, não só no terminal", () => {
  render(<AboutTxt content={pt} />);
  for (const g of pt.stack) expect(screen.getByText(g.group)).toBeInTheDocument();
  expect(screen.getByText(pt.about.availability)).toBeInTheDocument();
});

import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Highlights } from "./Highlights";
import { StackMarquee } from "./StackMarquee";
import { TerminalPromo } from "./TerminalPromo";

test("em números mostra cada destaque", () => {
  render(<Highlights content={pt} />);
  for (const h of pt.highlights) expect(screen.getByText(h.value)).toBeInTheDocument();
});

test("faixa da stack repete os cards só pro olho, não pro leitor de tela", () => {
  const { container } = render(<StackMarquee content={pt} />);
  expect(container.querySelectorAll("li")).toHaveLength(pt.stack.length * 2);
  expect(container.querySelectorAll("li[aria-hidden='true']")).toHaveLength(pt.stack.length);
});

test("superpoder tem aba e botão que abre o case", async () => {
  const onOpen = vi.fn();
  render(<Superpowers content={pt} onOpen={onOpen} />);
  for (const s of pt.superpowers) expect(screen.getByText(s.tab)).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /ovis/i }));
  expect(onOpen).toHaveBeenCalledWith("ovis");
});

test("bloco do terminal abre o terminal", async () => {
  const onOpen = vi.fn();
  render(<TerminalPromo content={en} onOpen={onOpen} />);
  await userEvent.click(screen.getByRole("button"));
  expect(onOpen).toHaveBeenCalled();
});

test("o DEPOIS do sobre-mim abre e fecha", async () => {
  render(<AboutTxt content={pt} />);
  const btn = screen.getByRole("button", { name: pt.about.labels.next });
  expect(btn).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(btn);
  expect(btn).toHaveAttribute("aria-expanded", "true");
});

test("experiência lista cada empresa com cargo, período e conquistas", () => {
  const { container } = render(<Experience content={pt} />);
  expect(container.querySelector("#experience")).not.toBeNull();
  const items = screen.getAllByRole("article");
  expect(items).toHaveLength(pt.jobs.length);
  pt.jobs.forEach((j, i) => {
    expect(within(items[i]).getByRole("heading", { name: j.company })).toBeInTheDocument();
    expect(within(items[i]).getByText(j.period, { exact: false })).toBeInTheDocument();
    for (const b of j.bullets) expect(within(items[i]).getByText(b)).toBeInTheDocument();
  });
});

test("sobre-mim mostra a formação", () => {
  render(<AboutTxt content={pt} />);
  expect(screen.getByText(pt.education.course, { exact: false })).toBeInTheDocument();
});
