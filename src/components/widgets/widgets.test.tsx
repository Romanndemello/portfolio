import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { pt } from "@/content/pt";
import { timeParts } from "./Clock";
import { monthGrid } from "./CalendarWidget";
import { fetchWeather, iconFor, Weather } from "./Weather";
import { AppGrid } from "./AppGrid";
import { Photo } from "./Photo";

afterEach(() => vi.restoreAllMocks());

test("relógio mostra a hora de São Leopoldo, não a da máquina", () => {
  expect(timeParts(new Date("2026-10-14T13:05:09Z"))).toEqual({ h: 10, m: 5, s: 9 });
});

test("calendário começa no dia da semana certo", () => {
  const g = monthGrid(2026, 9); // outubro de 2026 começa numa quinta
  expect(g.slice(0, 4)).toEqual([null, null, null, null]);
  expect(g[4]).toBe(1);
  expect(g.filter(Boolean)).toHaveLength(31);
});

test("clima: código vira sol, nuvem ou chuva", () => {
  expect(iconFor(0)).toBe("sun");
  expect(iconFor(3)).toBe("cloud");
  expect(iconFor(61)).toBe("rain");
});

test("clima some quando a API falha ou muda de formato", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ daily: { time: ["2026-10-14"] } }));
  expect(await fetchWeather()).toBeNull();
  const { container } = render(<Weather city="São Leopoldo" lang="pt" />);
  await waitFor(() => expect(container).toBeEmptyDOMElement());
});

test("clima mostra os dias quando dá certo", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ daily: { time: ["2026-10-14", "2026-10-15"], weather_code: [0, 61], temperature_2m_max: [24.4, 19.6] } }));
  render(<Weather city="São Leopoldo" lang="pt" />);
  await waitFor(() => expect(screen.getByText("24°")).toBeInTheDocument());
  expect(screen.getByText("20°")).toBeInTheDocument();
});

test("grade de apps leva aos contatos e abre o terminal", () => {
  const onTerminal = vi.fn();
  render(<AppGrid content={pt} onTerminal={onTerminal} />);
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", pt.contact.linkedin);
  expect(screen.getByRole("link", { name: pt.footer.cv })).toHaveAttribute("href", pt.cvHref);
  screen.getByRole("button", { name: pt.dock.terminal }).click();
  expect(onTerminal).toHaveBeenCalled();
});

test("foto mostra o Darta com legenda e texto alternativo", () => {
  render(<Photo src="/darta.jpg" alt="Foto do Darta" caption="Full stack pleno" />);
  expect(screen.getByRole("img", { name: "Foto do Darta" })).toHaveAttribute("src", "/darta.jpg");
  expect(screen.getByText("Full stack pleno")).toBeInTheDocument();
});
