"use client";
import { useEffect } from "react";
import { readSavedLang, shouldRedirectToEn } from "@/lib/lang";

export function LangRedirect() {
  useEffect(() => {
    const languages = navigator.languages ?? [navigator.language];
    if (shouldRedirectToEn(window.location.search, readSavedLang(), languages)) window.location.replace("/en/");
  }, []);
  return null;
}
