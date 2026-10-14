import type { Metadata } from "next";
import { bodyClass } from "../fonts";
import "../globals.css";
import { pt } from "@/content/pt";

export const metadata: Metadata = { title: pt.meta.title, description: pt.meta.description };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body className={bodyClass}>{children}</body>
    </html>
  );
}
