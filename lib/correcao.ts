import { PROVA } from "@/lib/prova";
import type { Area, Questao } from "@/types";

export type Respostas = Record<string, number | null>;

export interface Desempenho {
  acertos: number;
  total: number;
}

export interface Correcao {
  acertos: number;
  erros: number;
  emBranco: number;
  total: number;
  /** Prova completa: acertos × 100 ÷ 40. Reduzida: acertos × 100 ÷ total (não comparável ao corte). */
  nota: number;
  parcial: boolean;
  habilitado: boolean | null; // null em simulado reduzido
  porArea: Record<Area, Desempenho>;
  porTopico: Record<string, Desempenho>; // "area/slug"
}

export function corrigir(questoes: Questao[], respostas: Respostas): Correcao {
  const porArea: Record<string, Desempenho> = {};
  const porTopico: Record<string, Desempenho> = {};
  let acertos = 0;
  let emBranco = 0;
  for (const q of questoes) {
    const r = respostas[q.id] ?? null;
    const certa = r === q.gabarito;
    if (r === null) emBranco++;
    if (certa) acertos++;
    const chave = `${q.area}/${q.topicoSlug}`;
    for (const [mapa, k] of [
      [porArea, q.area],
      [porTopico, chave],
    ] as const) {
      mapa[k] ??= { acertos: 0, total: 0 };
      mapa[k].total++;
      if (certa) mapa[k].acertos++;
    }
  }
  const total = questoes.length;
  const parcial = total !== PROVA.totalQuestoes;
  const nota = total === 0 ? 0 : (acertos * 100) / total;
  return {
    acertos,
    erros: total - acertos - emBranco,
    emBranco,
    total,
    nota,
    parcial,
    habilitado: parcial ? null : nota >= PROVA.notaCorte,
    porArea: porArea as Record<Area, Desempenho>,
    porTopico,
  };
}
