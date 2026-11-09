import Link from "next/link";
import { notFound } from "next/navigation";
import { NOMES_AREA } from "@/lib/prova";
import { acharTopico, listarTopicos } from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { QuizCard } from "@/components/quiz-card";
import { StatusButtons } from "@/components/status-buttons";
import type { Area } from "@/types";

export function generateStaticParams() {
  return listarTopicos().map((t) => ({ area: t.area, topico: t.slug }));
}

export default async function PaginaTopico({
  params,
}: {
  params: Promise<{ area: string; topico: string }>;
}) {
  const { area, topico } = await params;
  const t = acharTopico(area, topico);
  if (!t) notFound();
  const chave = `${t.area}/${t.slug}`;

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <Link href={`/conteudo/${t.area}/`} className="inline-flex items-center gap-1 text-sm font-medium text-acento">
          <span aria-hidden>←</span> {NOMES_AREA[t.area as Area]}
        </Link>
        <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.titulo}</h1>
        {t.resumo && <p className="max-w-[68ch] text-lg text-muted">{t.resumo}</p>}
        {t.statusFonte === "PENDENTE_FONTE" && (
          <p className="rounded-xl border border-erro bg-erro/10 p-3 text-sm text-erro">
            PENDENTE_FONTE: este tópico depende do texto oficial e ainda não foi conferido.
          </p>
        )}
        <StatusButtons chave={chave} />
      </header>

      <div className="card p-4 sm:p-8">
        <Markdown className="prose-estudo">{t.conteudo}</Markdown>
      </div>

      <QuizCard chave={chave} quiz="A" questoes={t.autorais} />
      <QuizCard chave={chave} quiz="B" questoes={t.banca} />
    </article>
  );
}
