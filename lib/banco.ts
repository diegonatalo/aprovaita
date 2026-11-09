import { listarTopicos } from "./content";
import type { Area, Questao, Subarea } from "./tipos";

export interface InfoTopico {
  titulo: string;
  area: Area;
  subarea?: Subarea;
}

/** Banco completo (autorais + banca) e títulos dos tópicos, para passar a componentes client. */
export function carregarBanco() {
  const topicos = listarTopicos();
  const questoes: Questao[] = topicos.flatMap((t) => [...t.autorais, ...t.banca]);
  const info: Record<string, InfoTopico> = {};
  for (const t of topicos) info[`${t.area}/${t.slug}`] = { titulo: t.titulo, area: t.area, subarea: t.subarea };
  return { questoes, info };
}
