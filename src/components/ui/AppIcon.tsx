import type { ReactNode } from "react";
import { gradient, type IconColor } from "@/lib/palette";

// Ícone de app: quadrado com canto de 24%, degradê de cima pra baixo e sombra curta.
export function AppIcon({ color, size = 40, children }: { color: IconColor | "white"; size?: number; children: ReactNode }) {
  const white = color === "white";
  return (
    <span aria-hidden style={{ width: size, height: size, backgroundImage: white ? undefined : gradient(color) }}
      className={`flex shrink-0 items-center justify-center rounded-[24%] shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${white ? "border border-black/10 bg-white text-black" : "text-white"}`}>
      {children}
    </span>
  );
}
