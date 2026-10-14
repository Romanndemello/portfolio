const MENU_H = 32;

export function clampPosition(
  pos: { x: number; y: number },
  size: { w: number; h: number },
  vp: { w: number; h: number },
) {
  const maxX = Math.max(0, vp.w - size.w);
  const maxY = Math.max(MENU_H, vp.h - size.h);
  return { x: Math.min(Math.max(0, pos.x), maxX), y: Math.min(Math.max(MENU_H, pos.y), maxY) };
}
