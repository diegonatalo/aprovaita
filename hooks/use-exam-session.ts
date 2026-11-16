"use client";

import { useSyncExternalStore } from "react";
import { parseExamSession, type ExamSession } from "@/lib/progress";
import { STORAGE_KEYS } from "@/lib/storage-keys";

// Prova em andamento (chave separada; gravar não notifica, para não re-renderizar a cada tique).
const listeners = new Set<() => void>();
let cachedText: string | null | undefined;
let cachedObject: ExamSession | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.examSession);
  } catch {
    return null;
  }
}

function snapshot(): ExamSession | null {
  const t = readRaw();
  if (t !== cachedText) {
    cachedText = t;
    try {
      cachedObject = t ? parseExamSession(JSON.parse(t)) : null;
    } catch {
      cachedObject = null;
    }
  }
  return cachedObject;
}

export function useExamSession(): ExamSession | null {
  return useSyncExternalStore(
    (f) => {
      listeners.add(f);
      return () => listeners.delete(f);
    },
    snapshot,
    () => null,
  );
}

export function saveExamSession(a: ExamSession, notify = false) {
  try {
    localStorage.setItem(STORAGE_KEYS.examSession, JSON.stringify(a));
  } catch {}
  if (notify) listeners.forEach((f) => f());
}

export function clearExamSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.examSession);
  } catch {}
  listeners.forEach((f) => f());
}
