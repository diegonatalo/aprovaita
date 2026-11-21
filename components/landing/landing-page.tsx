import Image from "next/image";
import Link from "next/link";
import { Icon, Logo, type IconName } from "@/components/icons";
import { ThemeButton } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { EXAM_FACTS, FAQ, FEATURES, HERO, PHOTO, SCREENSHOT, STEPS, type FeatureIcon } from "@/lib/landing";
import { SITE_NAME, SOURCE_URL } from "@/lib/site";

const ICONS: Record<FeatureIcon, IconName> = {
  book: "book",
  exam: "exam",
  review: "review",
  chart: "chart",
  offline: "clock",
  backup: "folder",
};

const SECTION = "mx-auto w-full max-w-5xl px-4 sm:px-6";
const H2 = "font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl";

/** Marca com link para a página inicial. */
export const BrandLink = () => (
  <Link href="/" aria-label={`${SITE_NAME}, página inicial`} className="flex items-center gap-2.5">
    <Logo size={34} />
    <span className="font-display text-lg font-extrabold">{SITE_NAME}</span>
  </Link>
);

/** Topo das páginas fora do app (landing e páginas legais). */
export const PublicHeader = () => (
  <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
    <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
      <BrandLink />
      <div className="ml-auto flex items-center gap-2">
        <ThemeButton />
        <Link href="/app" className="btn btn-primary">
          Abrir o app
        </Link>
      </div>
    </div>
  </header>
);

/** Rodapé das páginas fora do app. */
export const PublicFooter = () => (
  <SiteFooter privacy terms sourceUrl={SOURCE_URL} authorUrl="https://diegonatalo.dev" />
);

/** Onda branca na base das faixas de mar, como a do card de início do app. */
const Wave = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 600 200"
    preserveAspectRatio="none"
    className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`}
  >
    <path d="M0 120c60-40 120-40 200 0s140 40 200 0 140-40 200 0v80H0z" fill="currentColor" />
  </svg>
);

/** Página inicial: apresenta o Aprova Ita e leva ao app (`/app`). */
export const LandingPage = () => (
  <div className="flex min-h-screen flex-col">
    <PublicHeader />
    <main id="conteudo" className="flex flex-1 flex-col">
      {/* Mar, sol e onda: a mesma identidade do card de início do app. */}
      <section
        className="relative isolate overflow-hidden bg-gradient-to-br from-[var(--sea-1)] to-[var(--sea-2)] pb-40 text-white"
        aria-labelledby="titulo"
      >
        <span
          aria-hidden="true"
          className="absolute -right-16 -top-16 -z-10 size-64 rounded-full bg-sun opacity-90 sm:right-[8%] sm:top-12 sm:size-80"
        />
        <Wave className="-z-10 h-40 text-white opacity-10" />
        <Wave className="-z-10 h-24 text-background" />
        <div className={`${SECTION} flex max-w-5xl flex-col gap-6 pt-14 sm:pt-20`}>
          <p className="text-xs font-bold tracking-[0.16em] text-white/75 uppercase">{HERO.kicker}</p>
          <h1 id="titulo" className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            {HERO.title}
          </h1>
          <p className="max-w-2xl text-lg text-pretty text-white/85">{HERO.subtitle}</p>
          <ul className="flex flex-wrap gap-2">
            {EXAM_FACTS.map((fact) => (
              <li key={fact} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-semibold">
                {fact}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link href="/app" className="btn bg-white text-[#0c3d52] hover:bg-white/90">
              Começar a estudar
            </Link>
            <a href="#como-funciona" className="btn border border-white/40 text-white hover:bg-white/10">
              Ver como funciona
            </a>
          </div>
        </div>
      </section>

      {/* Print sobe por cima da onda. */}
      <div className={`${SECTION} relative -mt-32`}>
        <div className="card overflow-hidden p-0 shadow-2xl">
          <Image
            src={SCREENSHOT.light}
            alt={SCREENSHOT.alt}
            width={1280}
            height={800}
            priority
            sizes="(min-width: 1024px) 976px, 100vw"
            className="block h-auto w-full dark:hidden"
          />
          <Image
            src={SCREENSHOT.dark}
            alt={SCREENSHOT.alt}
            width={1280}
            height={800}
            priority
            sizes="(min-width: 1024px) 976px, 100vw"
            className="hidden h-auto w-full dark:block"
          />
        </div>
        <p className="mt-3 text-center text-sm text-muted">{HERO.note}</p>
      </div>

      <section
        id="como-funciona"
        className={`${SECTION} grid scroll-mt-20 items-center gap-12 py-20 md:grid-cols-2`}
        aria-labelledby="titulo-como"
      >
        <div className="relative">
          <span aria-hidden="true" className="absolute -left-4 -top-4 size-24 rounded-full bg-sun opacity-80" />
          <Image
            src={PHOTO.src}
            alt={PHOTO.alt}
            width={1600}
            height={1067}
            sizes="(min-width: 768px) 480px, 100vw"
            className="relative aspect-[4/3] w-full rounded-[1.6rem] object-cover"
          />
        </div>
        <div>
          <h2 id="titulo-como" className={H2}>
            Como funciona
          </h2>
          <ol className="mt-6 space-y-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-display font-extrabold text-accent">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{step.title}</h3>
                  <p className="mt-1 text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-card-2/60 py-20" aria-labelledby="titulo-recursos">
        <div className={SECTION}>
          <h2 id="titulo-recursos" className={H2}>
            Tudo o que você precisa para a prova
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="card flex flex-col gap-2 border-t-4 border-t-accent p-5">
                <Icon name={ICONS[feature.icon]} className="h-6 w-6 text-accent" />
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${SECTION} grid gap-10 py-20 lg:grid-cols-[1fr_1.5fr]`} aria-labelledby="titulo-faq">
        <div className="flex flex-col gap-4">
          <h2 id="titulo-faq" className={H2}>
            Perguntas frequentes
          </h2>
          <p className="text-sm text-muted">
            Seu progresso é só seu: tudo fica no seu navegador, sem conta nem cookies de rastreamento.{" "}
            <Link href="/privacidade" className="font-semibold text-accent underline underline-offset-2">
              Leia a política de privacidade
            </Link>
            .
          </p>
        </div>
        <dl className="space-y-3">
          {FAQ.map((item) => (
            <div key={item.question} className="card p-5">
              <dt className="font-bold">{item.question}</dt>
              <dd className="mt-2 text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="relative isolate overflow-hidden bg-gradient-to-br from-[var(--sea-1)] to-[var(--sea-2)] py-20 text-center text-white"
        aria-labelledby="titulo-final"
      >
        <span aria-hidden="true" className="absolute -right-16 -top-16 -z-10 size-48 rounded-full bg-sun opacity-90 sm:right-[10%] sm:size-56" />
        <h2 id="titulo-final" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Bora estudar?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/85">Comece pelo tópico que você mais precisa.</p>
        <Link href="/app/conteudo" className="btn mt-6 bg-white text-[#0c3d52] hover:bg-white/90">
          Ver o conteúdo
        </Link>
      </section>
    </main>
    <PublicFooter />
  </div>
);
