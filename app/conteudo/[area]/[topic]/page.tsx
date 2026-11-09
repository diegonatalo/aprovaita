import Link from "next/link";
import { notFound } from "next/navigation";
import { AREA_NAMES } from "@/lib/exam";
import { findTopic, listTopics } from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { QuizCard } from "@/components/quiz-card";
import { StatusButtons } from "@/components/status-buttons";
import type { Area } from "@/types";

export function generateStaticParams() {
  return listTopics().map((t) => ({ area: t.area, topic: t.slug }));
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ area: string; topic: string }>;
}) {
  const { area, topic } = await params;
  const t = findTopic(area, topic);
  if (!t) notFound();
  const topicKey = `${t.area}/${t.slug}`;

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <Link href={`/conteudo/${t.area}`} className="inline-flex items-center gap-1 text-sm font-medium text-acento">
          <span aria-hidden>←</span> {AREA_NAMES[t.area as Area]}
        </Link>
        <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.title}</h1>
        {t.summary && <p className="max-w-[68ch] text-lg text-muted">{t.summary}</p>}
        {t.sourceStatus === "PENDING_SOURCE" && (
          <p className="rounded-xl border border-erro bg-erro/10 p-3 text-sm text-erro">
            PENDENTE_FONTE: este tópico depende do texto oficial e ainda não foi conferido.
          </p>
        )}
        <StatusButtons topicKey={topicKey} />
      </header>

      <div className="card p-4 sm:p-8">
        <Markdown className="prose-estudo">{t.content}</Markdown>
      </div>

      <QuizCard topicKey={topicKey} quiz="A" questions={t.authored} />
      <QuizCard topicKey={topicKey} quiz="B" questions={t.exam} />
    </article>
  );
}
