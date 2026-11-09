import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Area, Questao, Subarea, Topico } from "./tipos";

const RAIZ = path.join(process.cwd(), "content");
export const AREAS: Area[] = ["portugues", "matematica", "legislacao", "especificos"];

function lerJson(arquivo: string): Questao[] {
  if (!fs.existsSync(arquivo)) return [];
  return JSON.parse(fs.readFileSync(arquivo, "utf8")) as Questao[];
}

/** Um tópico é qualquer pasta que contenha explicacao.mdx. O slug é único por área. */
export function listarTopicos(): Topico[] {
  const out: Topico[] = [];
  const visitar = (dir: string, area: Area, subarea?: Subarea) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const pasta = path.join(dir, e.name);
      const md = path.join(pasta, "explicacao.mdx");
      if (fs.existsSync(md)) {
        const { data, content } = matter(fs.readFileSync(md, "utf8"));
        out.push({
          area,
          subarea,
          slug: e.name,
          titulo: String(data.titulo),
          ordem: Number(data.ordem ?? 0),
          resumo: String(data.resumo ?? ""),
          statusFonte: data.statusFonte === "PENDENTE_FONTE" ? "PENDENTE_FONTE" : "ok",
          conteudo: content,
          autorais: lerJson(path.join(pasta, "questoes-autorais.json")),
          banca: lerJson(path.join(pasta, "questoes-banca.json")),
        });
      } else if (area === "especificos" && !subarea) {
        visitar(pasta, area, e.name as Subarea);
      }
    }
  };
  for (const a of AREAS) visitar(path.join(RAIZ, a), a);
  // Específicos: subáreas na ordem do edital; dentro de cada uma, pelo campo "ordem".
  const ORDEM_SUBAREA = ["administracao-geral", "arquivologia", "administracao-publica"];
  const pos = (t: Topico) => (t.subarea ? ORDEM_SUBAREA.indexOf(t.subarea) : 0);
  return out.sort((x, y) => pos(x) - pos(y) || x.ordem - y.ordem || x.titulo.localeCompare(y.titulo));
}

export const topicosDaArea = (a: Area) => listarTopicos().filter((t) => t.area === a);
export const acharTopico = (a: string, slug: string) =>
  listarTopicos().find((t) => t.area === a && t.slug === slug);
