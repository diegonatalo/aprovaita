import { EXAM } from "@/lib/exam";
import type { Area, Origin, Question, Subarea } from "@/types";

/** Cotas por (área, subárea) para um simulado. */
export function quotas(): { area: Area; subarea?: Subarea; amount: number }[] {
  const { distribution, specificsBySubarea } = EXAM;
  const list: { area: Area; subarea?: Subarea; amount: number }[] = [
    { area: "portugues", amount: distribution.portugues },
    { area: "matematica", amount: distribution.matematica },
    { area: "legislacao", amount: distribution.legislacao },
  ];
  for (const [sub, q] of Object.entries(specificsBySubarea)) {
    list.push({ area: "especificos", subarea: sub as Subarea, amount: q });
  }
  return list;
}

export interface Gap {
  area: Area;
  subarea?: Subarea;
  required: number;
  isAvailable: number;
}

/** Quantas questões faltam no banco para montar um simulado completo. */
export function gaps(bank: Question[], origin: Origin): Gap[] {
  return quotas()
    .map((c) => ({
      area: c.area,
      subarea: c.subarea,
      required: c.amount,
      isAvailable: bank.filter(
        (q) => q.origin === origin && q.area === c.area && (!c.subarea || q.subarea === c.subarea),
      ).length,
    }))
    .filter((l) => l.isAvailable < l.required);
}

function shuffle<T>(list: T[], rand: () => number = Math.random): T[] {
  const a = [...list];
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
export function buildMockExam(
  bank: Question[],
  origin: Origin,
  options: { avoid?: Set<string>; partial?: boolean; rand?: () => number } = {},
): Question[] {
  const { avoid = new Set<string>(), partial = false, rand = Math.random } = options;
  if (!partial && gaps(bank, origin).length) {
    throw new Error("Banco insuficiente para montar o simulado.");
  }
  const chosen: Question[] = [];
  for (const c of quotas()) {
    const candidates = bank.filter(
      (q) => q.origin === origin && q.area === c.area && (!c.subarea || q.subarea === c.subarea),
    );
    // prefere questões ainda não usadas ("refazer com questões novas"), completa com as demais
    const newOnes = shuffle(candidates.filter((q) => !avoid.has(q.id)), rand);
    const old = shuffle(candidates.filter((q) => avoid.has(q.id)), rand);
    chosen.push(...[...newOnes, ...old].slice(0, c.amount));
  }
  return chosen;
}

/** Duração proporcional ao tamanho do simulado (180 min para 40 questões). */
export function durationSeconds(total: number): number {
  return Math.round((EXAM.durationMinutes * 60 * total) / EXAM.totalQuestions);
}
