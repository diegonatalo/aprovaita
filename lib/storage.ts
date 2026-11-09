"use client";

import { useSyncExternalStore } from "react";
import type { TopicStatus } from "@/types";

const STORAGE_KEY = "aprovaita:progress:v1";
export const SCHEMA_VERSION = 2;

export type QuizResult = {
  correct: number;
  total: number;
  data: string; // ISO
};

export type Attempt = {
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
};

/** Prova em andamento (sobrevive a recarregar a página). */
export type ExamSession = {
  mockExam: "A" | "B";
  startedAt: string;
  order: string[];
  answers: Record<string, number | null>;
  flagged: string[]; // "revisar depois"
  remainingSeconds: number;
  durationSeconds: number;
  current: number;
};

export type Progress = {
  version: number;
  topics: Record<string, TopicStatus>; // "area/slug"
  quizzes: Record<string, { A?: QuizResult; B?: QuizResult }>;
  mistakes: string[]; // ids de questões erradas (caderno de erros)
  attempts: Attempt[];
};

const EMPTY: Progress = {
  version: SCHEMA_VERSION,
  topics: {},
  quizzes: {},
  mistakes: [],
  attempts: [],
};

// Lê só o formato atual. Dado salvo em outra versão é descartado.
type Loose = Record<string, unknown>;

const isObject = (v: unknown): v is Loose => !!v && typeof v === "object" && !Array.isArray(v);

function parseProgress(raw: unknown): Progress {
  if (!isObject(raw) || raw.version !== SCHEMA_VERSION) return EMPTY;
  return {
    version: SCHEMA_VERSION,
    topics: isObject(raw.topics) ? (raw.topics as Record<string, TopicStatus>) : {},
    quizzes: isObject(raw.quizzes) ? (raw.quizzes as Progress["quizzes"]) : {},
    mistakes: Array.isArray(raw.mistakes) ? (raw.mistakes as string[]) : [],
    attempts: Array.isArray(raw.attempts) ? (raw.attempts as Attempt[]) : [],
  };
}

function parseExamSession(raw: unknown): ExamSession | null {
  if (!isObject(raw) || !Array.isArray(raw.order)) return null;
  return raw as unknown as ExamSession;
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
      cachedObject = text ? parseProgress(JSON.parse(text)) : EMPTY;
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
    if (typeof obj !== "object" || obj === null || typeof obj.version !== "number") {
      return { ok: false, error: "Arquivo não parece ser um backup de progresso." };
    }
    save(parseProgress(obj));
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
const EXAM_SESSION_STORAGE_KEY = "aprovaita:exam-session:v1";
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
      examSessionObject = t ? parseExamSession(JSON.parse(t)) : null;
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
