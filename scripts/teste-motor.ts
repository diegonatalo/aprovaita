// npm run test:motor — testes do sorteio e da correção, com um banco sintético (nunca vai para o site).
import assert from "node:assert/strict";
import { PROVA } from "../lib/prova";
import { corrigir } from "../lib/correcao";
import { duracaoSegundos, lacunas, montarSimulado } from "../lib/simulado";
import type { Area, Questao, Subarea } from "../types";

let n = 0;
function q(area: Area, subarea?: Subarea, gabarito: 0 | 1 | 2 | 3 | 4 = 0): Questao {
  n++;
  return {
    id: `T${n}`, area, subarea, topicoSlug: `t-${area}`, origem: "autoral",
    enunciado: "x", alternativas: ["a", "b", "c", "d", "e"], gabarito, comentario: "c",
  };
}
const banco: Questao[] = [];
const quantas = (a: Area, s: Subarea | undefined, k: number) => { for (let i = 0; i < k; i++) banco.push(q(a, s)); };
quantas("portugues", undefined, 12);
quantas("matematica", undefined, 8);
quantas("legislacao", undefined, 6);
quantas("especificos", "administracao-geral", 15);
quantas("especificos", "arquivologia", 9);
quantas("especificos", "administracao-publica", 11);

// banco completo: 8/5/3/24 sem repetição
const s = montarSimulado(banco, "autoral");
assert.equal(s.length, 40);
assert.equal(new Set(s.map((x) => x.id)).size, 40);
const cont = (a: Area) => s.filter((x) => x.area === a).length;
assert.deepEqual([cont("portugues"), cont("matematica"), cont("legislacao"), cont("especificos")], [8, 5, 3, 24]);
assert.equal(s.filter((x) => x.subarea === "arquivologia").length, PROVA.especificosPorSubarea.arquivologia);

// "questões novas": evitando as já usadas, sobra banco para outro simulado sem repetir quando possível
const usadas = new Set(s.map((x) => x.id));
const s2 = montarSimulado(banco, "autoral", { evitar: usadas });
assert.equal(s2.filter((x) => usadas.has(x.id)).length, 40 - s2.filter((x) => !usadas.has(x.id)).length);
assert.ok(s2.filter((x) => !usadas.has(x.id)).length > 0);

// banco insuficiente: erro sem `parcial`, reduzido com `parcial`
const pequeno = banco.slice(0, 5);
assert.ok(lacunas(pequeno, "autoral").length > 0);
assert.throws(() => montarSimulado(pequeno, "autoral"));
assert.equal(montarSimulado(pequeno, "autoral", { parcial: true }).length, 5);
assert.equal(lacunas(banco, "banca").length, 6, "sem questões da banca, todas as cotas ficam em falta");

// correção, prova completa: 20 acertos = nota 50 = habilitado; 19 = 47,5 = não
const gab = (k: number): Record<string, number | null> =>
  Object.fromEntries(s.map((x, i) => [x.id, i < k ? x.gabarito : (x.gabarito + 1) % 5]));
let c = corrigir(s, gab(20));
assert.equal(c.nota, 50); assert.equal(c.habilitado, true); assert.equal(c.parcial, false);
c = corrigir(s, gab(19));
assert.equal(c.nota, 47.5); assert.equal(c.habilitado, false);
// em branco não conta como acerto nem como erro
c = corrigir(s, Object.fromEntries(s.map((x) => [x.id, null])));
assert.equal(c.acertos, 0); assert.equal(c.emBranco, 40); assert.equal(c.erros, 0);
// reduzido: nota sobre o total, sem habilitação
c = corrigir(pequeno, Object.fromEntries(pequeno.map((x) => [x.id, x.gabarito])));
assert.equal(c.nota, 100); assert.equal(c.habilitado, null); assert.equal(c.parcial, true);
// desempenho por área soma o total
const pa = corrigir(s, gab(40)).porArea;
assert.equal(pa.especificos.total, 24);

assert.equal(duracaoSegundos(40), 10800);
assert.equal(duracaoSegundos(10), 2700);
console.log("teste-motor: OK");
