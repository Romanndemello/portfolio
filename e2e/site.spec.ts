import { expect, test } from "@playwright/test";

test.use({ locale: "pt-BR" });

test("PT carrega com hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Eu sou o Darta.");
});

test("EN carrega com hero", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Darta");
});

test("sem rolagem horizontal", async ({ page }) => {
  for (const path of ["/", "/en/", "/terminal/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("terminal responde help", async ({ page, isMobile }) => {
  await page.goto(isMobile ? "/terminal/" : "/");
  if (!isMobile) await page.getByRole("navigation", { name: "Dock" }).getByRole("button", { name: "Terminal" }).click();
  const input = page.getByRole("textbox", { name: "Terminal" });
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText("whoami", { exact: false }).first()).toBeVisible();
});

test("troca de idioma pelo menu e fica salva", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
});

test.describe("navegador em inglês", () => {
  test.use({ locale: "en-US" });
  test("primeira visita vai pra /en/", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/$/);
  });
});

test("CV em PDF existe", async ({ request }) => {
  for (const f of ["/cv-pt.pdf", "/cv-en.pdf"]) {
    const r = await request.get(f);
    expect(r.status(), f).toBe(200);
  }
});

test("html lang bate com o idioma da página", async ({ page }) => {
  for (const [path, lang] of [["/?lang=pt", "pt"], ["/en/", "en"], ["/en/terminal/", "en"], ["/terminal/", "pt"]] as const) {
    await page.goto(path);
    await expect(page.locator("html"), path).toHaveAttribute("lang", lang);
  }
});

test.describe("sem storage e navegador em inglês", () => {
  test.use({ locale: "en-US" });
  test("clicar em PT fica em PT", async ({ page, context }) => {
    await context.addInitScript(() => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    });
    await page.goto("/en/");
    await page.getByRole("link", { name: "PT", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/\/en\//);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Eu sou o Darta.");
  });
});
