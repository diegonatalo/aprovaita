import { describe, expect, it } from "vitest";
import { EXAM } from "@/lib/exam";
import { grade } from "@/lib/grading";
import type { Area, Question } from "@/types";

const question = (
  id: string,
  answerKey: Question["answerKey"],
  area: Area = "portugues",
): Question => ({
  id,
  area,
  topicSlug: "topico",
  origin: "authored",
  statement: "?",
  choices: ["a", "b", "c", "d", "e"],
  answerKey,
  explanation: "",
});

describe("grade", () => {
  it("conta acertos, erros e brancos", () => {
    const questions = [question("1", 0), question("2", 1), question("3", 2), question("4", 3)];
    const result = grade(questions, { "1": 0, "2": 4, "3": null });

    expect(result.correct).toBe(1);
    expect(result.mistakes).toBe(1);
    expect(result.blank).toBe(2);
    expect(result.total).toBe(4);
  });

  it("trata questão sem resposta como em branco", () => {
    const result = grade([question("1", 0)], {});
    expect(result.blank).toBe(1);
    expect(result.correct).toBe(0);
  });

  it("agrupa o desempenho por área e por tópico", () => {
    const questions = [question("1", 0, "portugues"), question("2", 0, "matematica")];
    const result = grade(questions, { "1": 0, "2": 1 });

    expect(result.byArea.portugues).toEqual({ correct: 1, total: 1 });
    expect(result.byArea.matematica).toEqual({ correct: 0, total: 1 });
    expect(result.byTopic["matematica/topico"]).toEqual({ correct: 0, total: 1 });
  });

  it("simulado reduzido é parcial e não tem aprovação", () => {
    const result = grade([question("1", 0), question("2", 0)], { "1": 0, "2": 0 });
    expect(result.partial).toBe(true);
    expect(result.qualified).toBeNull();
    expect(result.score).toBe(100);
  });

  it("prova completa compara a nota com o corte", () => {
    const questions = Array.from({ length: EXAM.totalQuestions }, (_, i) =>
      question(String(i), 0),
    );
    const answers = (hits: number) =>
      Object.fromEntries(questions.map((q, i) => [q.id, i < hits ? 0 : 1]));

    const atCutoff = grade(questions, answers(EXAM.totalQuestions / 2));
    expect(atCutoff.partial).toBe(false);
    expect(atCutoff.score).toBe(EXAM.cutoffScore);
    expect(atCutoff.qualified).toBe(true);

    expect(grade(questions, answers(EXAM.totalQuestions / 2 - 1)).qualified).toBe(false);
  });

  it("sem questões a nota é zero", () => {
    expect(grade([], {}).score).toBe(0);
  });
});
