import { chromium } from "playwright";
import { spawn } from "node:child_process";

const server = spawn("npx", ["serve", "out", "-l", "4174"], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 2000));
const browser = await chromium.launch();
try {
  for (const [lang, path] of [["pt", "/cv/"], ["en", "/en/cv/"]]) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:4174${path}`, { waitUntil: "networkidle" });
    await page.pdf({ path: `public/cv-${lang}.pdf`, format: "A4", margin: { top: "16mm", bottom: "16mm", left: "16mm", right: "16mm" }, printBackground: true });
  }
} finally {
  await browser.close();
  server.kill();
}
