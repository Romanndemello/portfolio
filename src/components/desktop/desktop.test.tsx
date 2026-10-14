import React from "react";
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
  render(<Window title="Ovis" closeLabel="Fechar" onClose={onClose}>x</Window>);
  await userEvent.click(screen.getByRole("button", { name: /fechar|close/i }));
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(2);
});

test("janela recebe o foco ao abrir e devolve ao fechar", async () => {
  function Harness() {
    const [open, setOpen] = React.useState(false);
    return (<><button onClick={() => setOpen(true)}>abrir</button>
      {open && <Window title="Ovis" closeLabel="Fechar" onClose={() => setOpen(false)}>x</Window>}</>);
  }
  render(<Harness />);
  const opener = screen.getByRole("button", { name: "abrir" });
  await userEvent.click(opener);
  expect(screen.getByRole("dialog", { name: "Ovis" })).toContainElement(document.activeElement as HTMLElement);
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(opener);
});

test("Esc fecha só a janela que está com o foco", async () => {
  const closeA = vi.fn();
  const closeB = vi.fn();
  render(<>
    <Window title="A" closeLabel="Fechar" onClose={closeA}>a</Window>
    <Window title="B" closeLabel="Fechar" onClose={closeB}>b</Window>
  </>);
  screen.getByRole("dialog", { name: "B" }).focus();
  await userEvent.keyboard("{Escape}");
  expect(closeB).toHaveBeenCalledTimes(1);
  expect(closeA).not.toHaveBeenCalled();
});

test("botão de fechar usa o rótulo do idioma e tem área de toque de 24px", () => {
  render(<Window title="Ovis" closeLabel="Close" onClose={() => {}}>x</Window>);
  const btn = screen.getByRole("button", { name: "Close" });
  expect(btn.className).toMatch(/min-h-6/);
  expect(btn.className).toMatch(/min-w-6/);
});

test("dock tem os atalhos da página e o terminal", () => {
  render(<Dock content={pt} onOpen={() => {}} />);
  for (const id of ["home", "superpowers", "highlights", "about", "meeting", "contact", "terminal"] as const)
    expect(screen.getByRole("button", { name: pt.dock[id] })).toBeInTheDocument();
});

test("pastas em grade no celular também abrem o projeto", async () => {
  const onOpen = vi.fn();
  render(<DesktopFolders content={pt} onOpen={onOpen} layout="grid" />);
  await userEvent.click(screen.getByRole("button", { name: "Favo OS" }));
  expect(onOpen).toHaveBeenCalledWith("favo-os");
});

test("cada pasta usa degradê com id próprio", () => {
  const { container } = render(<DesktopFolders content={pt} onOpen={() => {}} layout="grid" />);
  const ids = [...container.querySelectorAll("linearGradient")].map((g) => g.id);
  expect(new Set(ids).size).toBe(ids.length);
});
