"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_PROGRESS,
  parseBackup,
  parseProgress,
  withAttempt,
  withMistakes,
  withQuiz,
  withTopicStatus,
  type Attempt,
  type Progress,
  type QuizResult,
} from "@/lib/progress";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import type { TopicStatus } from "@/types";

let cachedText: string | null | undefined;
let cachedObject: Progress = EMPTY_PROGRESS;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.progress);
  } catch {
    return null;
  }
}

function snapshot(): Progress {
  const text = readRaw();
  if (text !== cachedText) {
    cachedText = text;
    try {
      cachedObject = text ? parseProgress(JSON.parse(text)) : EMPTY_PROGRESS;
    } catch {
      cachedObject = EMPTY_PROGRESS;
    }
  }
  return cachedObject;
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(p));
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

/** Progresso salvo no navegador; vazio no servidor e antes da hidratação. */
export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY_PROGRESS);
}

export function setTopicStatus(key: string, status: TopicStatus) {
  save(withTopicStatus(snapshot(), key, status));
}

export function recordQuiz(key: string, quiz: "A" | "B", r: QuizResult, wrongIds: string[], correctIds: string[]) {
  save(withQuiz(snapshot(), key, quiz, r, wrongIds, correctIds));
}

export function recordMistakes(wrongIds: string[], correctIds: string[]) {
  save(withMistakes(snapshot(), wrongIds, correctIds));
}

export function saveAttempt(t: Attempt) {
  save(withAttempt(snapshot(), t));
}

export function exportProgress(): string {
  return JSON.stringify(snapshot(), null, 2);
}

export function importProgress(text: string): { ok: boolean; error?: string } {
  const result = parseBackup(text);
  if (!result.ok) return { ok: false, error: result.error };
  save(result.progress);
  return { ok: true };
}

export function clearProgress() {
  save(EMPTY_PROGRESS);
}
