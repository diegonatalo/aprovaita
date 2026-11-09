import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Area, Question, Subarea, Topic } from "@/types";

const ROOT = path.join(process.cwd(), "content");
export const AREAS: Area[] = ["portugues", "matematica", "legislacao", "especificos"];

function readJson(file: string): Question[] {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as Question[];
}

/** Um tópico é qualquer pasta que contenha explicacao.mdx. O slug é único por área. */
export function listTopics(): Topic[] {
  const out: Topic[] = [];
  const visit = (dir: string, area: Area, subarea?: Subarea) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const folder = path.join(dir, e.name);
      const md = path.join(folder, "explicacao.mdx");
      if (fs.existsSync(md)) {
        const { data, content } = matter(fs.readFileSync(md, "utf8"));
        out.push({
          area,
          subarea,
          slug: e.name,
          title: String(data.title),
          order: Number(data.order ?? 0),
          summary: String(data.summary ?? ""),
          sourceStatus: data.sourceStatus === "PENDING_SOURCE" ? "PENDING_SOURCE" : "ok",
          content,
          authored: readJson(path.join(folder, "questoes-autorais.json")),
          exam: readJson(path.join(folder, "questoes-banca.json")),
        });
      } else if (area === "especificos" && !subarea) {
        visit(folder, area, e.name as Subarea);
      }
    }
  };
  for (const a of AREAS) visit(path.join(ROOT, a), a);
  // Específicos: subáreas na ordem do edital; dentro de cada uma, pelo campo "ordem".
  const SUBAREA_ORDER = ["administracao-geral", "arquivologia", "administracao-publica"];
  const pos = (t: Topic) => (t.subarea ? SUBAREA_ORDER.indexOf(t.subarea) : 0);
  return out.sort((x, y) => pos(x) - pos(y) || x.order - y.order || x.title.localeCompare(y.title));
}

export const areaTopics = (a: Area) => listTopics().filter((t) => t.area === a);
export const findTopic = (a: string, slug: string) =>
  listTopics().find((t) => t.area === a && t.slug === slug);
