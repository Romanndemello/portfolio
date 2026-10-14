import type { Metadata } from "next";
import { bodyClass } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "D'Artagnan Romann · Full stack developer",
  description: "Full stack developer who solves problems: I automate processes, connect systems and know marketing, from SEO to paid traffic on Google and Meta.",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={bodyClass}>{children}</body>
    </html>
  );
}
