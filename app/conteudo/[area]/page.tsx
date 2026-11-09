import Link from "next/link";
import { notFound } from "next/navigation";
import { NOMES_AREA, NOMES_SUBAREA, PROVA } from "@/lib/prova";
import { AREAS, topicosDaArea } from "@/lib/content";
import { StatusDoTopico } from "@/components/status-buttons";
import type { Area } from "@/types";

export function generateStaticParams() {
  return AREAS.map((area) => ({ area }));
}

export default async function PaginaArea({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  if (!AREAS.includes(area as Area)) notFound();
  const a = area as Area;
  const topicos = topicosDaArea(a);

  return (
    <div className="space-y-6">
      <header>
        <Link href="/conteudo/" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-acento">
          <span aria-hidden>←</span> Estudar
        </Link>
        <h1 className="font-display text-3xl font-extrabold">{NOMES_AREA[a]}</h1>
        <p className="text-muted">{PROVA.distribuicao[a]} questões na prova · {topicos.length} tópicos</p>
      </header>
      {topicos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-borda p-4 text-sm text-muted">
          Nenhum tópico escrito nesta área ainda.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {topicos.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/conteudo/${t.area}/${t.slug}/`}
                className="card card-link flex items-start justify-between gap-3 p-4"
              >
                <span>
                  {t.subarea && <span className="eyebrow block">{NOMES_SUBAREA[t.subarea]}</span>}
                  <span className="font-display text-[1.05rem] font-bold leading-snug">{t.titulo}</span>
                  <span className="mt-0.5 block text-sm text-muted">{t.resumo}</span>
                  {t.statusFonte === "PENDENTE_FONTE" && (
                    <span className="text-xs font-semibold text-erro">PENDENTE_FONTE</span>
                  )}
                </span>
                <StatusDoTopico chave={`${t.area}/${t.slug}`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
