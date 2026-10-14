import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { pt } from "@/content/pt";
import { Site } from "./Site";

afterEach(() => vi.unstubAllGlobals());

test("a mesa mostra o quadro de contribuições do GitHub", async () => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ contributions: [{ date: "2026-10-01", count: 3, level: 2 }] })));
  render(<Site content={pt} />);
  await waitFor(() => expect(screen.getByRole("img", { name: /github/i })).toBeInTheDocument());
});
