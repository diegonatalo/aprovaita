"use client";

import type { Question } from "@/types";

/** Folha de respostas: um botão por questão, com estado (respondida, marcada para revisar, atual). */
export function AnswerSheet({
  questions,
  answers,
  flagged,
  current,
  onGo,
}: {
  questions: Question[];
  answers: Record<string, number | null>;
  flagged: string[];
  current: number;
  onGo: (i: number) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-5">
        {questions.map((q, i) => {
          const answered = answers[q.id] !== null && answers[q.id] !== undefined;
          const isFlagged = flagged.includes(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onGo(i)}
              aria-label={`Questão ${i + 1}${answered ? ", respondida" : ", em branco"}${isFlagged ? ", marcada para revisar" : ""}`}
              aria-current={i === current ? "true" : undefined}
              className={`relative h-10 rounded-xl border text-sm font-semibold transition ${
                answered ? "border-acento bg-acento-suave text-acento" : "border-borda"
              } ${i === current ? "ring-2 ring-acento" : ""}`}
            >
              {i + 1}
              {isFlagged && <span aria-hidden className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-sol" />}
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
