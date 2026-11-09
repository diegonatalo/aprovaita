"use client";

import { useSyncExternalStore } from "react";
import { ProgressRing } from "./progress-ring";
import { useProgress } from "@/lib/storage";

function subscribeClock(f: () => void) {
  const id = setInterval(f, 60_000);
  return () => clearInterval(id);
}

/** Contagem regressiva grande, pensada para o fundo escuro do herói da Home. */
export const Countdown = ({ targetISO }: { targetISO: string }) => {
  // arredonda ao minuto para o snapshot ser estável entre leituras
  const now = useSyncExternalStore(
    subscribeClock,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => 0,
  );
  if (!now) return <p className="font-display text-5xl font-extrabold">—</p>;
  const ms = new Date(targetISO).getTime() - now;
  if (ms <= 0) return <p className="font-display text-2xl font-bold">A prova já aconteceu.</p>;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-display text-6xl font-extrabold leading-none tabular-nums sm:text-7xl">{days}</span>
      <span className="text-lg font-semibold">dias</span>
      <span className="text-base opacity-75">e {hours}h</span>
    </p>
  );
};

export const OverallProgress = ({ topicKeys }: { topicKeys: string[] }) => {
  const p = useProgress();
  const seenTopics = topicKeys.filter((c) => (p.topics[c] ?? "unseen") !== "unseen").length;
  const masteredTopics = topicKeys.filter((c) => p.topics[c] === "mastered").length;
  const pct = topicKeys.length ? (seenTopics / topicKeys.length) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <ProgressRing value={pct} label="Conteúdo visto" size={84} />
      <p className="text-sm text-muted">
        <strong className="text-foreground">{seenTopics}</strong> de {topicKeys.length} tópicos vistos
        <br />
        <strong className="text-foreground">{masteredTopics}</strong> dominados
      </p>
    </div>
  );
};

/** Barra fina de tópicos vistos em um conjunto (usada nos cartões de área). */
export const AreaBar = ({ topicKeys }: { topicKeys: string[] }) => {
  const p = useProgress();
  const seenTopics = topicKeys.filter((c) => (p.topics[c] ?? "unseen") !== "unseen").length;
  const pct = topicKeys.length ? (seenTopics / topicKeys.length) * 100 : 0;
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
        {seenTopics}/{topicKeys.length} vistos
      </p>
    </div>
  );
};
