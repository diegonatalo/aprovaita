"use client";

import { useMemo, useState } from "react";
import { QuestionView } from "./QuestionView";
import { NOMES_AREA } from "@/config/prova";
import { registrarErros, useProgresso } from "@/lib/storage";
import type { InfoTopico } from "@/lib/banco";
import type { Area, Questao } from "@/lib/tipos";

export function RevisaoApp({
  questoes,
  info,
}: {
  questoes: Questao[];
  info: Record<string, InfoTopico>;
}) {
  const { erros } = useProgresso();
  const [area, setArea] = useState<Area | "todas">("todas");
  const [topico, setTopico] = useState("todos");
  const [praticando, setPraticando] = useState<Questao[] | null>(null);
  const [respostas, setRespostas] = useState<(number | null)[]>([]);
  const [corrigido, setCorrigido] = useState(false);

  const doCaderno = useMemo(() => {
    const ids = new Set(erros);
    return questoes.filter((q) => ids.has(q.id));
  }, [erros, questoes]);

  const topicosDisponiveis = [...new Set(doCaderno.map((q) => `${q.area}/${q.topicoSlug}`))].filter(
    (k) => area === "todas" || k.startsWith(`${area}/`),
  );
  const filtradas = doCaderno.filter(
    (q) =>
      (area === "todas" || q.area === area) &&
      (topico === "todos" || `${q.area}/${q.topicoSlug}` === topico),
  );

  function comecar() {
    setPraticando(filtradas);
    setRespostas(filtradas.map(() => null));
    setCorrigido(false);
  }

  function corrigirPratica() {
    if (!praticando) return;
    registrarErros(
      praticando.filter((q, i) => respostas[i] !== q.gabarito).map((q) => q.id),
      praticando.filter((q, i) => respostas[i] === q.gabarito).map((q) => q.id),
    );
    setCorrigido(true);
  }

  if (praticando) {
    const acertos = praticando.filter((q, i) => respostas[i] === q.gabarito).length;
    return (
      <div className="space-y-4">
        <button onClick={() => setPraticando(null)} className="text-sm font-medium text-acento">
          ← Voltar ao caderno
        </button>
        <h1 className="font-display text-3xl font-extrabold">Refazer erros</h1>
        {praticando.map((q, i) => (
          <QuestionView
            key={q.id}
            questao={q}
            numero={i + 1}
            escolha={respostas[i]}
            revelar={corrigido}
            onEscolher={(alt) => setRespostas((r) => r.map((v, k) => (k === i ? alt : v)))}
          />
        ))}
        {corrigido ? (
          <p className="font-semibold">
            Você acertou {acertos} de {praticando.length}. As acertadas saíram do caderno de erros.
          </p>
        ) : (
          <button
            onClick={corrigirPratica}
            disabled={respostas.some((r) => r === null)}
            className="btn btn-primary"
          >
            Corrigir
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold">Caderno de erros</h1>
        <p className="text-sm text-muted">
          {doCaderno.length} questão(ões) errada(s). Acertar uma questão ao refazê-la a tira do caderno.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-muted">Área</span>
          <select
            value={area}
            onChange={(e) => {
              setArea(e.target.value as Area | "todas");
              setTopico("todos");
            }}
            className="campo"
          >
            <option value="todas">Todas</option>
            {(Object.keys(NOMES_AREA) as Area[]).map((a) => (
              <option key={a} value={a}>
                {NOMES_AREA[a]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">Tópico</span>
          <select
            value={topico}
            onChange={(e) => setTopico(e.target.value)}
            className="campo max-w-xs"
          >
            <option value="todos">Todos</option>
            {topicosDisponiveis.map((k) => (
              <option key={k} value={k}>
                {info[k]?.titulo ?? k}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={comecar}
          disabled={filtradas.length === 0}
          className="self-end btn btn-primary"
        >
          Refazer só os erros ({filtradas.length})
        </button>
      </div>

      {filtradas.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-borda p-4 text-sm text-muted">
          Nada no caderno para este filtro.
        </p>
      ) : (
        <div className="space-y-4">
          {filtradas.map((q, i) => (
            <QuestionView key={q.id} questao={q} numero={i + 1} escolha={null} revelar mostrarSituacao={false} />
          ))}
        </div>
      )}
    </div>
  );
}
