import { expect, test, vi } from "vitest";

// next/font só existe no build do Next.
vi.mock("./fonts", () => ({ bodyClass: "" }));
vi.mock("./globals.css", () => ({}));
import { pt } from "@/content/pt";
import { en } from "@/content/en";
import { metadata as ptMeta } from "./(pt)/layout";
import { metadata as enMeta } from "./(en)/layout";

test("os layouts usam o título e a descrição do conteúdo", () => {
  expect(ptMeta).toMatchObject(pt.meta);
  expect(enMeta).toMatchObject(en.meta);
});
