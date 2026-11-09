"use client";

import { useEffect, useRef, useState } from "react";
import { AnswerSheet } from "./AnswerSheet";
import { ExamTimer } from "./ExamTimer";
import { QuestionView } from "./QuestionView";
import { corrigir } from "@/lib/correcao";
import {
  limparAndamento,
  registrarErros,
  salvarAndamento,
  salvarTentativa,
  type Andamento,
  type Tentativa,
} from "@/lib/storage";
import type { Questao } from "@/lib/tipos";

export function ProvaRunner({
  inicial,
  banco,
  onFinalizada,
}: {
  inicial: Andamento;
  banco: Record<string, Questao>;
  onFinalizada: (t: Tentativa) => void;
}) {
  const questoes = inicial.ordem.map((id) => banco[id]).filter(Boolean);
  const [respostas, setRespostas] = useState(inicial.respostas);
  const [marcadas, setMarcadas] = useState(inicial.marcadas);
  const [atual, setAtual] = useState(Math.min(inicial.atual, questoes.length - 1));
  const [restante, setRestante] = useState(inicial.restanteSegundos);
  const [pausado, setPausado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [folhaAberta, setFolhaAberta] = useState(false);

  // Estado mais recente para o intervalo e para finalizar (evita closures velhas).
  const ultimo = useRef({ respostas, marcadas, atual, restante });
  useEffect(() => {
    ultimo.current = { respostas, marcadas, atual, restante };
  });
  const encerrada = useRef(false);

  function persistir() {
    const u = ultimo.current;
    salvarAndamento({
      ...inicial,
      respostas: u.respostas,
      marcadas: u.marcadas,
      atual: u.atual,
      restanteSegundos: u.restante,
    });
  }

  function finalizar() {
    if (encerrada.current) return;
    encerrada.current = true;
    const u = ultimo.current;
    const c = corrigir(questoes, u.respostas);
    const certos = questoes.filter((q) => u.respostas[q.id] === q.gabarito).map((q) => q.id);
    const errados = questoes
      .filter((q) => u.respostas[q.id] != null && u.respostas[q.id] !== q.gabarito)
      .map((q) => q.id);
    registrarErros(errados, certos);
    const tentativa: Tentativa = {
      id: `${inicial.simulado}-${Date.now()}`,
      simulado: inicial.simulado,
      inicio: inicial.inicio,
      segundos: inicial.duracaoSegundos - u.restante,
      ordem: questoes.map((q) => q.id),
      respostas: u.respostas,
      acertos: c.acertos,
      total: c.total,
      nota: c.nota,
      parcial: c.parcial,
      habilitado: c.habilitado,
      porArea: c.porArea,
    };
    salvarTentativa(tentativa);
    limparAndamento();
    onFinalizada(tentativa);
  }

  // Cronômetro: calcula pelo relógio (não perde tempo se a aba ficar em segundo plano).
  useEffect(() => {
    if (pausado) return;
    const fim = Date.now() + ultimo.current.restante * 1000;
    let tiques = 0;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((fim - Date.now()) / 1000));
      ultimo.current.restante = r;
      setRestante(r);
      if (++tiques % 10 === 0) persistir();
      if (r === 0) finalizar();
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pausado]);

  // Grava a cada ação do usuário.
  useEffect(() => {
    if (!encerrada.current) persistir();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [respostas, marcadas, atual, pausado]);

  const q = questoes[atual];
  const emBranco = questoes.filter((x) => respostas[x.id] == null).length;
  const marcada = marcadas.includes(q.id);

  return (
    <div className="space-y-4">
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-2 card p-3 lg:top-4">
        <ExamTimer restante={restante} pausado={pausado} onAlternarPausa={() => setPausado((p) => !p)} />
        <span className="text-sm text-muted">
          Simulado {inicial.simulado} · {questoes.length - emBranco}/{questoes.length} respondidas
        </span>
        <button onClick={() => setConfirmando(true)} className="btn btn-primary btn-sm">
          Finalizar
        </button>
      </div>

      {confirmando && (
        <div role="alertdialog" aria-label="Confirmar finalização" className="space-y-3 rounded-2xl border border-aviso bg-card p-4">
          <p className="font-semibold">
            Finalizar o simulado?{" "}
            {emBranco > 0 ? `${emBranco} questão(ões) em branco.` : "Todas respondidas."}
          </p>
          <div className="flex gap-2">
            <button onClick={finalizar} className="btn btn-primary">
              Sim, finalizar
            </button>
            <button onClick={() => setConfirmando(false)} className="btn btn-ghost">
              Voltar à prova
            </button>
          </div>
        </div>
      )}

      {pausado ? (
        <div className="rounded-2xl border border-dashed border-borda p-8 text-center">
          <p className="mb-3 font-semibold">Prova pausada</p>
          <button onClick={() => setPausado(false)} className="btn btn-primary">
            Continuar
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-3">
            <QuestionView
              questao={q}
              numero={atual + 1}
              escolha={respostas[q.id] ?? null}
              revelar={false}
              onEscolher={(i) => setRespostas((r) => ({ ...r, [q.id]: i }))}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAtual((a) => Math.max(0, a - 1))}
                disabled={atual === 0}
                className="btn btn-ghost"
              >
                Anterior
              </button>
              <button
                onClick={() => setAtual((a) => Math.min(questoes.length - 1, a + 1))}
                disabled={atual === questoes.length - 1}
                className="btn btn-ghost"
              >
                Próxima
              </button>
              <button
                onClick={() => setMarcadas((m) => (marcada ? m.filter((x) => x !== q.id) : [...m, q.id]))}
                aria-pressed={marcada}
                className={`btn ${marcada ? "border border-aviso bg-aviso/10 text-aviso" : "btn-ghost"}`}
              >
                {marcada ? "Marcada para revisar" : "Revisar depois"}
              </button>
              {respostas[q.id] != null && (
                <button
                  onClick={() => setRespostas((r) => ({ ...r, [q.id]: null }))}
                  className="btn btn-ghost text-muted"
                >
                  Limpar resposta
                </button>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <button
              onClick={() => setFolhaAberta((v) => !v)}
              aria-expanded={folhaAberta}
              className="mb-2 w-full btn btn-ghost btn-sm text-left text-sm font-semibold lg:hidden"
            >
              Folha de respostas {folhaAberta ? "▲" : "▼"}
            </button>
            <div className={`${folhaAberta ? "block" : "hidden"} card p-3 lg:block`}>
              <h2 className="mb-2 hidden text-sm font-semibold lg:block">Folha de respostas</h2>
              <AnswerSheet
                questoes={questoes}
                respostas={respostas}
                marcadas={marcadas}
                atual={atual}
                onIr={(i) => {
                  setAtual(i);
                  setFolhaAberta(false);
                }}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
