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

import { shouldRedirectToEn } from "./lang";

test("navegador em inglês sem escolha salva vai pra /en/", () => {
  expect(shouldRedirectToEn("", null, ["en-US"])).toBe(true);
});
test("escolha explícita de PT na URL segura em PT mesmo sem storage", () => {
  expect(shouldRedirectToEn("?lang=pt", null, ["en-US"])).toBe(false);
});
test("escolha salva pt segura em PT", () => {
  expect(shouldRedirectToEn("", "pt", ["en-US"])).toBe(false);
});
test("escolha salva en redireciona mesmo com navegador em pt", () => {
  expect(shouldRedirectToEn("", "en", ["pt-BR"])).toBe(true);
});
test("langPath de PT carrega a marca de escolha explícita quando pedido", () => {
  expect(langPath("pt", "", { explicit: true })).toBe("/?lang=pt");
  expect(langPath("en", "", { explicit: true })).toBe("/en/");
});
