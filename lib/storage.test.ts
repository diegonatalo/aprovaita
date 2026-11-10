import { beforeEach, describe, expect, it } from "vitest";
import {
  clearProgress,
  exportProgress,
  importProgress,
  recordMistakes,
  recordQuiz,
  saveAttempt,
  setTopicStatus,
  topicKey,
  SCHEMA_VERSION,
  type Attempt,
  type Progress,
} from "@/lib/storage";

const KEY = "aprovaita:progress:v1";
const read = () => JSON.parse(exportProgress()) as Progress;

const attempt = (id: string): Attempt => ({
  id,
  mockExam: "A",
  startedAt: "2026-01-01T10:00:00.000Z",
  seconds: 600,
  order: ["1"],
  answers: { "1": 0 },
  correct: 1,
  total: 1,
  score: 100,
  partial: true,
  qualified: null,
  byArea: { portugues: { correct: 1, total: 1 } },
});

beforeEach(() => {
  localStorage.clear();
  clearProgress();
});

describe("progresso", () => {
  it("começa vazio", () => {
    expect(read()).toEqual({
      version: SCHEMA_VERSION,
      topics: {},
      quizzes: {},
      mistakes: [],
      attempts: [],
    });
  });

  it("monta a chave do tópico", () => {
    expect(topicKey("portugues", "crase")).toBe("portugues/crase");
  });

  it("grava o status de um tópico e persiste no localStorage", () => {
    setTopicStatus("portugues/crase", "mastered");
    expect(read().topics).toEqual({ "portugues/crase": "mastered" });
    expect(JSON.parse(localStorage.getItem(KEY)!).topics).toEqual({
      "portugues/crase": "mastered",
    });
  });

  it("registra o resultado do quiz e atualiza o caderno de erros", () => {
    recordMistakes(["q1", "q2"], []);
    recordQuiz("portugues/crase", "A", { correct: 1, total: 2, data: "x" }, ["q3"], ["q1"]);

    const progress = read();
    expect(progress.quizzes["portugues/crase"].A).toEqual({ correct: 1, total: 2, data: "x" });
    expect(progress.mistakes.sort()).toEqual(["q2", "q3"]);
  });

  it("não repete questões no caderno de erros", () => {
    recordMistakes(["q1"], []);
    recordMistakes(["q1"], []);
    expect(read().mistakes).toEqual(["q1"]);
  });

  it("guarda as tentativas de simulado em ordem", () => {
    saveAttempt(attempt("a"));
    saveAttempt(attempt("b"));
    expect(read().attempts.map((a) => a.id)).toEqual(["a", "b"]);
  });

  it("clearProgress apaga tudo", () => {
    setTopicStatus("portugues/crase", "seen");
    clearProgress();
    expect(read().topics).toEqual({});
  });
});

describe("importProgress", () => {
  it("restaura um backup exportado", () => {
    setTopicStatus("matematica/porcentagem", "seen");
    const backup = exportProgress();
    clearProgress();

    expect(importProgress(backup)).toEqual({ ok: true });
    expect(read().topics).toEqual({ "matematica/porcentagem": "seen" });
  });

  it("recusa JSON inválido", () => {
    expect(importProgress("{não é json")).toEqual({ ok: false, error: "JSON inválido." });
  });

  it("recusa arquivo sem versão", () => {
    const result = importProgress(JSON.stringify({ topics: {} }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/backup/);
  });

  it("descarta dado salvo em outra versão do formato", () => {
    setTopicStatus("a/b", "seen");
    importProgress(JSON.stringify({ version: 1, topics: { "x/y": "seen" } }));
    expect(read().topics).toEqual({});
  });

  it("ignora campos com tipo errado", () => {
    importProgress(JSON.stringify({ version: SCHEMA_VERSION, topics: [], mistakes: "x" }));
    const progress = read();
    expect(progress.topics).toEqual({});
    expect(progress.mistakes).toEqual([]);
  });
});
