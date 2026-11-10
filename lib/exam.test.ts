import { describe, expect, it } from "vitest";
import { EXAM, scoreOf } from "@/lib/exam";

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

describe("EXAM", () => {
  it("a distribuição por área soma o total de questões", () => {
    expect(sum(Object.values(EXAM.distribution))).toBe(EXAM.totalQuestions);
  });

  it("as subáreas de específicos somam as questões da área", () => {
    expect(sum(Object.values(EXAM.specificsBySubarea))).toBe(
      EXAM.distribution.especificos,
    );
  });
});

describe("scoreOf", () => {
  it("converte acertos em nota de 0 a 100", () => {
    expect(scoreOf(0)).toBe(0);
    expect(scoreOf(20)).toBe(50);
    expect(scoreOf(EXAM.totalQuestions)).toBe(100);
  });
});
