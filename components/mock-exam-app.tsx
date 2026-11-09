"use client";

import { useMemo, useState } from "react";
import { ExamRunner } from "./exam-runner";
import { Result } from "./result";
import { AREA_NAMES, SUBAREA_NAMES, EXAM } from "@/lib/exam";
import { formatDate, formatScore, formatTime } from "@/lib/format";
import { durationSeconds, gaps, buildMockExam } from "@/lib/mock-exam";
import {
  clearExamSession,
  saveExamSession,
  useExamSession,
  useProgress,
  type ExamSession,
  type Attempt,
} from "@/lib/storage";
import type { TopicInfo } from "@/lib/bank";
import type { Origin, Question } from "@/types";

type Screen =
  | { kind: "home" }
  | { kind: "exam"; initial: ExamSession }
  | { kind: "result"; attempt: Attempt };

const ORIGIN: Record<"A" | "B", Origin> = { A: "authored", B: "exam" };
const TITLE = { A: "Simulado A — questões autorais", B: "Simulado B — questões reais da banca" };

export const MockExamApp = ({
  questions,
  info,
}: {
  questions: Question[];
  info: Record<string, TopicInfo>;
}) => {
  const [screen, setScreen] = useState<Screen>({ kind: "home" });
  const progress = useProgress();
  const examSession = useExamSession();
  const bank = useMemo(() => Object.fromEntries(questions.map((q) => [q.id, q])), [questions]);

  function start(which: "A" | "B") {
    const origin = ORIGIN[which];
    const complete = gaps(questions, origin).length === 0;
    const avoid = new Set(
      progress.attempts.filter((t) => t.mockExam === which).flatMap((t) => t.order),
    );
    const drawn = buildMockExam(questions, origin, { avoid, partial: !complete });
    if (drawn.length === 0) return;
    const duration = durationSeconds(drawn.length);
    const initial: ExamSession = {
      mockExam: which,
      startedAt: new Date().toISOString(),
      order: drawn.map((q) => q.id),
      answers: {},
      flagged: [],
      remainingSeconds: duration,
      durationSeconds: duration,
      current: 0,
    };
    saveExamSession(initial, true);
    setScreen({ kind: "exam", initial });
  }

  if (screen.kind === "exam") {
    return (
      <ExamRunner
        initial={screen.initial}
        bank={bank}
        onFinished={(attempt) => setScreen({ kind: "result", attempt })}
      />
    );
  }
  if (screen.kind === "result") {
    return <Result attempt={screen.attempt} bank={bank} info={info} onBack={() => setScreen({ kind: "home" })} />;
  }

  const attempts = [...progress.attempts].reverse();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold">Simulados</h1>
        <p className="text-sm text-muted">
          40 questões (8 Português, 5 Matemática, 3 Legislação, 24 Específicos), {EXAM.durationMinutes / 60}h. Nota = acertos × 100 ÷ 40; habilitado com nota ≥ {EXAM.cutoffScore}.
        </p>
      </header>

      {examSession && (
        <section className="space-y-3 rounded-2xl border-2 border-acento bg-acento-suave p-5">
          <h2 className="font-bold">Prova em andamento</h2>
          <p className="text-sm text-muted">
            Simulado {examSession.mockExam} · restam {formatTime(examSession.remainingSeconds)} · {Object.values(examSession.answers).filter((r) => r != null).length}/{examSession.order.length} respondidas
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setScreen({ kind: "exam", initial: examSession })} className="btn btn-primary">
              Retomar
            </button>
            <button
              onClick={() => {
                if (window.confirm("Descartar a prova em andamento? Ela não será corrigida.")) clearExamSession();
              }}
              className="btn btn-ghost"
            >
              Descartar
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(["A", "B"] as const).map((which) => {
          const missing = gaps(questions, ORIGIN[which]);
          const available = questions.filter((q) => q.origin === ORIGIN[which]).length;
          // só o tamanho importa aqui; rand fixo evita sortear a cada renderização
          const reduced = buildMockExam(questions, ORIGIN[which], { partial: true, rand: () => 0 }).length;
          return (
            <section key={which} className="space-y-3 card p-4">
              <h2 className="font-bold">{TITLE[which]}</h2>
              <p className="text-sm text-muted">{available} questões no banco.</p>
              {missing.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-aviso">
                    Banco incompleto: faltam questões em {missing.length} grupo(s)
                  </summary>
                  <ul className="mt-2 list-disc pl-5 text-muted">
                    {missing.map((l) => (
                      <li key={`${l.area}${l.subarea ?? ""}`}>
                        {l.subarea ? SUBAREA_NAMES[l.subarea] : AREA_NAMES[l.area]}: {l.isAvailable} de {l.required}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <button
                onClick={() => start(which)}
                disabled={reduced === 0 || !!examSession}
                className="btn btn-primary"
              >
                {missing.length === 0
                  ? "Iniciar (40 questões)"
                  : reduced === 0
                    ? "Sem questões disponíveis"
                    : `Iniciar simulado reduzido (${reduced} questões)`}
              </button>
              {missing.length === 0 && (
                <p className="text-xs text-muted">Cada novo simulado prefere questões que você ainda não fez.</p>
              )}
            </section>
          );
        })}
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Histórico</h2>
        {attempts.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma tentativa ainda.</p>
        ) : (
          <>
            <div role="img" aria-label="Evolução das notas" className="flex h-28 items-end gap-1 card p-3">
              {[...attempts].reverse().map((t) => (
                <div
                  key={t.id}
                  title={`${formatDate(t.startedAt)}: ${formatScore(t.score)}${t.partial ? " (reduzido)" : ""}`}
                  className={`min-w-2 flex-1 rounded-t-md ${t.partial ? "bg-acento/40" : "bg-acento"}`}
                  style={{ height: `${Math.max(t.score, 2)}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-muted">Barras claras: simulados reduzidos (nota sobre menos de 40 questões).</p>
            <ul className="space-y-2">
              {attempts.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 card p-3 text-sm">
                  <span>
                    <strong>{formatDate(t.startedAt)}</strong> · Simulado {t.mockExam} · {t.correct}/{t.total}
                    {t.partial && " (reduzido)"} · {formatTime(t.seconds)}
                  </span>
                  <span className="flex items-center gap-3">
                    <strong className="tabular-nums">{formatScore(t.score)}</strong>
                    <button onClick={() => setScreen({ kind: "result", attempt: t })} className="btn btn-ghost btn-sm">
                      Ver
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
};
