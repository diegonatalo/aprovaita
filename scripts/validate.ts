// npm run validate — falha (exit 1) se o conteúdo violar as regras do projeto.
import { PROVA } from "@/lib/prova";
import { listarTopicos } from "@/lib/content";
import { lacunas } from "@/lib/simulado";
import type { Questao } from "@/types";

const ESTRITO = process.argv.includes("--strict"); // exige banco completo p/ montar simulados
const erros: string[] = [];
const avisos: string[] = [];
const ids = new Set<string>();

const soma = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);
if (soma(PROVA.distribuicao) !== PROVA.totalQuestoes) {
  erros.push(`config: distribuição soma ${soma(PROVA.distribuicao)}, esperado ${PROVA.totalQuestoes}`);
}
if (soma(PROVA.especificosPorSubarea) !== PROVA.distribuicao.especificos) {
  erros.push(
    `config: subáreas de Específicos somam ${soma(PROVA.especificosPorSubarea)}, esperado ${PROVA.distribuicao.especificos}`,
  );
}

const topicos = listarTopicos();
const banco: Questao[] = [];

function checar(q: Questao, onde: string, esperado: "autoral" | "banca", slug: string, area: string) {
  const r = `${onde} (${q.id ?? "sem id"})`;
  if (!q.id) erros.push(`${r}: sem id`);
  else if (ids.has(q.id)) erros.push(`${r}: id duplicado`);
  else ids.add(q.id);
  if (q.origem !== esperado) erros.push(`${r}: origem "${q.origem}" em arquivo de questões ${esperado}s`);
  if (q.topicoSlug !== slug) erros.push(`${r}: topicoSlug "${q.topicoSlug}" ≠ pasta "${slug}"`);
  if (q.area !== area) erros.push(`${r}: area "${q.area}" ≠ pasta "${area}"`);
  if (!Array.isArray(q.alternativas) || q.alternativas.length !== 5)
    erros.push(`${r}: precisa ter exatamente 5 alternativas`);
  else if (q.alternativas.some((a) => typeof a !== "string" || !a.trim()))
    erros.push(`${r}: alternativa vazia`);
  if (![0, 1, 2, 3, 4].includes(q.gabarito as number)) erros.push(`${r}: gabarito ausente ou inválido`);
  if (!q.enunciado?.trim()) erros.push(`${r}: enunciado vazio`);
  if (!q.comentario?.trim()) erros.push(`${r}: comentário vazio`);
  if (q.origem === "banca") {
    const f = q.fonte;
    if (!f || !f.orgao || !f.cargo || !Number.isInteger(f.ano) || !Number.isInteger(f.numero))
      erros.push(`${r}: questão da banca sem fonte completa (orgao, ano, cargo, numero)`);
    else if (!f.gabaritoFonte?.trim())
      erros.push(`${r}: questão da banca sem "gabaritoFonte" (documento oficial do gabarito)`);
  } else if (q.fonte) {
    erros.push(`${r}: questão autoral não pode ter "fonte" (evita passar autoral por banca)`);
  }
  if (area === "especificos" && !q.subarea) erros.push(`${r}: Específicos exige subarea`);
}

for (const t of topicos) {
  const onde = `${t.area}/${t.slug}`;
  if (!t.titulo || t.titulo === "undefined") erros.push(`${onde}: sem título no frontmatter`);
  if (t.statusFonte === "PENDENTE_FONTE") avisos.push(`${onde}: PENDENTE_FONTE`);
  if (/VERIFICAR/.test(t.conteudo)) avisos.push(`${onde}: contém marcas VERIFICAR`);
  t.autorais.forEach((q) => checar(q, onde, "autoral", t.slug, t.area));
  t.banca.forEach((q) => checar(q, onde, "banca", t.slug, t.area));
  if (t.banca.length === 0) avisos.push(`${onde}: Quiz B vazio (aguardando provas reais)`);
  banco.push(...t.autorais, ...t.banca);
}

for (const origem of ["autoral", "banca"] as const) {
  const faltas = lacunas(banco, origem);
  for (const l of faltas) {
    (ESTRITO ? erros : avisos).push(
      `simulado ${origem === "autoral" ? "A" : "B"}: ${l.area}${l.subarea ? "/" + l.subarea : ""} tem ${l.disponivel}/${l.necessario} questões`,
    );
  }
}

console.log(`${topicos.length} tópico(s), ${banco.length} questão(ões).`);
if (avisos.length) {
  console.log(`\nAVISOS (${avisos.length}):`);
  avisos.forEach((a) => console.log("  - " + a));
}
if (erros.length) {
  console.error(`\nERROS (${erros.length}):`);
  erros.forEach((e) => console.error("  x " + e));
  process.exit(1);
}
console.log("\nValidação OK (avisos não bloqueiam; erros sim).");
