import { EXAM } from "@/lib/exam";
import type { Area, Question } from "@/types";

export type Answers = Record<string, number | null>;

export type Performance = {
  correct: number;
  total: number;
};

export type Grading = {
  correct: number;
  mistakes: number;
  blank: number;
  total: number;
  /** Prova completa: acertos × 100 ÷ 40. Reduzida: acertos × 100 ÷ total (não comparável ao corte). */
  score: number;
  partial: boolean;
  qualified: boolean | null; // null em simulado reduzido
  byArea: Record<Area, Performance>;
  byTopic: Record<string, Performance>; // "area/slug"
};

export function grade(questions: Question[], answers: Answers): Grading {
  const byArea: Record<string, Performance> = {};
  const byTopic: Record<string, Performance> = {};
  let correct = 0;
  let blank = 0;
  for (const q of questions) {
    const r = answers[q.id] ?? null;
    const correctChoice = r === q.answerKey;
    if (r === null) blank++;
    if (correctChoice) correct++;
    const topicKey = `${q.area}/${q.topicSlug}`;
    for (const [map, k] of [
      [byArea, q.area],
      [byTopic, topicKey],
    ] as const) {
      map[k] ??= { correct: 0, total: 0 };
      map[k].total++;
      if (correctChoice) map[k].correct++;
    }
  }
  const total = questions.length;
  const partial = total !== EXAM.totalQuestions;
  const score = total === 0 ? 0 : (correct * 100) / total;
  return {
    correct,
    mistakes: total - correct - blank,
    blank,
    total,
    score,
    partial,
    qualified: partial ? null : score >= EXAM.cutoffScore,
    byArea: byArea as Record<Area, Performance>,
    byTopic,
  };
}
