// Fonte única dos parâmetros da prova (Edital 01/2026, Retificação nº 01).
import type { Area, Subarea } from "../lib/tipos";

export const PROVA = {
  orgao: "Câmara Municipal da Estância Balneária de Itanhaém",
  banca: "VUNESP",
  cargo: "Agente Administrativo",
  dataProva: "2026-12-06T08:00:00-03:00", // manhã; horário exato VERIFICAR no edital
  duracaoMinutos: 180,
  notaCorte: 50,
  totalQuestoes: 40,
  /** Questões por área (Retificação nº 01). */
  distribuicao: {
    portugues: 8,
    matematica: 5,
    legislacao: 3,
    especificos: 24,
  } satisfies Record<Area, number>,
  /**
   * SUPOSIÇÃO: o edital não divide as 24 questões de Específicos.
   * Altere aqui se descobrir a divisão real. A soma deve ser 24.
   */
  especificosPorSubarea: {
    "administracao-geral": 10,
    arquivologia: 6,
    "administracao-publica": 8,
  } satisfies Record<Subarea, number>,
} as const;

export const NOMES_AREA: Record<Area, string> = {
  portugues: "Língua Portuguesa",
  matematica: "Matemática",
  legislacao: "Legislação Municipal",
  especificos: "Conhecimentos Específicos",
};

export const NOMES_SUBAREA: Record<Subarea, string> = {
  "administracao-geral": "Administração Geral",
  arquivologia: "Arquivologia",
  "administracao-publica": "Administração Pública",
};

export const notaDe = (acertos: number) =>
  (acertos * 100) / PROVA.totalQuestoes;
