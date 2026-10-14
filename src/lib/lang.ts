import type { Lang } from "@/content/types";

const KEY = "lang";

export function detectLang(languages: readonly string[]): Lang {
  const first = languages[0]?.toLowerCase() ?? "pt";
  return first.startsWith("pt") ? "pt" : "en";
}

export function readSavedLang(): Lang | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "pt" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* sem storage: a URL continua mandando */
  }
}

export function langPath(lang: Lang, path = "", opts: { explicit?: boolean } = {}): string {
  const base = lang === "en" ? "/en/" : "/";
  const url = path ? `${base}${path}/` : base;
  return opts.explicit && lang === "pt" ? `${url}?lang=pt` : url;
}

export function shouldRedirectToEn(search: string, saved: Lang | null, languages: readonly string[]): boolean {
  if (new URLSearchParams(search).get("lang") === "pt") return false;
  return (saved ?? detectLang(languages)) === "en";
}
