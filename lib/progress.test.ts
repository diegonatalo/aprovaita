import { describe, expect, it } from "vitest";
import {
  EMPTY_PROGRESS,
  SCHEMA_VERSION,
  parseBackup,
  parseExamSession,
  parseProgress,
  topicKey,
  withMistakes,
  withQuiz,
  withTopicStatus,
} from "@/lib/progress";

describe("parseProgress", () => {
  it("descarta o que não é do formato atual", () => {
    expect(parseProgress(null)).toBe(EMPTY_PROGRESS);
    expect(parseProgress({ version: 1, topics: { a: "seen" } })).toBe(EMPTY_PROGRESS);
  });

  it("aceita o formato atual e completa campos que faltam", () => {
    expect(parseProgress({ version: SCHEMA_VERSION, mistakes: ["q1"] })).toEqual({ ...EMPTY_PROGRESS, mistakes: ["q1"] });
  });
});

describe("parseExamSession", () => {
  it("exige a ordem das questões", () => {
    expect(parseExamSession({ mockExam: "A" })).toBeNull();
    expect(parseExamSession({ mockExam: "A", order: ["q1"] })).toMatchObject({ order: ["q1"] });
  });
});

describe("atualizações puras", () => {
  it("marcar tópico não altera o progresso original", () => {
    const next = withTopicStatus(EMPTY_PROGRESS, topicKey("portugues", "crase"), "seen");
    expect(next.topics).toEqual({ "portugues/crase": "seen" });
    expect(EMPTY_PROGRESS.topics).toEqual({});
  });

  it("erradas entram e acertadas saem do caderno, sem repetir", () => {
    const p = withMistakes({ ...EMPTY_PROGRESS, mistakes: ["a", "b"] }, ["b", "c"], ["a"]);
    expect(p.mistakes.sort()).toEqual(["b", "c"]);
  });

  it("registrar quiz guarda o resultado do tópico e atualiza o caderno", () => {
    const r = { correct: 1, total: 2, data: "2026-03-01" };
    const p = withQuiz(EMPTY_PROGRESS, "portugues/crase", "B", r, ["q2"], ["q1"]);
    expect(p.quizzes["portugues/crase"]).toEqual({ B: r });
    expect(p.mistakes).toEqual(["q2"]);
  });
});

describe("parseBackup", () => {
  it("recusa JSON inválido e arquivos que não são backup", () => {
    expect(parseBackup("{")).toEqual({ ok: false, error: "JSON inválido." });
    expect(parseBackup('{"a":1}')).toEqual({ ok: false, error: "Arquivo não parece ser um backup de progresso." });
  });

  it("lê um backup válido", () => {
    const result = parseBackup(JSON.stringify({ version: SCHEMA_VERSION, mistakes: ["x"] }));
    expect(result.ok && result.progress.mistakes).toEqual(["x"]);
  });
});
