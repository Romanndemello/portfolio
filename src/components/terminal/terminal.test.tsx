import { fireEvent, render, screen } from "@testing-library/react";
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

test("saída nova não rola a página, só o terminal", async () => {
  const spy = vi.fn();
  Element.prototype.scrollIntoView = spy;
  render(<TerminalView content={pt} onOpenProject={() => {}} />);
  await userEvent.type(screen.getByRole("textbox", { name: /terminal/i }), "superpoderes{Enter}");
  expect(spy).not.toHaveBeenCalled();
});

test("atalho funciona no teclado ABNT2, onde ` é tecla morta", async () => {
  const toggle = vi.fn();
  render(<Hotkey toggle={toggle} />);
  fireEvent.keyDown(window, { key: "Dead", code: "Backquote" });
  expect(toggle).toHaveBeenCalledTimes(1);
});

test("atalho com Ctrl ou Cmd não abre o terminal", async () => {
  const toggle = vi.fn();
  render(<Hotkey toggle={toggle} />);
  fireEvent.keyDown(window, { key: "`", code: "Backquote", ctrlKey: true });
  fireEvent.keyDown(window, { key: "`", code: "Backquote", metaKey: true });
  expect(toggle).not.toHaveBeenCalled();
});
