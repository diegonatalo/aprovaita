"use client";

import type { Questao } from "@/lib/tipos";

/** Folha de respostas: um botão por questão, com estado (respondida, marcada para revisar, atual). */
export function AnswerSheet({
  questoes,
  respostas,
  marcadas,
  atual,
  onIr,
}: {
  questoes: Questao[];
  respostas: Record<string, number | null>;
  marcadas: string[];
  atual: number;
  onIr: (i: number) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-5">
        {questoes.map((q, i) => {
          const respondida = respostas[q.id] !== null && respostas[q.id] !== undefined;
          const marcada = marcadas.includes(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onIr(i)}
              aria-label={`Questão ${i + 1}${respondida ? ", respondida" : ", em branco"}${marcada ? ", marcada para revisar" : ""}`}
              aria-current={i === atual ? "true" : undefined}
              className={`relative h-10 rounded-xl border text-sm font-semibold transition ${
                respondida ? "border-acento bg-acento-suave text-acento" : "border-borda"
              } ${i === atual ? "ring-2 ring-acento" : ""}`}
            >
              {i + 1}
              {marcada && <span aria-hidden className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-sol" />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">
        Verde-petróleo: respondida · ponto coral: revisar depois · sem cor: em branco
      </p>
    </div>
  );
}
