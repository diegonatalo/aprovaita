"use client";

import { useMemo, useState } from "react";
import { QuestionView } from "./question-view";
import { AREA_NAMES } from "@/lib/exam";
import { recordMistakes, useProgress } from "@/lib/storage";
import type { TopicInfo } from "@/lib/bank";
import type { Area, Question } from "@/types";

export const ReviewApp = ({
  questions,
  info,
}: {
  questions: Question[];
  info: Record<string, TopicInfo>;
}) => {
  const { mistakes } = useProgress();
  const [area, setArea] = useState<Area | "todas">("todas");
  const [topic, setTopic] = useState("todos");
  const [practicing, setPracticing] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [graded, setGraded] = useState(false);

  const fromNotebook = useMemo(() => {
    const ids = new Set(mistakes);
    return questions.filter((q) => ids.has(q.id));
  }, [mistakes, questions]);

  const availableTopics = [...new Set(fromNotebook.map((q) => `${q.area}/${q.topicSlug}`))].filter(
    (k) => area === "todas" || k.startsWith(`${area}/`),
  );
  const filtered = fromNotebook.filter(
    (q) =>
      (area === "todas" || q.area === area) &&
      (topic === "todos" || `${q.area}/${q.topicSlug}` === topic),
  );

  function begin() {
    setPracticing(filtered);
    setAnswers(filtered.map(() => null));
    setGraded(false);
  }

  function gradePractice() {
    if (!practicing) return;
    recordMistakes(
      practicing.filter((q, i) => answers[i] !== q.answerKey).map((q) => q.id),
      practicing.filter((q, i) => answers[i] === q.answerKey).map((q) => q.id),
    );
    setGraded(true);
  }

  if (practicing) {
    const correct = practicing.filter((q, i) => answers[i] === q.answerKey).length;
    return (
      <div className="space-y-4">
        <button onClick={() => setPracticing(null)} className="text-sm font-medium text-acento">
          ← Voltar ao caderno
        </button>
        <h1 className="font-display text-3xl font-extrabold">Refazer erros</h1>
        {practicing.map((q, i) => (
          <QuestionView
            key={q.id}
            question={q}
            number={i + 1}
            choice={answers[i]}
            reveal={graded}
            onChoose={(alt) => setAnswers((r) => r.map((v, k) => (k === i ? alt : v)))}
          />
        ))}
        {graded ? (
          <p className="font-semibold">
            Você acertou {correct} de {practicing.length}. As acertadas saíram do caderno de erros.
          </p>
        ) : (
          <button
            onClick={gradePractice}
            disabled={answers.some((r) => r === null)}
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
          {fromNotebook.length} questão(ões) errada(s). Acertar uma questão ao refazê-la a tira do caderno.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-muted">Área</span>
          <select
            value={area}
            onChange={(e) => {
              setArea(e.target.value as Area | "todas");
              setTopic("todos");
            }}
            className="campo"
          >
            <option value="todas">Todas</option>
            {(Object.keys(AREA_NAMES) as Area[]).map((a) => (
              <option key={a} value={a}>
                {AREA_NAMES[a]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-muted">Tópico</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="campo max-w-xs"
          >
            <option value="todos">Todos</option>
            {availableTopics.map((k) => (
              <option key={k} value={k}>
                {info[k]?.title ?? k}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={begin}
          disabled={filtered.length === 0}
          className="self-end btn btn-primary"
        >
          Refazer só os erros ({filtered.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-borda p-4 text-sm text-muted">
          Nada no caderno para este filtro.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((q, i) => (
            <QuestionView key={q.id} question={q} number={i + 1} choice={null} reveal showStatus={false} />
          ))}
        </div>
      )}
    </div>
  );
};
