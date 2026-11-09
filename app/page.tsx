import type { Metadata } from "next";
import Link from "next/link";
import { EXAM } from "@/lib/exam";
import { SITE_NAME } from "@/lib/site";
import { listTopics } from "@/lib/content";
import { Countdown, OverallProgress } from "@/components/home-widgets";
import { AreaCards } from "@/components/area-cards";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const topics = listTopics();
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[var(--mar-1)] to-[var(--mar-2)] p-6 text-white shadow-[var(--sombra-alta)] sm:p-9">
        <svg aria-hidden="true" viewBox="0 0 600 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-28 w-full opacity-20">
          <path d="M0 120c60-40 120-40 200 0s140 40 200 0 140-40 200 0v80H0z" fill="#fff" />
        </svg>
        <span aria-hidden="true" className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-sol opacity-90 sm:h-48 sm:w-48" />
        <div className="relative space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
              {SITE_NAME} · Concurso nº 01/2026
            </p>
            <h1 className="mt-2 max-w-md font-display text-3xl font-extrabold leading-[1.1] sm:text-4xl">
              Agente Administrativo da Câmara de Itanhaém
            </h1>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-white/75">Faltam para a prova de 06/12/2026</p>
            <Countdown targetISO={EXAM.examDate} />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/simulado" className="btn bg-white text-[#0c3d52] hover:bg-white/90">
              <Icon name="exam" className="h-[1.1rem] w-[1.1rem]" />
              Fazer simulado
            </Link>
            <Link href="/revisao" className="btn border border-white/35 text-white hover:bg-white/10">
              Meus erros
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="eyebrow mb-3">Progresso geral</h2>
          <OverallProgress topicKeys={topics.map((t) => `${t.area}/${t.slug}`)} />
        </div>
        <div className="card flex flex-col justify-between gap-3 p-5">
          <h2 className="eyebrow">A prova</h2>
          <p className="text-sm text-muted">
            <strong className="text-foreground">{EXAM.totalQuestions} questões</strong> · {EXAM.exam} ·{" "}
            {EXAM.durationMinutes / 60}h. Habilitado com nota ≥ {EXAM.cutoffScore} (20 acertos).
          </p>
          <Link href="/progresso" className="inline-flex items-center gap-1.5 text-sm font-semibold text-acento">
            Ver meu desempenho <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-xl font-bold">Áreas de estudo</h2>
        <AreaCards />
      </section>
    </div>
  );
}
