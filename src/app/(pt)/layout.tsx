import type { Metadata } from "next";
import { bodyClass } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "D'Artagnan Romann · Dev full stack",
  description: "Dev full stack que resolve problemas: automatizo processos, conecto sistemas e entendo de marketing, de SEO a tráfego pago no Google e na Meta.",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body className={bodyClass}>{children}</body>
    </html>
  );
}
