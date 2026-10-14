import type { Metadata } from "next";
import { bodyClass } from "../fonts";
import "../globals.css";
import { en } from "@/content/en";

export const metadata: Metadata = { title: en.meta.title, description: en.meta.description };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={bodyClass}>{children}</body>
    </html>
  );
}
