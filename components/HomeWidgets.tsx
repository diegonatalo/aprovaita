"use client";

import { useSyncExternalStore } from "react";
import { ProgressRing } from "./ProgressRing";
import { useProgresso } from "@/lib/storage";

function assinarRelogio(f: () => void) {
  const id = setInterval(f, 60_000);
  return () => clearInterval(id);
}

/** Contagem regressiva grande, pensada para o fundo escuro do herói da Home. */
export function Countdown({ alvoISO }: { alvoISO: string }) {
  // arredonda ao minuto para o snapshot ser estável entre leituras
  const agora = useSyncExternalStore(
    assinarRelogio,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0,
  );
  if (!agora) return <p className="font-display text-5xl font-extrabold">—</p>;
  const ms = new Date(alvoISO).getTime() - agora;
  if (ms <= 0) return <p className="font-display text-2xl font-bold">A prova já aconteceu.</p>;
  const dias = Math.floor(ms / 86_400_000);
  const horas = Math.floor((ms % 86_400_000) / 3_600_000);
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-display text-6xl font-extrabold leading-none tabular-nums sm:text-7xl">{dias}</span>
      <span className="text-lg font-semibold">dias</span>
      <span className="text-base opacity-75">e {horas}h</span>
    </p>
  );
}

export function ProgressoGeral({ chaves }: { chaves: string[] }) {
  const p = useProgresso();
  const vistos = chaves.filter((c) => (p.topicos[c] ?? "nao-visto") !== "nao-visto").length;
  const dominados = chaves.filter((c) => p.topicos[c] === "dominado").length;
  const pct = chaves.length ? (vistos / chaves.length) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <ProgressRing valor={pct} rotulo="Conteúdo visto" tamanho={84} />
      <p className="text-sm text-muted">
        <strong className="text-foreground">{vistos}</strong> de {chaves.length} tópicos vistos
        <br />
        <strong className="text-foreground">{dominados}</strong> dominados
      </p>
    </div>
  );
}

/** Barra fina de tópicos vistos em um conjunto (usada nos cartões de área). */
export function BarraArea({ chaves }: { chaves: string[] }) {
  const p = useProgresso();
  const vistos = chaves.filter((c) => (p.topicos[c] ?? "nao-visto") !== "nao-visto").length;
  const pct = chaves.length ? (vistos / chaves.length) * 100 : 0;
  return (
    <div>
      <div
        role="progressbar"
        aria-label="Tópicos vistos"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-borda"
      >
        <div className="h-full rounded-full bg-acento transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {vistos}/{chaves.length} vistos
      </p>
    </div>
  );
}
