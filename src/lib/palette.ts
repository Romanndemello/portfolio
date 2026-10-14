// Cores do site: fundo claro, vidro branco e ícones de app em degradê de cima pra baixo.
export const ICON_GRADIENTS = {
  blue: { from: "#5FB0FF", to: "#2E7CF6" },
  purple: { from: "#C489FB", to: "#8231E8" },
  pink: { from: "#FF7A93", to: "#F92D50" },
  green: { from: "#4FDE73", to: "#1FB84A" },
  yellow: { from: "#FFD056", to: "#F5A623" },
  ink: { from: "#3a3a3c", to: "#111113" },
} as const;

export type IconColor = keyof typeof ICON_GRADIENTS;

export const gradient = (c: IconColor) => `linear-gradient(to bottom, ${ICON_GRADIENTS[c].from}, ${ICON_GRADIENTS[c].to})`;

export const ACCENT = "#57A4F0";

// Vidro dos widgets e do dock.
export const GLASS =
  "rounded-2xl border border-white/45 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150";
