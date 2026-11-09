"use client";

import { useMemo, useState } from "react";
import { ProvaRunner } from "./ProvaRunner";
import { Resultado } from "./Resultado";
import { NOMES_AREA, NOMES_SUBAREA, PROVA } from "@/config/prova";
import { formatarData, formatarNota, formatarTempo } from "@/lib/formato";
import { duracaoSegundos, lacunas, montarSimulado } from "@/lib/simulado";
import {
  limparAndamento,
  salvarAndamento,
  useAndamento,
  useProgresso,
  type Andamento,
  type Tentativa,
} from "@/lib/storage";
import type { InfoTopico } from "@/lib/banco";
import type { Origem, Questao } from "@/lib/tipos";

type Tela =
  | { tipo: "home" }
  | { tipo: "prova"; inicial: Andamento }
  | { tipo: "resultado"; tentativa: Tentativa };

const ORIGEM: Record<"A" | "B", Origem> = { A: "autoral", B: "banca" };
const TITULO = { A: "Simulado A — questões autorais", B: "Simulado B — questões reais da banca" };

export function SimuladoApp({
  questoes,
  info,
}: {
  questoes: Questao[];
  info: Record<string, InfoTopico>;
}) {
  const [tela, setTela] = useState<Tela>({ tipo: "home" });
  const progresso = useProgresso();
  const andamento = useAndamento();
  const banco = useMemo(() => Object.fromEntries(questoes.map((q) => [q.id, q])), [questoes]);

  function iniciar(sim: "A" | "B") {
    const origem = ORIGEM[sim];
    const completo = lacunas(questoes, origem).length === 0;
    const evitar = new Set(
      progresso.tentativas.filter((t) => t.simulado === sim).flatMap((t) => t.ordem),
    );
    const sorteadas = montarSimulado(questoes, origem, { evitar, parcial: !completo });
    if (sorteadas.length === 0) return;
    const duracao = duracaoSegundos(sorteadas.length);
    const inicial: Andamento = {
      simulado: sim,
      inicio: new Date().toISOString(),
      ordem: sorteadas.map((q) => q.id),
      respostas: {},
      marcadas: [],
      restanteSegundos: duracao,
      duracaoSegundos: duracao,
      atual: 0,
    };
    salvarAndamento(inicial, true);
    setTela({ tipo: "prova", inicial });
  }

  if (tela.tipo === "prova") {
    return (
      <ProvaRunner
        inicial={tela.inicial}
        banco={banco}
        onFinalizada={(tentativa) => setTela({ tipo: "resultado", tentativa })}
      />
    );
  }
  if (tela.tipo === "resultado") {
    return <Resultado tentativa={tela.tentativa} banco={banco} info={info} onVoltar={() => setTela({ tipo: "home" })} />;
  }

  const tentativas = [...progresso.tentativas].reverse();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold">Simulados</h1>
        <p className="text-sm text-muted">
          40 questões (8 Português, 5 Matemática, 3 Legislação, 24 Específicos), {PROVA.duracaoMinutos / 60}h. Nota = acertos × 100 ÷ 40; habilitado com nota ≥ {PROVA.notaCorte}.
        </p>
      </header>

      {andamento && (
        <section className="space-y-3 rounded-2xl border-2 border-acento bg-acento-suave p-5">
          <h2 className="font-bold">Prova em andamento</h2>
          <p className="text-sm text-muted">
            Simulado {andamento.simulado} · restam {formatarTempo(andamento.restanteSegundos)} · {Object.values(andamento.respostas).filter((r) => r != null).length}/{andamento.ordem.length} respondidas
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTela({ tipo: "prova", inicial: andamento })} className="btn btn-primary">
              Retomar
            </button>
            <button
              onClick={() => {
                if (window.confirm("Descartar a prova em andamento? Ela não será corrigida.")) limparAndamento();
              }}
              className="btn btn-ghost"
            >
              Descartar
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(["A", "B"] as const).map((sim) => {
          const faltas = lacunas(questoes, ORIGEM[sim]);
          const disponiveis = questoes.filter((q) => q.origem === ORIGEM[sim]).length;
          const reduzido = montarSimulado(questoes, ORIGEM[sim], { parcial: true }).length;
          return (
            <section key={sim} className="space-y-3 card p-4">
              <h2 className="font-bold">{TITULO[sim]}</h2>
              <p className="text-sm text-muted">{disponiveis} questões no banco.</p>
              {faltas.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-aviso">
                    Banco incompleto: faltam questões em {faltas.length} grupo(s)
                  </summary>
                  <ul className="mt-2 list-disc pl-5 text-muted">
                    {faltas.map((l) => (
                      <li key={`${l.area}${l.subarea ?? ""}`}>
                        {l.subarea ? NOMES_SUBAREA[l.subarea] : NOMES_AREA[l.area]}: {l.disponivel} de {l.necessario}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <button
                onClick={() => iniciar(sim)}
                disabled={reduzido === 0 || !!andamento}
                className="btn btn-primary"
              >
                {faltas.length === 0
                  ? "Iniciar (40 questões)"
                  : reduzido === 0
                    ? "Sem questões disponíveis"
                    : `Iniciar simulado reduzido (${reduzido} questões)`}
              </button>
              {faltas.length === 0 && (
                <p className="text-xs text-muted">Cada novo simulado prefere questões que você ainda não fez.</p>
              )}
            </section>
          );
        })}
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Histórico</h2>
        {tentativas.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma tentativa ainda.</p>
        ) : (
          <>
            <div role="img" aria-label="Evolução das notas" className="flex h-28 items-end gap-1 card p-3">
              {[...tentativas].reverse().map((t) => (
                <div
                  key={t.id}
                  title={`${formatarData(t.inicio)}: ${formatarNota(t.nota)}${t.parcial ? " (reduzido)" : ""}`}
                  className={`min-w-2 flex-1 rounded-t-md ${t.parcial ? "bg-acento/40" : "bg-acento"}`}
                  style={{ height: `${Math.max(t.nota, 2)}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-muted">Barras claras: simulados reduzidos (nota sobre menos de 40 questões).</p>
            <ul className="space-y-2">
              {tentativas.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 card p-3 text-sm">
                  <span>
                    <strong>{formatarData(t.inicio)}</strong> · Simulado {t.simulado} · {t.acertos}/{t.total}
                    {t.parcial && " (reduzido)"} · {formatarTempo(t.segundos)}
                  </span>
                  <span className="flex items-center gap-3">
                    <strong className="tabular-nums">{formatarNota(t.nota)}</strong>
                    <button onClick={() => setTela({ tipo: "resultado", tentativa: t })} className="btn btn-ghost btn-sm">
                      Ver
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
