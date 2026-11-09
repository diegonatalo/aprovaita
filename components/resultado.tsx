"use client";

import { useState } from "react";
import { QuestionView } from "./question-view";
import { NOMES_AREA, PROVA } from "@/lib/prova";
import { corrigir } from "@/lib/correcao";
import { formatarNota, formatarTempo } from "@/lib/formato";
import type { InfoTopico } from "@/lib/banco";
import type { Tentativa } from "@/lib/storage";
import type { Area, Questao } from "@/types";

function Barra({ acertos, total }: { acertos: number; total: number }) {
  const pct = total ? (acertos / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-borda" aria-hidden>
        <div className="h-full rounded-full bg-acento" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-14 text-right text-sm tabular-nums">
        {acertos}/{total}
      </span>
    </div>
  );
}

export function Resultado({
  tentativa,
  banco,
  info,
  onVoltar,
}: {
  tentativa: Tentativa;
  banco: Record<string, Questao>;
  info: Record<string, InfoTopico>;
  onVoltar: () => void;
}) {
  const [filtro, setFiltro] = useState<"todas" | "erradas" | "branco">("todas");
  const questoes = tentativa.ordem.map((id) => banco[id]).filter(Boolean);
  const c = corrigir(questoes, tentativa.respostas);
  const topicosOrdenados = Object.entries(c.porTopico).sort(
    ([, a], [, b]) => a.acertos / a.total - b.acertos / b.total,
  );

  const visiveis = questoes
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => {
      const r = tentativa.respostas[q.id] ?? null;
      if (filtro === "erradas") return r !== null && r !== q.gabarito;
      if (filtro === "branco") return r === null;
      return true;
    });

  return (
    <div className="space-y-6">
      <button onClick={onVoltar} className="text-sm font-medium text-acento">
        ← Voltar aos simulados
      </button>
      <header className="space-y-2 card p-4">
        <h1 className="font-display text-xl font-bold text-muted">Resultado — Simulado {tentativa.simulado}</h1>
        <p className="font-display text-6xl font-extrabold tabular-nums text-acento">{formatarNota(c.nota)}</p>
        {c.habilitado === null ? (
          <p className="rounded-xl border border-aviso bg-aviso/10 p-3 text-sm text-aviso">
            Simulado reduzido ({c.total} questões, banco ainda incompleto). A nota é acertos × 100 ÷ {c.total}
            e <strong>não é comparável</strong> com o corte da prova ({PROVA.notaCorte} pontos = 20 de 40).
          </p>
        ) : (
          <p className={`font-semibold ${c.habilitado ? "text-acerto" : "text-erro"}`}>
            {c.habilitado ? "Habilitado" : "Não habilitado"} (corte: {PROVA.notaCorte})
          </p>
        )}
        <p className="text-sm text-muted">
          {c.acertos} acertos · {c.erros} erros · {c.emBranco} em branco · tempo: {formatarTempo(tentativa.segundos)}
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-lg font-bold">Desempenho por área</h2>
        <div className="space-y-2">
          {(Object.keys(c.porArea) as Area[]).map((a) => (
            <div key={a}>
              <p className="text-sm font-medium">{NOMES_AREA[a]}</p>
              <Barra {...c.porArea[a]} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-bold">Por tópico (do mais fraco ao mais forte)</h2>
        <div className="space-y-2">
          {topicosOrdenados.map(([chave, d]) => (
            <div key={chave}>
              <p className="text-sm font-medium">{info[chave]?.titulo ?? chave}</p>
              <Barra {...d} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-auto text-lg font-bold">Gabarito comentado</h2>
          {(
            [
              ["todas", "Todas"],
              ["erradas", "Erradas"],
              ["branco", "Em branco"],
            ] as const
          ).map(([v, r]) => (
            <button
              key={v}
              onClick={() => setFiltro(v)}
              aria-pressed={filtro === v}
              className="chip"
            >
              {r}
            </button>
          ))}
        </div>
        {visiveis.length === 0 && <p className="text-sm text-muted">Nenhuma questão neste filtro.</p>}
        {visiveis.map(({ q, i }) => (
          <QuestionView key={q.id} questao={q} numero={i + 1} escolha={tentativa.respostas[q.id] ?? null} revelar />
        ))}
      </section>
    </div>
  );
}
