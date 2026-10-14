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

import { CONTRIBUTION_SHADES } from "./Contributions";

test("intensidade é uma cor só ficando mais forte, como no GitHub", () => {
  const alphas = CONTRIBUTION_SHADES.slice(1).map((c) => Number(c.match(/\/ ([\d.]+)\)$/)?.[1]));
  expect(CONTRIBUTION_SHADES.slice(1).every((c) => c.startsWith("rgb(46 124 246"))).toBe(true);
  for (let i = 1; i < alphas.length; i++) expect(alphas[i]).toBeGreaterThan(alphas[i - 1]);
});

test("legenda menos/mais mostra a escala", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ contributions: [{ date: "2026-10-01", count: 1, level: 1 }] }));
  render(<Contributions user="u" labels={{ less: "menos", more: "mais", total: "{n} contribuições no último ano" }} />);
  await waitFor(() => expect(screen.getByText("menos")).toBeInTheDocument());
  expect(screen.getByText("mais")).toBeInTheDocument();
  expect(screen.getByText("1 contribuições no último ano")).toBeInTheDocument();
});

test("quadradinhos pintados com o azul do site", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ contributions: [{ date: "2026-10-01", count: 9, level: 4 }] }));
  const { container } = render(<Contributions user="u" />);
  await waitFor(() => expect(container.querySelector("[data-level='4']")).not.toBeNull());
  expect((container.querySelector("[data-level='4']") as HTMLElement).style.backgroundColor).toBe("rgb(46, 124, 246)");
});

test("ignora dias com formato estranho", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ contributions: [{ date: "2026-10-01", count: 2, level: 1 }, { foo: 1 }, null] }));
  expect(await fetchContributions("u")).toHaveLength(1);
});
