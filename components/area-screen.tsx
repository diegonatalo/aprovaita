import Link from "next/link";
import { AREA_NAMES, SUBAREA_NAMES, EXAM } from "@/lib/exam";
import { areaTopics } from "@/lib/content";
import { TopicStatusLabel } from "@/components/status-buttons";
import type { Area } from "@/types";

/** Os tópicos de uma área de estudo. */
export const AreaScreen = ({ area: a }: { area: Area }) => {
  const topics = areaTopics(a);

  return (
    <div className="space-y-6">
      <header>
        <Link href="/app/conteudo" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-accent">
          <span aria-hidden>←</span> Estudar
        </Link>
        <h1 className="font-display text-3xl font-extrabold">{AREA_NAMES[a]}</h1>
        <p className="text-muted">{EXAM.distribution[a]} questões na prova · {topics.length} tópicos</p>
      </header>
      {topics.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">
          Nenhum tópico escrito nesta área ainda.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {topics.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/app/conteudo/${t.area}/${t.slug}`}
                className="card card-link flex items-start justify-between gap-3 p-4"
              >
                <span>
                  {t.subarea && <span className="eyebrow block">{SUBAREA_NAMES[t.subarea]}</span>}
                  <span className="font-display text-[1.05rem] font-bold leading-snug">{t.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{t.summary}</span>
                  {t.sourceStatus === "PENDING_SOURCE" && (
                    <span className="text-xs font-semibold text-error">PENDENTE_FONTE</span>
                  )}
                </span>
                <TopicStatusLabel topicKey={`${t.area}/${t.slug}`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
