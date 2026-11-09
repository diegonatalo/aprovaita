// pnpm test:engine — testes do sorteio e da correção, com um banco sintético (nunca vai para o site).
import assert from "node:assert/strict";
import { EXAM } from "@/lib/exam";
import { grade } from "@/lib/grading";
import { durationSeconds, gaps, buildMockExam } from "@/lib/mock-exam";
import type { Area, Question, Subarea } from "@/types";

let n = 0;
function q(area: Area, subarea?: Subarea, answerKey: 0 | 1 | 2 | 3 | 4 = 0): Question {
  n++;
  return {
    id: `T${n}`, area, subarea, topicSlug: `t-${area}`, origin: "authored",
    statement: "x", choices: ["a", "b", "c", "d", "e"], answerKey, explanation: "c",
  };
}
const bank: Question[] = [];
const howMany = (a: Area, s: Subarea | undefined, k: number) => { for (let i = 0; i < k; i++) bank.push(q(a, s)); };
howMany("portugues", undefined, 12);
howMany("matematica", undefined, 8);
howMany("legislacao", undefined, 6);
howMany("especificos", "administracao-geral", 15);
howMany("especificos", "arquivologia", 9);
howMany("especificos", "administracao-publica", 11);

// banco completo: 8/5/3/24 sem repetição
const s = buildMockExam(bank, "authored");
assert.equal(s.length, 40);
assert.equal(new Set(s.map((x) => x.id)).size, 40);
const count = (a: Area) => s.filter((x) => x.area === a).length;
assert.deepEqual([count("portugues"), count("matematica"), count("legislacao"), count("especificos")], [8, 5, 3, 24]);
assert.equal(s.filter((x) => x.subarea === "arquivologia").length, EXAM.specificsBySubarea.arquivologia);

// "questões novas": evitando as já usadas, sobra banco para outro simulado sem repetir quando possível
const used = new Set(s.map((x) => x.id));
const s2 = buildMockExam(bank, "authored", { avoid: used });
assert.equal(s2.filter((x) => used.has(x.id)).length, 40 - s2.filter((x) => !used.has(x.id)).length);
assert.ok(s2.filter((x) => !used.has(x.id)).length > 0);

// banco insuficiente: erro sem `parcial`, reduzido com `parcial`
const small = bank.slice(0, 5);
assert.ok(gaps(small, "authored").length > 0);
assert.throws(() => buildMockExam(small, "authored"));
assert.equal(buildMockExam(small, "authored", { partial: true }).length, 5);
assert.equal(gaps(bank, "exam").length, 6, "sem questões da banca, todas as cotas ficam em falta");

// correção, prova completa: 20 acertos = nota 50 = habilitado; 19 = 47,5 = não
const key = (k: number): Record<string, number | null> =>
  Object.fromEntries(s.map((x, i) => [x.id, i < k ? x.answerKey : (x.answerKey + 1) % 5]));
let c = grade(s, key(20));
assert.equal(c.score, 50); assert.equal(c.qualified, true); assert.equal(c.partial, false);
c = grade(s, key(19));
assert.equal(c.score, 47.5); assert.equal(c.qualified, false);
// em branco não conta como acerto nem como erro
c = grade(s, Object.fromEntries(s.map((x) => [x.id, null])));
assert.equal(c.correct, 0); assert.equal(c.blank, 40); assert.equal(c.mistakes, 0);
// reduzido: nota sobre o total, sem habilitação
c = grade(small, Object.fromEntries(small.map((x) => [x.id, x.answerKey])));
assert.equal(c.score, 100); assert.equal(c.qualified, null); assert.equal(c.partial, true);
// desempenho por área soma o total
const pa = grade(s, key(40)).byArea;
assert.equal(pa.especificos.total, 24);

assert.equal(durationSeconds(40), 10800);
assert.equal(durationSeconds(10), 2700);
console.log("engine-test: OK");
