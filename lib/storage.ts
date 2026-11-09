"use client";

import { useSyncExternalStore } from "react";
import type { TopicStatus } from "@/types";

const STORAGE_KEY = "concurso-itanhaem:progresso";
export const SCHEMA_VERSION = 2;

export interface QuizResult {
  correct: number;
  total: number;
  data: string; // ISO
}

export interface Attempt {
  id: string;
  mockExam: "A" | "B";
  startedAt: string;
  seconds: number; // tempo gasto
  order: string[]; // ids das questões, na ordem da prova
  answers: Record<string, number | null>; // questaoId -> alternativa
  correct: number;
  total: number;
  score: number;
  partial: boolean; // simulado reduzido (banco incompleto)
  qualified: boolean | null;
  byArea: Record<string, { correct: number; total: number }>;
}

/** Prova em andamento (sobrevive a recarregar a página). */
export interface ExamSession {
  mockExam: "A" | "B";
  startedAt: string;
  order: string[];
  answers: Record<string, number | null>;
  flagged: string[]; // "revisar depois"
  remainingSeconds: number;
  durationSeconds: number;
  current: number;
}

export interface Progress {
  version: number;
  topics: Record<string, TopicStatus>; // "area/slug"
  quizzes: Record<string, { A?: QuizResult; B?: QuizResult }>;
  mistakes: string[]; // ids de questões erradas (caderno de erros)
  attempts: Attempt[];
}

const EMPTY: Progress = {
  version: SCHEMA_VERSION,
  topics: {},
  quizzes: {},
  mistakes: [],
  attempts: [],
};

// Formato 1 (campos em português) → formato 2 (campos em inglês). Lê dados salvos no navegador
// e backups exportados antes da troca, para ninguém perder o progresso.
type Loose = Record<string, unknown>;

const isObject = (v: unknown): v is Loose => !!v && typeof v === "object" && !Array.isArray(v);

function renameKeys(o: unknown, map: Record<string, string>): Loose {
  const out: Loose = {};
  if (!isObject(o)) return out;
  for (const [k, v] of Object.entries(o)) out[map[k] ?? k] = v;
  return out;
}

const LEGACY_STATUS: Record<string, TopicStatus> = {
  "nao-visto": "unseen",
  visto: "seen",
  dominado: "mastered",
};
const LEGACY_PROGRESS = { versao: "version", topicos: "topics", erros: "mistakes", tentativas: "attempts" };
const LEGACY_RESULT = { acertos: "correct" };
const LEGACY_ATTEMPT = {
  simulado: "mockExam",
  inicio: "startedAt",
  segundos: "seconds",
  ordem: "order",
  respostas: "answers",
  acertos: "correct",
  nota: "score",
  parcial: "partial",
  habilitado: "qualified",
  porArea: "byArea",
};
const LEGACY_EXAM_SESSION = {
  simulado: "mockExam",
  inicio: "startedAt",
  ordem: "order",
  respostas: "answers",
  marcadas: "flagged",
  restanteSegundos: "remainingSeconds",
  duracaoSegundos: "durationSeconds",
  atual: "current",
};

function migrateAttempt(a: unknown): Attempt {
  const r = renameKeys(a, LEGACY_ATTEMPT);
  const byArea: Loose = {};
  for (const [area, v] of Object.entries(isObject(r.byArea) ? r.byArea : {})) byArea[area] = renameKeys(v, LEGACY_RESULT);
  return { ...r, byArea } as unknown as Attempt;
}

function migrate(raw: unknown): Progress {
  if (!isObject(raw)) return EMPTY;
  const b = renameKeys(raw, LEGACY_PROGRESS);
  const topics: Record<string, TopicStatus> = {};
  for (const [k, v] of Object.entries(isObject(b.topics) ? b.topics : {})) {
    topics[k] = LEGACY_STATUS[String(v)] ?? (v as TopicStatus);
  }
  const quizzes: Progress["quizzes"] = {};
  for (const [k, v] of Object.entries(isObject(b.quizzes) ? b.quizzes : {})) {
    const q = isObject(v) ? v : {};
    quizzes[k] = {
      ...(q.A ? { A: renameKeys(q.A, LEGACY_RESULT) as unknown as QuizResult } : {}),
      ...(q.B ? { B: renameKeys(q.B, LEGACY_RESULT) as unknown as QuizResult } : {}),
    };
  }
  return {
    version: SCHEMA_VERSION,
    topics,
    quizzes,
    mistakes: Array.isArray(b.mistakes) ? (b.mistakes as string[]) : [],
    attempts: Array.isArray(b.attempts) ? b.attempts.map(migrateAttempt) : [],
  };
}

function migrateExamSession(raw: unknown): ExamSession | null {
  if (!isObject(raw)) return null;
  return renameKeys(raw, LEGACY_EXAM_SESSION) as unknown as ExamSession;
}

let cachedText: string | null | undefined;
let cachedObject: Progress = EMPTY;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function snapshot(): Progress {
  const text = readRaw();
  if (text !== cachedText) {
    cachedText = text;
    try {
      cachedObject = text ? migrate(JSON.parse(text)) : EMPTY;
    } catch {
      cachedObject = EMPTY;
    }
  }
  return cachedObject;
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // armazenamento indisponível ou cheio: o progresso não persiste
  }
  listeners.forEach((f) => f());
}

function subscribe(f: () => void) {
  listeners.add(f);
  window.addEventListener("storage", f);
  return () => {
    listeners.delete(f);
    window.removeEventListener("storage", f);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export const topicKey = (area: string, slug: string) => `${area}/${slug}`;

export function setTopicStatus(topicKey: string, status: TopicStatus) {
  const p = snapshot();
  save({ ...p, topics: { ...p.topics, [topicKey]: status } });
}

export function recordQuiz(
  topicKey: string,
  quiz: "A" | "B",
  r: QuizResult,
  wrongIds: string[],
  correctIds: string[],
) {
  const p = snapshot();
  const mistakes = new Set(p.mistakes);
  wrongIds.forEach((i) => mistakes.add(i));
  correctIds.forEach((i) => mistakes.delete(i));
  save({
    ...p,
    quizzes: { ...p.quizzes, [topicKey]: { ...p.quizzes[topicKey], [quiz]: r } },
    mistakes: [...mistakes],
  });
}

export function exportProgress(): string {
  return JSON.stringify(snapshot(), null, 2);
}

export function importProgress(text: string): { ok: boolean; error?: string } {
  try {
    const obj = JSON.parse(text);
    if (typeof obj !== "object" || obj === null || typeof (obj.version ?? obj.versao) !== "number") {
      return { ok: false, error: "Arquivo não parece ser um backup de progresso." };
    }
    save(migrate(obj));
    return { ok: true };
  } catch {
    return { ok: false, error: "JSON inválido." };
  }
}

export function clearProgress() {
  save(EMPTY);
}

export function recordMistakes(wrongIds: string[], correctIds: string[]) {
  const p = snapshot();
  const mistakes = new Set(p.mistakes);
  wrongIds.forEach((i) => mistakes.add(i));
  correctIds.forEach((i) => mistakes.delete(i));
  save({ ...p, mistakes: [...mistakes] });
}

export function saveAttempt(t: Attempt) {
  const p = snapshot();
  save({ ...p, attempts: [...p.attempts, t] });
}

// --- prova em andamento (chave separada; gravar não notifica, para não re-renderizar a cada tique) ---
const EXAM_SESSION_STORAGE_KEY = "concurso-itanhaem:andamento";
const examSessionListeners = new Set<() => void>();
let examSessionText: string | null | undefined;
let examSessionObject: ExamSession | null = null;

function readRawExamSession(): string | null {
  try {
    return localStorage.getItem(EXAM_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function examSessionSnapshot(): ExamSession | null {
  const t = readRawExamSession();
  if (t !== examSessionText) {
    examSessionText = t;
    try {
      examSessionObject = t ? migrateExamSession(JSON.parse(t)) : null;
    } catch {
      examSessionObject = null;
    }
  }
  return examSessionObject;
}

export function useExamSession(): ExamSession | null {
  return useSyncExternalStore(
    (f) => {
      examSessionListeners.add(f);
      return () => examSessionListeners.delete(f);
    },
    examSessionSnapshot,
    () => null,
  );
}

export function saveExamSession(a: ExamSession, notify = false) {
  try {
    localStorage.setItem(EXAM_SESSION_STORAGE_KEY, JSON.stringify(a));
  } catch {}
  if (notify) examSessionListeners.forEach((f) => f());
}

export function clearExamSession() {
  try {
    localStorage.removeItem(EXAM_SESSION_STORAGE_KEY);
  } catch {}
  examSessionListeners.forEach((f) => f());
}
