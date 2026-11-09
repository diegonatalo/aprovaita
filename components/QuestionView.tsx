"use client";

import { Markdown } from "./Markdown";
import type { Questao } from "@/lib/tipos";

const LETRAS = ["A", "B", "C", "D", "E"] as const;

/** Mostra uma questão. Com `revelar`, destaca gabarito e exibe o comentário. */
export function QuestionView({
  questao,
  numero,
  escolha,
  onEscolher,
  revelar,
  mostrarSituacao = true,
}: {
  questao: Questao;
  numero: number;
  escolha: number | null;
  onEscolher?: (i: number) => void;
  revelar: boolean;
  mostrarSituacao?: boolean;
}) {
  const nome = `q-${questao.id}`;
  return (
    <fieldset className="card p-4 sm:p-5">
      <legend className="float-left mb-3 w-full text-xs font-semibold text-muted">
        <span className="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-acento-suave px-2 font-display text-acento">
          {numero}
        </span>
        {questao.origem === "banca" && questao.fonte
          ? `${questao.fonte.orgao} ${questao.fonte.ano}, ${questao.fonte.cargo}, nº ${questao.fonte.numero}`
          : "Questão autoral"}
      </legend>
      <Markdown className="clear-both mb-4 leading-relaxed">{questao.enunciado}</Markdown>
      <div className="space-y-2.5">
        {questao.alternativas.map((alt, i) => {
          const certa = revelar && i === questao.gabarito;
          const errada = revelar && escolha === i && i !== questao.gabarito;
          const marcada = escolha === i;
          return (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-[0.92rem] transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-acento active:scale-[0.99] ${
                certa
                  ? "border-acerto bg-acerto/10"
                  : errada
                    ? "border-erro bg-erro/10"
                    : marcada
                      ? "border-acento bg-acento-suave"
                      : "border-borda hover:border-acento/60"
              }`}
            >
              <input
                type="radio"
                name={nome}
                className="peer sr-only"
                checked={marcada}
                disabled={revelar || !onEscolher}
                onChange={() => onEscolher?.(i)}
              />
              <span
                aria-hidden
                className={`mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  certa
                    ? "border-acerto bg-acerto text-background"
                    : errada
                      ? "border-erro bg-erro text-background"
                      : marcada
                        ? "border-acento bg-acento text-background"
                        : "border-borda text-muted"
                }`}
              >
                {LETRAS[i]}
              </span>
              <Markdown inline className="pt-0.5">{alt}</Markdown>
            </label>
          );
        })}
      </div>
      {revelar && (
        <div className="mt-4 rounded-xl bg-card-2 p-3.5 text-sm">
          <p className="font-semibold">
            Gabarito: {LETRAS[questao.gabarito]}
            {mostrarSituacao &&
              (escolha === null ? (
                <span className="text-muted"> · não respondida</span>
              ) : escolha === questao.gabarito ? (
                <span className="text-acerto"> · você acertou</span>
              ) : (
                <span className="text-erro"> · você errou</span>
              ))}
          </p>
          {questao.origem === "banca" && questao.fonte && (
            <p className="mt-1 text-xs text-muted">Fonte do gabarito: {questao.fonte.gabaritoFonte} (preliminar; alterações pós-recurso não conferidas)</p>
          )}
          <Markdown className="mt-1.5 text-muted">{questao.comentario}</Markdown>
        </div>
      )}
    </fieldset>
  );
}
