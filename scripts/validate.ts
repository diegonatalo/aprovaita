// npm run validate — falha (exit 1) se o conteúdo violar as regras do projeto.
import { EXAM } from "@/lib/exam";
import { listTopics } from "@/lib/content";
import { gaps } from "@/lib/mock-exam";
import type { Question } from "@/types";

const STRICT = process.argv.includes("--strict"); // exige banco completo p/ montar simulados
const mistakes: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();

const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);
if (sum(EXAM.distribution) !== EXAM.totalQuestions) {
  mistakes.push(`config: distribuição soma ${sum(EXAM.distribution)}, esperado ${EXAM.totalQuestions}`);
}
if (sum(EXAM.specificsBySubarea) !== EXAM.distribution.especificos) {
  mistakes.push(
    `config: subáreas de Específicos somam ${sum(EXAM.specificsBySubarea)}, esperado ${EXAM.distribution.especificos}`,
  );
}

const topics = listTopics();
const bank: Question[] = [];

function check(q: Question, where: string, expected: "authored" | "exam", slug: string, area: string) {
  const r = `${where} (${q.id ?? "sem id"})`;
  if (!q.id) mistakes.push(`${r}: sem id`);
  else if (ids.has(q.id)) mistakes.push(`${r}: id duplicado`);
  else ids.add(q.id);
  if (q.origin !== expected) mistakes.push(`${r}: origem "${q.origin}" em arquivo de questões ${expected}s`);
  if (q.topicSlug !== slug) mistakes.push(`${r}: topicoSlug "${q.topicSlug}" ≠ pasta "${slug}"`);
  if (q.area !== area) mistakes.push(`${r}: area "${q.area}" ≠ pasta "${area}"`);
  if (!Array.isArray(q.choices) || q.choices.length !== 5)
    mistakes.push(`${r}: precisa ter exatamente 5 alternativas`);
  else if (q.choices.some((a) => typeof a !== "string" || !a.trim()))
    mistakes.push(`${r}: alternativa vazia`);
  if (![0, 1, 2, 3, 4].includes(q.answerKey as number)) mistakes.push(`${r}: gabarito ausente ou inválido`);
  if (!q.statement?.trim()) mistakes.push(`${r}: enunciado vazio`);
  if (!q.explanation?.trim()) mistakes.push(`${r}: comentário vazio`);
  if (q.origin === "exam") {
    const f = q.source;
    if (!f || !f.agency || !f.position || !Number.isInteger(f.year) || !Number.isInteger(f.number))
      mistakes.push(`${r}: questão da banca sem fonte completa (orgao, ano, cargo, numero)`);
    else if (!f.answerKeySource?.trim())
      mistakes.push(`${r}: questão da banca sem "gabaritoFonte" (documento oficial do gabarito)`);
  } else if (q.source) {
    mistakes.push(`${r}: questão autoral não pode ter "fonte" (evita passar autoral por banca)`);
  }
  if (area === "especificos" && !q.subarea) mistakes.push(`${r}: Específicos exige subarea`);
}

for (const t of topics) {
  const where = `${t.area}/${t.slug}`;
  if (!t.title || t.title === "undefined") mistakes.push(`${where}: sem título no frontmatter`);
  if (t.sourceStatus === "PENDING_SOURCE") warnings.push(`${where}: PENDENTE_FONTE`);
  if (/VERIFICAR/.test(t.content)) warnings.push(`${where}: contém marcas VERIFICAR`);
  t.authored.forEach((q) => check(q, where, "authored", t.slug, t.area));
  t.exam.forEach((q) => check(q, where, "exam", t.slug, t.area));
  if (t.exam.length === 0) warnings.push(`${where}: Quiz B vazio (aguardando provas reais)`);
  bank.push(...t.authored, ...t.exam);
}

for (const origin of ["authored", "exam"] as const) {
  const missing = gaps(bank, origin);
  for (const l of missing) {
    (STRICT ? mistakes : warnings).push(
      `simulado ${origin === "authored" ? "A" : "B"}: ${l.area}${l.subarea ? "/" + l.subarea : ""} tem ${l.isAvailable}/${l.required} questões`,
    );
  }
}

console.log(`${topics.length} tópico(s), ${bank.length} questão(ões).`);
if (warnings.length) {
  console.log(`\nAVISOS (${warnings.length}):`);
  warnings.forEach((a) => console.log("  - " + a));
}
if (mistakes.length) {
  console.error(`\nERROS (${mistakes.length}):`);
  mistakes.forEach((e) => console.error("  x " + e));
  process.exit(1);
}
console.log("\nValidação OK (avisos não bloqueiam; erros sim).");
