import { expect, test } from "vitest";
import { clampPosition } from "./clamp";

const vp = { w: 375, h: 700 }, size = { w: 300, h: 200 };
test("dentro da tela não muda", () => expect(clampPosition({ x: 10, y: 50 }, size, vp)).toEqual({ x: 10, y: 50 }));
test("não sai pela direita nem por baixo", () => expect(clampPosition({ x: 999, y: 999 }, size, vp)).toEqual({ x: 75, y: 500 }));
test("não sai pela esquerda nem por cima da barra de menu", () => expect(clampPosition({ x: -50, y: -50 }, size, vp)).toEqual({ x: 0, y: 32 }));
test("janela maior que a tela gruda no canto", () => expect(clampPosition({ x: 10, y: 10 }, { w: 500, h: 900 }, vp)).toEqual({ x: 0, y: 32 }));
