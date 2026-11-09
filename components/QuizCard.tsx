"use client";

import { useState } from "react";
import { QuestionView } from "./QuestionView";
import { registrarQuiz, useProgresso } from "@/lib/storage";
import type { Questao } from "@/lib/tipos";

/** Quiz de um tópico (A = autoral, B = banca). Slot B vazio mostra aviso claro. */
export function QuizCard({
  chave,
  quiz,
  questoes,
}: {
  chave: string; // "area/slug"
  quiz: "A" | "B";
  questoes: Questao[];
}) {
  const progresso = useProgresso();
  const anterior = progresso.quizzes[chave]?.[quiz];
  const [respostas, setRespostas] = useState<(number | null)[]>(() => questoes.map(() => null));
  const [corrigido, setCorrigido] = useState(false);

  const titulo = quiz === "A" ? "Quiz A — questões autorais" : "Quiz B — questões reais da banca";

  if (questoes.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-borda p-4">
        <h2 className="font-display text-xl font-bold">{titulo}</h2>
        <p className="mt-2 text-sm text-aviso">
          Sem questões reais da banca para este tópico ainda. Elas só entram a partir de provas
          VUNESP com fonte verificável; nada é inventado aqui.
        </p>
      </section>
    );
  }

  const acertos = respostas.filter((r, i) => r === questoes[i].gabarito).length;

  function corrigir() {
    const certos = questoes.filter((q, i) => respostas[i] === q.gabarito).map((q) => q.id);
    const errados = questoes.filter((q, i) => respostas[i] !== q.gabarito).map((q) => q.id);
    registrarQuiz(chave, quiz, { acertos: certos.length, total: questoes.length, data: new Date().toISOString() }, errados, certos);
    setCorrigido(true);
  }

  function refazer() {
    setRespostas(questoes.map(() => null));
    setCorrigido(false);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-bold">{titulo}</h2>
        {anterior && (
          <span className="text-sm text-muted">
            Último resultado: {anterior.acertos}/{anterior.total}
          </span>
        )}
      </div>
      {questoes.map((q, i) => (
        <QuestionView
          key={q.id}
          questao={q}
          numero={i + 1}
          escolha={respostas[i]}
          revelar={corrigido}
          onEscolher={(alt) => setRespostas((r) => r.map((v, k) => (k === i ? alt : v)))}
        />
      ))}
      {corrigido ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-semibold">
            Você acertou {acertos} de {questoes.length}.
          </p>
          <button onClick={refazer} className="btn btn-ghost">
            Refazer
          </button>
        </div>
      ) : (
        <button
          onClick={corrigir}
          disabled={respostas.some((r) => r === null)}
          className="btn btn-primary"
        >
          Corrigir
        </button>
      )}
    </section>
  );
}
