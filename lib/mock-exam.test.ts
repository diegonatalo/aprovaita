import { describe, expect, it } from "vitest";
import { EXAM } from "@/lib/exam";
import { buildMockExam, durationSeconds, gaps, quotas } from "@/lib/mock-exam";
import type { Area, Origin, Question, Subarea } from "@/types";

let seq = 0;
const question = (area: Area, subarea?: Subarea, origin: Origin = "authored"): Question => ({
  id: `q${seq++}`,
  area,
  subarea,
  topicSlug: "topico",
  origin,
  statement: "?",
  choices: ["a", "b", "c", "d", "e"],
  answerKey: 0,
  explanation: "",
});

/** Banco com `extra` questões a mais do que cada cota pede. */
const fullBank = (extra = 0, origin: Origin = "authored"): Question[] =>
  quotas().flatMap((c) =>
    Array.from({ length: c.amount + extra }, () => question(c.area, c.subarea, origin)),
  );

describe("quotas", () => {
  it("somam o total de questões da prova", () => {
    expect(quotas().reduce((n, c) => n + c.amount, 0)).toBe(EXAM.totalQuestions);
  });
});

describe("gaps", () => {
  it("é vazio quando o banco cobre todas as cotas", () => {
    expect(gaps(fullBank(), "authored")).toEqual([]);
  });

  it("aponta quanto falta em cada cota", () => {
    const bank = fullBank().filter((q) => q.area !== "matematica");
    expect(gaps(bank, "authored")).toEqual([
      {
        area: "matematica",
        subarea: undefined,
        required: EXAM.distribution.matematica,
        isAvailable: 0,
      },
    ]);
  });

  it("só conta questões da origem pedida", () => {
    expect(gaps(fullBank(0, "exam"), "authored")).toHaveLength(quotas().length);
  });
});

describe("buildMockExam", () => {
  it("monta a prova completa respeitando as cotas, sem repetir questões", () => {
    const exam = buildMockExam(fullBank(3), "authored");

    expect(exam).toHaveLength(EXAM.totalQuestions);
    expect(new Set(exam.map((q) => q.id)).size).toBe(EXAM.totalQuestions);
    for (const c of quotas()) {
      const count = exam.filter(
        (q) => q.area === c.area && (!c.subarea || q.subarea === c.subarea),
      ).length;
      expect(count).toBe(c.amount);
    }
  });

  it("lança erro quando o banco não basta", () => {
    expect(() => buildMockExam([], "authored")).toThrow("Banco insuficiente");
  });

  it("com `partial` usa o que existir em cada cota", () => {
    const bank = [question("portugues"), question("portugues")];
    expect(buildMockExam(bank, "authored", { partial: true })).toHaveLength(2);
  });

  it("prefere questões que ainda não foram usadas", () => {
    const bank = fullBank(1);
    const avoid = new Set([bank[0].id]);
    const exam = buildMockExam(bank, "authored", { avoid });
    expect(exam.every((q) => !avoid.has(q.id))).toBe(true);
  });

  it("completa com questões já usadas quando as novas acabam", () => {
    const bank = fullBank();
    const exam = buildMockExam(bank, "authored", { avoid: new Set(bank.map((q) => q.id)) });
    expect(exam).toHaveLength(EXAM.totalQuestions);
  });

  it("é determinística com o mesmo gerador aleatório", () => {
    const bank = fullBank(5);
    const seeded = () => {
      let state = 1;
      return () => (state = (state * 16807) % 2147483647) / 2147483647;
    };
    const first = buildMockExam(bank, "authored", { rand: seeded() }).map((q) => q.id);
    const second = buildMockExam(bank, "authored", { rand: seeded() }).map((q) => q.id);
    expect(first).toEqual(second);
  });
});

describe("durationSeconds", () => {
  it("dá o tempo total para a prova completa e proporcional para menos questões", () => {
    expect(durationSeconds(EXAM.totalQuestions)).toBe(EXAM.durationMinutes * 60);
    expect(durationSeconds(EXAM.totalQuestions / 2)).toBe((EXAM.durationMinutes * 60) / 2);
  });
});
