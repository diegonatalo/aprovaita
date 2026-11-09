import { PROVA } from "@/lib/prova";
import type { Area, Origem, Questao, Subarea } from "../types";

/** Cotas por (área, subárea) para um simulado. */
export function cotas(): { area: Area; subarea?: Subarea; quantidade: number }[] {
  const { distribuicao, especificosPorSubarea } = PROVA;
  const lista: { area: Area; subarea?: Subarea; quantidade: number }[] = [
    { area: "portugues", quantidade: distribuicao.portugues },
    { area: "matematica", quantidade: distribuicao.matematica },
    { area: "legislacao", quantidade: distribuicao.legislacao },
  ];
  for (const [sub, q] of Object.entries(especificosPorSubarea)) {
    lista.push({ area: "especificos", subarea: sub as Subarea, quantidade: q });
  }
  return lista;
}

export interface Lacuna {
  area: Area;
  subarea?: Subarea;
  necessario: number;
  disponivel: number;
}

/** Quantas questões faltam no banco para montar um simulado completo. */
export function lacunas(banco: Questao[], origem: Origem): Lacuna[] {
  return cotas()
    .map((c) => ({
      area: c.area,
      subarea: c.subarea,
      necessario: c.quantidade,
      disponivel: banco.filter(
        (q) => q.origem === origem && q.area === c.area && (!c.subarea || q.subarea === c.subarea),
      ).length,
    }))
    .filter((l) => l.disponivel < l.necessario);
}

function embaralhar<T>(lista: T[], rand: () => number = Math.random): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sorteia um simulado respeitando as cotas, sem repetir questões.
 * Sem `parcial`, lança erro se faltar banco. Com `parcial`, usa o que existir em cada cota
 * (simulado reduzido: a nota dele não é comparável com o corte da prova real).
 */
export function montarSimulado(
  banco: Questao[],
  origem: Origem,
  opcoes: { evitar?: Set<string>; parcial?: boolean; rand?: () => number } = {},
): Questao[] {
  const { evitar = new Set<string>(), parcial = false, rand = Math.random } = opcoes;
  if (!parcial && lacunas(banco, origem).length) {
    throw new Error("Banco insuficiente para montar o simulado.");
  }
  const escolhidas: Questao[] = [];
  for (const c of cotas()) {
    const candidatas = banco.filter(
      (q) => q.origem === origem && q.area === c.area && (!c.subarea || q.subarea === c.subarea),
    );
    // prefere questões ainda não usadas ("refazer com questões novas"), completa com as demais
    const novas = embaralhar(candidatas.filter((q) => !evitar.has(q.id)), rand);
    const velhas = embaralhar(candidatas.filter((q) => evitar.has(q.id)), rand);
    escolhidas.push(...[...novas, ...velhas].slice(0, c.quantidade));
  }
  return escolhidas;
}

/** Duração proporcional ao tamanho do simulado (180 min para 40 questões). */
export function duracaoSegundos(total: number): number {
  return Math.round((PROVA.duracaoMinutos * 60 * total) / PROVA.totalQuestoes);
}
