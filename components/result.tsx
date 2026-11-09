"use client";

import { useState } from "react";
import { QuestionView } from "./question-view";
import { AREA_NAMES, EXAM } from "@/lib/exam";
import { grade } from "@/lib/grading";
import { formatScore, formatTime } from "@/lib/format";
import type { TopicInfo } from "@/lib/bank";
import type { Attempt } from "@/lib/storage";
import type { Area, Question } from "@/types";

function Bar({ correct, total }: { correct: number; total: number }) {
  const pct = total ? (correct / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-borda" aria-hidden>
        <div className="h-full rounded-full bg-acento" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 text-right text-sm tabular-nums">
        {correct}/{total}
      </span>
    </div>
  );
}

export function Result({
  attempt,
  bank,
  info,
  onBack,
}: {
  attempt: Attempt;
  bank: Record<string, Question>;
  info: Record<string, TopicInfo>;
  onBack: () => void;
}) {
  const [filter, setFilter] = useState<"todas" | "erradas" | "branco">("todas");
  const questions = attempt.order.map((id) => bank[id]).filter(Boolean);
  const c = grade(questions, attempt.answers);
  const sortedTopics = Object.entries(c.byTopic).sort(
    ([, a], [, b]) => a.correct / a.total - b.correct / b.total,
  );

  const visible = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => {
      const r = attempt.answers[q.id] ?? null;
      if (filter === "erradas") return r !== null && r !== q.answerKey;
      if (filter === "branco") return r === null;
      return true;
    });

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm font-medium text-acento">
        ← Voltar aos simulados
      </button>
      <header className="space-y-2 card p-4">
        <h1 className="font-display text-xl font-bold text-muted">Resultado — Simulado {attempt.mockExam}</h1>
        <p className="font-display text-6xl font-extrabold tabular-nums text-acento">{formatScore(c.score)}</p>
        {c.qualified === null ? (
          <p className="rounded-xl border border-aviso bg-aviso/10 p-3 text-sm text-aviso">
            Simulado reduzido ({c.total} questões, banco ainda incompleto). A nota é acertos × 100 ÷ {c.total}
            e <strong>não é comparável</strong> com o corte da prova ({EXAM.cutoffScore} pontos = 20 de 40).
          </p>
        ) : (
          <p className={`font-semibold ${c.qualified ? "text-acerto" : "text-erro"}`}>
            {c.qualified ? "Habilitado" : "Não habilitado"} (corte: {EXAM.cutoffScore})
          </p>
        )}
        <p className="text-sm text-muted">
          {c.correct} acertos · {c.mistakes} erros · {c.blank} em branco · tempo: {formatTime(attempt.seconds)}
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-bold">Desempenho por área</h2>
        <div className="space-y-2">
          {(Object.keys(c.byArea) as Area[]).map((a) => (
            <div key={a}>
              <p className="text-sm font-medium">{AREA_NAMES[a]}</p>
              <Bar {...c.byArea[a]} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">Por tópico (do mais fraco ao mais forte)</h2>
        <div className="space-y-2">
          {sortedTopics.map(([topicKey, d]) => (
            <div key={topicKey}>
              <p className="text-sm font-medium">{info[topicKey]?.title ?? topicKey}</p>
              <Bar {...d} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-auto text-lg font-bold">Gabarito comentado</h2>
          {(
            [
              ["todas", "Todas"],
              ["erradas", "Erradas"],
              ["branco", "Em branco"],
            ] as const
          ).map(([v, r]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              aria-pressed={filter === v}
              className="chip"
            >
              {r}
            </button>
          ))}
        </div>
        {visible.length === 0 && <p className="text-sm text-muted">Nenhuma questão neste filtro.</p>}
        {visible.map(({ q, i }) => (
          <QuestionView key={q.id} question={q} number={i + 1} choice={attempt.answers[q.id] ?? null} reveal />
        ))}
      </section>
    </div>
  );
}
