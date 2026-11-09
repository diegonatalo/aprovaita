"use client";

import Link from "next/link";
import { AREA_NAMES, EXAM } from "@/lib/exam";
import { useProgress } from "@/lib/storage";
import { formatDate, formatScore } from "@/lib/format";
import type { Area } from "@/types";

export type TopicSummary = {
  topicKey: string; // "area/slug"
  area: Area;
  slug: string;
  title: string;
};

const AREAS: Area[] = ["especificos", "portugues", "matematica", "legislacao"];
const WEAK_THRESHOLD = 0.7;

const pct = (a: number, t: number) => (t ? Math.round((a / t) * 100) : 0);

const Bar = ({ value, label }: { value: number; label: string }) => {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2.5 w-full overflow-hidden rounded-full bg-borda"
    >
      <div className="h-full rounded-full bg-acento" style={{ width: `${value}%` }} />
    </div>
  );
};

export const ProgressPanel = ({ topics }: { topics: TopicSummary[] }) => {
  const p = useProgress();

  // desempenho nos quizzes por tópico (A + B somados)
  const performance = topics.map((t) => {
    const q = p.quizzes[t.topicKey];
    const correct = (q?.A?.correct ?? 0) + (q?.B?.correct ?? 0);
    const total = (q?.A?.total ?? 0) + (q?.B?.total ?? 0);
    return { ...t, correct, total, status: p.topics[t.topicKey] ?? "unseen" };
  });

  const byArea = AREAS.map((a) => {
    const ts = performance.filter((t) => t.area === a);
    const correct = ts.reduce((s, t) => s + t.correct, 0);
    const total = ts.reduce((s, t) => s + t.total, 0);
    const seenTopics = ts.filter((t) => t.status !== "unseen").length;
    return { area: a, correct, total, seenTopics, topics: ts.length };
  });

  const weak = performance
    .filter((t) => t.total >= 3 && t.correct / t.total < WEAK_THRESHOLD)
    .sort((x, y) => x.correct / x.total - y.correct / y.total)
    .slice(0, 5);

  // sugestão: o mais fraco; senão, o primeiro tópico não visto (Específicos primeiro, maior peso)
  const suggestion: { t: TopicSummary; reason: string } | null = weak[0]
    ? { t: weak[0], reason: `acertou ${pct(weak[0].correct, weak[0].total)}% nos quizzes — reveja a explicação e refaça.` }
    : (() => {
        const unseenTopic = AREAS.flatMap((a) => performance.filter((t) => t.area === a)).find(
          (t) => t.status === "unseen",
        );
        return unseenTopic ? { t: unseenTopic, reason: "ainda não visto." } : null;
      })();

  const fullAttempts = p.attempts.filter((t) => !t.partial);
  const latest = [...p.attempts].slice(-5).reverse();

  return (
    <div className="space-y-6">
      <section className="card p-4">
        <h2 className="mb-2 font-bold">Próximo passo</h2>
        {suggestion ? (
          <p className="text-sm">
            <Link href={`/conteudo/${suggestion.t.area}/${suggestion.t.slug}`} className="font-semibold text-acento underline">
              {suggestion.t.title}
            </Link>{" "}
            <span className="text-muted">({AREA_NAMES[suggestion.t.area]}): {suggestion.reason}</span>
          </p>
        ) : (
          <p className="text-sm text-muted">Todos os tópicos foram vistos e nenhum está fraco. Faça um simulado completo.</p>
        )}
        {p.mistakes.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            Você tem {p.mistakes.length} questão(ões) no{" "}
            <Link href="/revisao" className="text-acento underline">caderno de erros</Link>.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-bold">Por área</h2>
        {byArea.map((a) => (
          <div key={a.area} className="card p-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{AREA_NAMES[a.area]}</p>
              <p className="text-sm text-muted">
                {a.seenTopics}/{a.topics} tópicos vistos ·{" "}
                {a.total ? `${a.correct}/${a.total} acertos nos quizzes (${pct(a.correct, a.total)}%)` : "sem quizzes feitos"}
              </p>
            </div>
            <Bar value={pct(a.seenTopics, a.topics)} label={`Tópicos vistos em ${AREA_NAMES[a.area]}`} />
          </div>
        ))}
      </section>

      <section className="card p-4">
        <h2 className="mb-2 font-bold">Tópicos mais fracos</h2>
        {weak.length ? (
          <ul className="space-y-1 text-sm">
            {weak.map((t) => (
              <li key={t.topicKey} className="flex flex-wrap justify-between gap-2">
                <Link href={`/conteudo/${t.area}/${t.slug}`} className="text-acento underline">{t.title}</Link>
                <span className="text-muted">{t.correct}/{t.total} ({pct(t.correct, t.total)}%)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nenhum ainda. Aparecem aqui os tópicos com menos de 70% nos quizzes (mínimo de 3 questões respondidas).</p>
        )}
      </section>

      <section className="card p-4">
        <h2 className="mb-2 font-bold">Simulados</h2>
        {latest.length ? (
          <>
            <ul className="space-y-1 text-sm">
              {latest.map((t) => (
                <li key={t.id} className="flex flex-wrap justify-between gap-2">
                  <span>{formatDate(t.startedAt)} · simulado {t.mockExam}{t.partial ? " (reduzido)" : ""}</span>
                  <span className="text-muted">
                    {t.correct}/{t.total}
                    {!t.partial && ` · nota ${formatScore(t.score)}`}
                    {t.qualified === true && " · habilitado"}
                    {t.qualified === false && " · abaixo do corte"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">
              Corte: nota {EXAM.cutoffScore} (20 de 40). {fullAttempts.length} simulado(s) completo(s) feito(s).
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">Nenhum simulado feito ainda.</p>
        )}
      </section>

      <p className="rounded-2xl border border-dashed border-borda p-4 text-xs text-muted">
        <strong>Sobre os gabaritos:</strong> as questões da banca usam o gabarito preliminar divulgado pela VUNESP
        (edital de divulgação). Alterações pós-recurso não foram conferidas. A divisão dos 24 Específicos entre as
        subáreas nos simulados é uma suposição, pois o edital não a informa.
      </p>
    </div>
  );
};
