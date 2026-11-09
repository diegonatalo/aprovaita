"use client";

import { useEffect, useRef, useState } from "react";
import { AnswerSheet } from "./answer-sheet";
import { ExamTimer } from "./exam-timer";
import { QuestionView } from "./question-view";
import { grade } from "@/lib/grading";
import {
  clearExamSession,
  recordMistakes,
  saveExamSession,
  saveAttempt,
  type ExamSession,
  type Attempt,
} from "@/lib/storage";
import type { Question } from "@/types";

export const ExamRunner = ({
  initial,
  bank,
  onFinished,
}: {
  initial: ExamSession;
  bank: Record<string, Question>;
  onFinished: (t: Attempt) => void;
}) => {
  const questions = initial.order.map((id) => bank[id]).filter(Boolean);
  const [answers, setAnswers] = useState(initial.answers);
  const [flagged, setFlagged] = useState(initial.flagged);
  const [current, setCurrent] = useState(Math.min(initial.current, questions.length - 1));
  const [remaining, setRemaining] = useState(initial.remainingSeconds);
  const [paused, setPaused] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Estado mais recente para o intervalo e para finalizar (evita closures velhas).
  const last = useRef({ answers, flagged, current, remaining });
  useEffect(() => {
    last.current = { answers, flagged, current, remaining };
  });
  const closed = useRef(false);

  function persist() {
    const u = last.current;
    saveExamSession({
      ...initial,
      answers: u.answers,
      flagged: u.flagged,
      current: u.current,
      remainingSeconds: u.remaining,
    });
  }

  function finish() {
    if (closed.current) return;
    closed.current = true;
    const u = last.current;
    const c = grade(questions, u.answers);
    const corrects = questions.filter((q) => u.answers[q.id] === q.answerKey).map((q) => q.id);
    const wrongs = questions
      .filter((q) => u.answers[q.id] != null && u.answers[q.id] !== q.answerKey)
      .map((q) => q.id);
    recordMistakes(wrongs, corrects);
    const attempt: Attempt = {
      id: `${initial.mockExam}-${Date.now()}`,
      mockExam: initial.mockExam,
      startedAt: initial.startedAt,
      seconds: initial.durationSeconds - u.remaining,
      order: questions.map((q) => q.id),
      answers: u.answers,
      correct: c.correct,
      total: c.total,
      score: c.score,
      partial: c.partial,
      qualified: c.qualified,
      byArea: c.byArea,
    };
    saveAttempt(attempt);
    clearExamSession();
    onFinished(attempt);
  }

  // Cronômetro: calcula pelo relógio (não perde tempo se a aba ficar em segundo plano).
  useEffect(() => {
    if (paused) return;
    const end = Date.now() + last.current.remaining * 1000;
    let ticks = 0;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      last.current.remaining = r;
      setRemaining(r);
      if (++ticks % 10 === 0) persist();
      if (r === 0) finish();
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  // Grava a cada ação do usuário.
  useEffect(() => {
    if (!closed.current) persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, flagged, current, paused]);

  const q = questions[current];
  const blank = questions.filter((x) => answers[x.id] == null).length;
  const isFlagged = flagged.includes(q.id);

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-2 card p-3 lg:top-4">
        <ExamTimer remaining={remaining} paused={paused} onTogglePause={() => setPaused((p) => !p)} />
        <span className="text-sm text-muted">
          Simulado {initial.mockExam} · {questions.length - blank}/{questions.length} respondidas
        </span>
        <button onClick={() => setConfirming(true)} className="btn btn-primary btn-sm">
          Finalizar
        </button>
      </div>

      {confirming && (
        <div role="alertdialog" aria-label="Confirmar finalização" className="space-y-3 rounded-2xl border border-aviso bg-card p-4">
          <p className="font-semibold">
            Finalizar o simulado?{" "}
            {blank > 0 ? `${blank} questão(ões) em branco.` : "Todas respondidas."}
          </p>
          <div className="flex gap-2">
            <button onClick={finish} className="btn btn-primary">
              Sim, finalizar
            </button>
            <button onClick={() => setConfirming(false)} className="btn btn-ghost">
              Voltar à prova
            </button>
          </div>
        </div>
      )}

      {paused ? (
        <div className="rounded-2xl border border-dashed border-borda p-8 text-center">
          <p className="mb-3 font-semibold">Prova pausada</p>
          <button onClick={() => setPaused(false)} className="btn btn-primary">
            Continuar
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-3">
            <QuestionView
              question={q}
              number={current + 1}
              choice={answers[q.id] ?? null}
              reveal={false}
              onChoose={(i) => setAnswers((r) => ({ ...r, [q.id]: i }))}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrent((a) => Math.max(0, a - 1))}
                disabled={current === 0}
                className="btn btn-ghost"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrent((a) => Math.min(questions.length - 1, a + 1))}
                disabled={current === questions.length - 1}
                className="btn btn-ghost"
              >
                Próxima
              </button>
              <button
                onClick={() => setFlagged((m) => (isFlagged ? m.filter((x) => x !== q.id) : [...m, q.id]))}
                aria-pressed={isFlagged}
                className={`btn ${isFlagged ? "border border-aviso bg-aviso/10 text-aviso" : "btn-ghost"}`}
              >
                {isFlagged ? "Marcada para revisar" : "Revisar depois"}
              </button>
              {answers[q.id] != null && (
                <button
                  onClick={() => setAnswers((r) => ({ ...r, [q.id]: null }))}
                  className="btn btn-ghost text-muted"
                >
                  Limpar resposta
                </button>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <button
              onClick={() => setSheetOpen((v) => !v)}
              aria-expanded={sheetOpen}
              className="mb-2 w-full btn btn-ghost btn-sm text-left text-sm font-semibold lg:hidden"
            >
              Folha de respostas {sheetOpen ? "▲" : "▼"}
            </button>
            <div className={`${sheetOpen ? "block" : "hidden"} card p-3 lg:block`}>
              <h2 className="mb-2 hidden text-sm font-semibold lg:block">Folha de respostas</h2>
              <AnswerSheet
                questions={questions}
                answers={answers}
                flagged={flagged}
                current={current}
                onGo={(i) => {
                  setCurrent(i);
                  setSheetOpen(false);
                }}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
