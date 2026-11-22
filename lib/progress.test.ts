import { describe, expect, it } from "vitest";
import {
  EMPTY_PROGRESS,
  SCHEMA_VERSION,
  backupJson,
  type Progress,
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
  const attempt = {
    id: "t1",
    mockExam: "A",
    startedAt: "2026-11-20T10:00:00.000Z",
    seconds: 600,
    order: ["q1", "q2"],
    answers: { q1: 0, q2: null },
    correct: 1,
    total: 2,
    score: 50,
    partial: true,
    qualified: null,
    byArea: { portugues: { correct: 1, total: 2 } },
  };
  const progress = {
    ...EMPTY_PROGRESS,
    topics: { "portugues/crase": "seen" },
    quizzes: { "portugues/crase": { A: { correct: 3, total: 5, data: "2026-11-20" } } },
    mistakes: ["q2"],
    attempts: [attempt],
  };

  it("lê o que o exportar gera", () => {
    const result = parseBackup(backupJson(progress as Progress));
    expect(result).toEqual({ ok: true, progress });
  });

  it("aceita backup de antes do campo app, se o formato inteiro bate", () => {
    expect(parseBackup(JSON.stringify(progress)).ok).toBe(true);
  });

  it("recusa JSON inválido", () => {
    expect(parseBackup("{")).toEqual({ ok: false, error: "JSON inválido." });
  });

  it("recusa arquivo de outro app, mesmo com a mesma versão", () => {
    // um backup do fiinance também tem "version": 2
    const fiinance = { version: 2, assets: [], transactions: [], payouts: [], quotes: {}, paperTarget: null };
    expect(parseBackup(JSON.stringify(fiinance)).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ ...progress, app: "fiinance" })).ok).toBe(false);
    expect(parseBackup('{"a":1}').ok).toBe(false);
  });

  it("recusa outra versão em vez de importar um progresso vazio", () => {
    for (const version of [1, 999, "2"]) {
      const result = parseBackup(JSON.stringify({ ...progress, version }));
      expect(result).toEqual({ ok: false, error: expect.stringMatching(/outra versão/) });
    }
  });

  it("recusa o arquivo inteiro se um registro estiver quebrado", () => {
    expect(parseBackup(JSON.stringify({ ...progress, attempts: [null] })).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ ...progress, attempts: [{ ...attempt, score: "50" }] })).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ ...progress, topics: { x: "talvez" } })).ok).toBe(false);
    expect(parseBackup(JSON.stringify({ ...progress, mistakes: [1] })).ok).toBe(false);
    const withoutAttempts: Partial<typeof progress> = { ...progress };
    delete withoutAttempts.attempts;
    expect(parseBackup(JSON.stringify(withoutAttempts)).ok).toBe(false);
  });
});
