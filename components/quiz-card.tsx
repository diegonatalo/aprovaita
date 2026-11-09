"use client";

import { useState } from "react";
import { QuestionView } from "./question-view";
import { recordQuiz, useProgress } from "@/lib/storage";
import type { Question } from "@/types";

/** Quiz de um tópico (A = autoral, B = banca). Slot B vazio mostra aviso claro. */
export function QuizCard({
  topicKey,
  quiz,
  questions,
}: {
  topicKey: string; // "area/slug"
  quiz: "A" | "B";
  questions: Question[];
}) {
  const progress = useProgress();
  const previous = progress.quizzes[topicKey]?.[quiz];
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [graded, setGraded] = useState(false);

  const title = quiz === "A" ? "Quiz A — questões autorais" : "Quiz B — questões reais da banca";

  if (questions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-borda p-4">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-aviso">
          Sem questões reais da banca para este tópico ainda. Elas só entram a partir de provas
          VUNESP com fonte verificável; nada é inventado aqui.
        </p>
      </section>
    );
  }

  const correct = answers.filter((r, i) => r === questions[i].answerKey).length;

  function grade() {
    const corrects = questions.filter((q, i) => answers[i] === q.answerKey).map((q) => q.id);
    const wrongs = questions.filter((q, i) => answers[i] !== q.answerKey).map((q) => q.id);
    recordQuiz(topicKey, quiz, { correct: corrects.length, total: questions.length, data: new Date().toISOString() }, wrongs, corrects);
    setGraded(true);
  }

  function redo() {
    setAnswers(questions.map(() => null));
    setGraded(false);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {previous && (
          <span className="text-sm text-muted">
            Último resultado: {previous.correct}/{previous.total}
          </span>
        )}
      </div>
      {questions.map((q, i) => (
        <QuestionView
          key={q.id}
          question={q}
          number={i + 1}
          choice={answers[i]}
          reveal={graded}
          onChoose={(alt) => setAnswers((r) => r.map((v, k) => (k === i ? alt : v)))}
        />
      ))}
      {graded ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-semibold">
            Você acertou {correct} de {questions.length}.
          </p>
          <button onClick={redo} className="btn btn-ghost">
            Refazer
          </button>
        </div>
      ) : (
        <button
          onClick={grade}
          disabled={answers.some((r) => r === null)}
          className="btn btn-primary"
        >
          Corrigir
        </button>
      )}
    </section>
  );
}
