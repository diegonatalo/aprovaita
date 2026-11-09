"use client";

import Link from "next/link";
import { NOMES_AREA, PROVA } from "@/config/prova";
import { useProgresso } from "@/lib/storage";
import { formatarData, formatarNota } from "@/lib/formato";
import type { Area } from "@/lib/tipos";

export interface TopicoResumo {
  chave: string; // "area/slug"
  area: Area;
  slug: string;
  titulo: string;
}

const AREAS: Area[] = ["especificos", "portugues", "matematica", "legislacao"];
const LIMITE_FRACO = 0.7;

const pct = (a: number, t: number) => (t ? Math.round((a / t) * 100) : 0);

function Barra({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuenow={valor}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2.5 w-full overflow-hidden rounded-full bg-borda"
    >
      <div className="h-full rounded-full bg-acento" style={{ width: `${valor}%` }} />
    </div>
  );
}

export function PainelProgresso({ topicos }: { topicos: TopicoResumo[] }) {
  const p = useProgresso();

  // desempenho nos quizzes por tópico (A + B somados)
  const desempenho = topicos.map((t) => {
    const q = p.quizzes[t.chave];
    const acertos = (q?.A?.acertos ?? 0) + (q?.B?.acertos ?? 0);
    const total = (q?.A?.total ?? 0) + (q?.B?.total ?? 0);
    return { ...t, acertos, total, status: p.topicos[t.chave] ?? "nao-visto" };
  });

  const porArea = AREAS.map((a) => {
    const ts = desempenho.filter((t) => t.area === a);
    const acertos = ts.reduce((s, t) => s + t.acertos, 0);
    const total = ts.reduce((s, t) => s + t.total, 0);
    const vistos = ts.filter((t) => t.status !== "nao-visto").length;
    return { area: a, acertos, total, vistos, topicos: ts.length };
  });

  const fracos = desempenho
    .filter((t) => t.total >= 3 && t.acertos / t.total < LIMITE_FRACO)
    .sort((x, y) => x.acertos / x.total - y.acertos / y.total)
    .slice(0, 5);

  // sugestão: o mais fraco; senão, o primeiro tópico não visto (Específicos primeiro, maior peso)
  const sugestao: { t: TopicoResumo; motivo: string } | null = fracos[0]
    ? { t: fracos[0], motivo: `acertou ${pct(fracos[0].acertos, fracos[0].total)}% nos quizzes — reveja a explicação e refaça.` }
    : (() => {
        const novo = AREAS.flatMap((a) => desempenho.filter((t) => t.area === a)).find(
          (t) => t.status === "nao-visto",
        );
        return novo ? { t: novo, motivo: "ainda não visto." } : null;
      })();

  const sims = p.tentativas.filter((t) => !t.parcial);
  const ultimas = [...p.tentativas].slice(-5).reverse();

  return (
    <div className="space-y-6">
      <section className="card p-4">
        <h2 className="mb-2 font-bold">Próximo passo</h2>
        {sugestao ? (
          <p className="text-sm">
            <Link href={`/conteudo/${sugestao.t.area}/${sugestao.t.slug}/`} className="font-semibold text-acento underline">
              {sugestao.t.titulo}
            </Link>{" "}
            <span className="text-muted">({NOMES_AREA[sugestao.t.area]}): {sugestao.motivo}</span>
          </p>
        ) : (
          <p className="text-sm text-muted">Todos os tópicos foram vistos e nenhum está fraco. Faça um simulado completo.</p>
        )}
        {p.erros.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            Você tem {p.erros.length} questão(ões) no{" "}
            <Link href="/revisao/" className="text-acento underline">caderno de erros</Link>.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-bold">Por área</h2>
        {porArea.map((a) => (
          <div key={a.area} className="card p-4">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{NOMES_AREA[a.area]}</p>
              <p className="text-sm text-muted">
                {a.vistos}/{a.topicos} tópicos vistos ·{" "}
                {a.total ? `${a.acertos}/${a.total} acertos nos quizzes (${pct(a.acertos, a.total)}%)` : "sem quizzes feitos"}
              </p>
            </div>
            <Barra valor={pct(a.vistos, a.topicos)} rotulo={`Tópicos vistos em ${NOMES_AREA[a.area]}`} />
          </div>
        ))}
      </section>

      <section className="card p-4">
        <h2 className="mb-2 font-bold">Tópicos mais fracos</h2>
        {fracos.length ? (
          <ul className="space-y-1 text-sm">
            {fracos.map((t) => (
              <li key={t.chave} className="flex flex-wrap justify-between gap-2">
                <Link href={`/conteudo/${t.area}/${t.slug}/`} className="text-acento underline">{t.titulo}</Link>
                <span className="text-muted">{t.acertos}/{t.total} ({pct(t.acertos, t.total)}%)</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nenhum ainda. Aparecem aqui os tópicos com menos de 70% nos quizzes (mínimo de 3 questões respondidas).</p>
        )}
      </section>

      <section className="card p-4">
        <h2 className="mb-2 font-bold">Simulados</h2>
        {ultimas.length ? (
          <>
            <ul className="space-y-1 text-sm">
              {ultimas.map((t) => (
                <li key={t.id} className="flex flex-wrap justify-between gap-2">
                  <span>{formatarData(t.inicio)} · simulado {t.simulado}{t.parcial ? " (reduzido)" : ""}</span>
                  <span className="text-muted">
                    {t.acertos}/{t.total}
                    {!t.parcial && ` · nota ${formatarNota(t.nota)}`}
                    {t.habilitado === true && " · habilitado"}
                    {t.habilitado === false && " · abaixo do corte"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">
              Corte: nota {PROVA.notaCorte} (20 de 40). {sims.length} simulado(s) completo(s) feito(s).
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
}
