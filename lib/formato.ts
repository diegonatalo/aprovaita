export function formatarTempo(segundos: number): string {
  const s = Math.max(0, Math.round(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${dois(h)}:${dois(m)}:${dois(r)}`;
}

export const formatarNota = (n: number) => n.toFixed(1).replace(".", ",");

export const formatarData = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
