import { expect, test } from "vitest";
import { historyStep } from "./history";

const h = ["help", "whoami", "stack"];

test("↑ a partir do fim pega o último", () => expect(historyStep(h, h.length, "up")).toEqual({ index: 2, value: "stack" }));
test("↑ no topo fica no topo", () => expect(historyStep(h, 0, "up")).toEqual({ index: 0, value: "help" }));
test("↓ passando do fim volta pro campo vazio", () => expect(historyStep(h, 2, "down")).toEqual({ index: 3, value: "" }));
test("histórico vazio", () => expect(historyStep([], 0, "up")).toEqual({ index: 0, value: "" }));
