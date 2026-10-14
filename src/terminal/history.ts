export function historyStep(history: string[], index: number, dir: "up" | "down") {
  if (history.length === 0) return { index: 0, value: "" };
  const next = dir === "up" ? Math.max(0, index - 1) : Math.min(history.length, index + 1);
  return { index: next, value: next === history.length ? "" : history[next] };
}
