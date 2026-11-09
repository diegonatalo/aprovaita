// Fonte única dos parâmetros da prova (Edital 01/2026, Retificação nº 01).
import type { Area, Subarea } from "@/types";

export const EXAM = {
  agency: "Câmara Municipal da Estância Balneária de Itanhaém",
  exam: "VUNESP",
  position: "Agente Administrativo",
  examDate: "2026-12-06T08:00:00-03:00", // manhã; horário exato VERIFICAR no edital
  durationMinutes: 180,
  cutoffScore: 50,
  totalQuestions: 40,
  /** Questões por área (Retificação nº 01). */
  distribution: {
    portugues: 8,
    matematica: 5,
    legislacao: 3,
    especificos: 24,
  } satisfies Record<Area, number>,
  /**
   * SUPOSIÇÃO: o edital não divide as 24 questões de Específicos.
   * Altere aqui se descobrir a divisão real. A soma deve ser 24.
   */
  specificsBySubarea: {
    "administracao-geral": 10,
    arquivologia: 6,
    "administracao-publica": 8,
  } satisfies Record<Subarea, number>,
} as const;

export const AREA_NAMES: Record<Area, string> = {
  portugues: "Língua Portuguesa",
  matematica: "Matemática",
  legislacao: "Legislação Municipal",
  especificos: "Conhecimentos Específicos",
};

export const SUBAREA_NAMES: Record<Subarea, string> = {
  "administracao-geral": "Administração Geral",
  arquivologia: "Arquivologia",
  "administracao-publica": "Administração Pública",
};

export const scoreOf = (correct: number) =>
  (correct * 100) / EXAM.totalQuestions;
