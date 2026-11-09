export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(h)}:${two(m)}:${two(r)}`;
}

export const formatScore = (n: number) => n.toFixed(1).replace(".", ",");

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
