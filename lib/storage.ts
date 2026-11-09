"use client";

import { useSyncExternalStore } from "react";
import type { StatusTopico } from "./tipos";

const CHAVE = "concurso-itanhaem:progresso";
export const VERSAO_SCHEMA = 1;

export interface ResultadoQuiz {
  acertos: number;
  total: number;
  data: string; // ISO
}

export interface Tentativa {
  id: string;
  simulado: "A" | "B";
  inicio: string;
  segundos: number; // tempo gasto
  ordem: string[]; // ids das questões, na ordem da prova
  respostas: Record<string, number | null>; // questaoId -> alternativa
  acertos: number;
  total: number;
  nota: number;
  parcial: boolean; // simulado reduzido (banco incompleto)
  habilitado: boolean | null;
  porArea: Record<string, { acertos: number; total: number }>;
}

/** Prova em andamento (sobrevive a recarregar a página). */
export interface Andamento {
  simulado: "A" | "B";
  inicio: string;
  ordem: string[];
  respostas: Record<string, number | null>;
  marcadas: string[]; // "revisar depois"
  restanteSegundos: number;
  duracaoSegundos: number;
  atual: number;
}

export interface Progresso {
  versao: number;
  topicos: Record<string, StatusTopico>; // "area/slug"
  quizzes: Record<string, { A?: ResultadoQuiz; B?: ResultadoQuiz }>;
  erros: string[]; // ids de questões erradas (caderno de erros)
  tentativas: Tentativa[];
}

const VAZIO: Progresso = {
  versao: VERSAO_SCHEMA,
  topicos: {},
  quizzes: {},
  erros: [],
  tentativas: [],
};

function migrar(bruto: unknown): Progresso {
  if (!bruto || typeof bruto !== "object") return VAZIO;
  const b = bruto as Partial<Progresso>;
  // Quando existir versão 2+, migre aqui com base em b.versao.
  return {
    versao: VERSAO_SCHEMA,
    topicos: b.topicos ?? {},
    quizzes: b.quizzes ?? {},
    erros: b.erros ?? [],
    tentativas: b.tentativas ?? [],
  };
}

let cacheTexto: string | null | undefined;
let cacheObj: Progresso = VAZIO;
const ouvintes = new Set<() => void>();

function lerBruto(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

function snapshot(): Progresso {
  const texto = lerBruto();
  if (texto !== cacheTexto) {
    cacheTexto = texto;
    try {
      cacheObj = texto ? migrar(JSON.parse(texto)) : VAZIO;
    } catch {
      cacheObj = VAZIO;
    }
  }
  return cacheObj;
}

function salvar(p: Progresso) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p));
  } catch {
    // armazenamento indisponível ou cheio: o progresso não persiste
  }
  ouvintes.forEach((f) => f());
}

function assinar(f: () => void) {
  ouvintes.add(f);
  window.addEventListener("storage", f);
  return () => {
    ouvintes.delete(f);
    window.removeEventListener("storage", f);
  };
}

export function useProgresso(): Progresso {
  return useSyncExternalStore(assinar, snapshot, () => VAZIO);
}

export const chaveTopico = (area: string, slug: string) => `${area}/${slug}`;

export function definirStatus(chave: string, status: StatusTopico) {
  const p = snapshot();
  salvar({ ...p, topicos: { ...p.topicos, [chave]: status } });
}

export function registrarQuiz(
  chave: string,
  quiz: "A" | "B",
  r: ResultadoQuiz,
  idsErrados: string[],
  idsCertos: string[],
) {
  const p = snapshot();
  const erros = new Set(p.erros);
  idsErrados.forEach((i) => erros.add(i));
  idsCertos.forEach((i) => erros.delete(i));
  salvar({
    ...p,
    quizzes: { ...p.quizzes, [chave]: { ...p.quizzes[chave], [quiz]: r } },
    erros: [...erros],
  });
}

export function exportarProgresso(): string {
  return JSON.stringify(snapshot(), null, 2);
}

export function importarProgresso(texto: string): { ok: boolean; erro?: string } {
  try {
    const obj = JSON.parse(texto);
    if (typeof obj !== "object" || obj === null || typeof obj.versao !== "number") {
      return { ok: false, erro: "Arquivo não parece ser um backup de progresso." };
    }
    salvar(migrar(obj));
    return { ok: true };
  } catch {
    return { ok: false, erro: "JSON inválido." };
  }
}

export function limparProgresso() {
  salvar(VAZIO);
}

export function registrarErros(idsErrados: string[], idsCertos: string[]) {
  const p = snapshot();
  const erros = new Set(p.erros);
  idsErrados.forEach((i) => erros.add(i));
  idsCertos.forEach((i) => erros.delete(i));
  salvar({ ...p, erros: [...erros] });
}

export function salvarTentativa(t: Tentativa) {
  const p = snapshot();
  salvar({ ...p, tentativas: [...p.tentativas, t] });
}

// --- prova em andamento (chave separada; gravar não notifica, para não re-renderizar a cada tique) ---
const CHAVE_ANDAMENTO = "concurso-itanhaem:andamento";
const ouvintesAndamento = new Set<() => void>();
let andamentoTexto: string | null | undefined;
let andamentoObj: Andamento | null = null;

function lerAndamentoBruto(): string | null {
  try {
    return localStorage.getItem(CHAVE_ANDAMENTO);
  } catch {
    return null;
  }
}

function snapshotAndamento(): Andamento | null {
  const t = lerAndamentoBruto();
  if (t !== andamentoTexto) {
    andamentoTexto = t;
    try {
      andamentoObj = t ? (JSON.parse(t) as Andamento) : null;
    } catch {
      andamentoObj = null;
    }
  }
  return andamentoObj;
}

export function useAndamento(): Andamento | null {
  return useSyncExternalStore(
    (f) => {
      ouvintesAndamento.add(f);
      return () => ouvintesAndamento.delete(f);
    },
    snapshotAndamento,
    () => null,
  );
}

export function salvarAndamento(a: Andamento, notificar = false) {
  try {
    localStorage.setItem(CHAVE_ANDAMENTO, JSON.stringify(a));
  } catch {}
  if (notificar) ouvintesAndamento.forEach((f) => f());
}

export function limparAndamento() {
  try {
    localStorage.removeItem(CHAVE_ANDAMENTO);
  } catch {}
  ouvintesAndamento.forEach((f) => f());
}
