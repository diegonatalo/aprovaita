import { listTopics } from "./content";
import type { Area, Question, Subarea } from "@/types";

export interface TopicInfo {
  title: string;
  area: Area;
  subarea?: Subarea;
}

/** Banco completo (autorais + banca) e títulos dos tópicos, para passar a componentes client. */
export function loadBank() {
  const topics = listTopics();
  const questions: Question[] = topics.flatMap((t) => [...t.authored, ...t.exam]);
  const info: Record<string, TopicInfo> = {};
  for (const t of topics) info[`${t.area}/${t.slug}`] = { title: t.title, area: t.area, subarea: t.subarea };
  return { questions, info };
}
