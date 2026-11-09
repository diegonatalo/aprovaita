"use client";

import { Markdown } from "./markdown";
import type { Question } from "@/types";

const LETTERS = ["A", "B", "C", "D", "E"] as const;

/** Mostra uma questão. Com `revelar`, destaca gabarito e exibe o comentário. */
export const QuestionView = ({
  question,
  number,
  choice,
  onChoose,
  reveal,
  showStatus = true,
}: {
  question: Question;
  number: number;
  choice: number | null;
  onChoose?: (i: number) => void;
  reveal: boolean;
  showStatus?: boolean;
}) => {
  const name = `q-${question.id}`;
  return (
    <fieldset className="card p-4 sm:p-5">
      <legend className="float-left mb-3 w-full text-xs font-semibold text-muted">
        <span className="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-acento-suave px-2 font-display text-acento">
          {number}
        </span>
        {question.origin === "exam" && question.source
          ? `${question.source.agency} ${question.source.year}, ${question.source.position}, nº ${question.source.number}`
          : "Questão autoral"}
      </legend>
      <Markdown className="clear-both mb-4 leading-relaxed">{question.statement}</Markdown>
      <div className="space-y-2.5">
        {question.choices.map((alt, i) => {
          const correctChoice = reveal && i === question.answerKey;
          const wrongChoice = reveal && choice === i && i !== question.answerKey;
          const flagged = choice === i;
          return (
            <label
              key={i}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-[0.92rem] transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-acento active:scale-[0.99] ${
                correctChoice
                  ? "border-acerto bg-acerto/10"
                  : wrongChoice
                    ? "border-erro bg-erro/10"
                    : flagged
                      ? "border-acento bg-acento-suave"
                      : "border-borda hover:border-acento/60"
              }`}
            >
              <input
                type="radio"
                name={name}
                className="peer sr-only"
                checked={flagged}
                disabled={reveal || !onChoose}
                onChange={() => onChoose?.(i)}
              />
              <span
                aria-hidden
                className={`mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  correctChoice
                    ? "border-acerto bg-acerto text-background"
                    : wrongChoice
                      ? "border-erro bg-erro text-background"
                      : flagged
                        ? "border-acento bg-acento text-background"
                        : "border-borda text-muted"
                }`}
              >
                {LETTERS[i]}
              </span>
              <Markdown inline className="pt-0.5">{alt}</Markdown>
            </label>
          );
        })}
      </div>
      {reveal && (
        <div className="mt-4 rounded-xl bg-card-2 p-3.5 text-sm">
          <p className="font-semibold">
            Gabarito: {LETTERS[question.answerKey]}
            {showStatus &&
              (choice === null ? (
                <span className="text-muted"> · não respondida</span>
              ) : choice === question.answerKey ? (
                <span className="text-acerto"> · você acertou</span>
              ) : (
                <span className="text-erro"> · você errou</span>
              ))}
          </p>
          {question.origin === "exam" && question.source && (
            <p className="mt-1 text-xs text-muted">Fonte do gabarito: {question.source.answerKeySource} (preliminar; alterações pós-recurso não conferidas)</p>
          )}
          <Markdown className="mt-1.5 text-muted">{question.explanation}</Markdown>
        </div>
      )}
    </fieldset>
  );
};
