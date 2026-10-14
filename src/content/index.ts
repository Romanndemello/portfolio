import type { Content, Lang } from "./types";
import { pt } from "./pt";
import { en } from "./en";

export type { Content, Lang } from "./types";
export const getContent = (lang: Lang): Content => (lang === "en" ? en : pt);
