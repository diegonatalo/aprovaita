import Image from "next/image";
import Link from "next/link";
import { Icon, Logo, type IconName } from "@/components/icons";
import { ThemeButton } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { FAQ, FEATURES, HERO, SCREENSHOT, STEPS, type FeatureIcon } from "@/lib/landing";
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

/** Página inicial: apresenta o Aprova Ita e leva ao app (`/app`). */
export const LandingPage = () => (
  <div className="flex min-h-screen flex-col">
    <PublicHeader />
    <main id="conteudo" className="flex flex-1 flex-col gap-20 pb-20">
      <section className={`${SECTION} flex flex-col gap-10 pt-12 sm:pt-16`} aria-labelledby="titulo">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-bold tracking-wide text-accent uppercase">{HERO.kicker}</p>
          <h1 id="titulo" className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {HERO.title}
          </h1>
          <p className="text-lg text-pretty text-muted">{HERO.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/app" className="btn btn-primary">
              Começar a estudar
            </Link>
            <a href="#como-funciona" className="btn btn-ghost">
              Ver como funciona
            </a>
          </div>
          <p className="text-sm text-muted">{HERO.note}</p>
        </div>
        <div className="card overflow-hidden p-0 shadow-xl">
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
      </section>

      <section id="como-funciona" className={`${SECTION} scroll-mt-20`} aria-labelledby="titulo-como">
        <h2 id="titulo-como" className={H2}>
          Como funciona
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card flex flex-col gap-3 p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft font-display font-extrabold text-accent">
                {index + 1}
              </span>
              <h3 className="font-display text-lg font-bold">{step.title}</h3>
              <p className="text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={SECTION} aria-labelledby="titulo-recursos">
        <h2 id="titulo-recursos" className={H2}>
          Tudo o que você precisa para a prova
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="card flex flex-col gap-2 p-5">
              <Icon name={ICONS[feature.icon]} className="h-6 w-6 text-accent" />
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-sm text-muted">{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION} aria-labelledby="titulo-privacidade">
        <div className="flex flex-col gap-3 rounded-[1.6rem] bg-accent-soft p-8">
          <h2 id="titulo-privacidade" className={H2}>
            Seu progresso é só seu
          </h2>
          <p className="max-w-2xl text-pretty">
            Tudo fica guardado no seu navegador. Não há conta, servidor guardando suas respostas nem cookies de
            rastreamento.{" "}
            <Link href="/privacidade" className="font-semibold text-accent underline underline-offset-2">
              Leia a política de privacidade
            </Link>
            .
          </p>
        </div>
      </section>

      <section className={SECTION} aria-labelledby="titulo-faq">
        <h2 id="titulo-faq" className={H2}>
          Perguntas frequentes
        </h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          {FAQ.map((item) => (
            <div key={item.question} className="card p-5">
              <dt className="font-bold">{item.question}</dt>
              <dd className="mt-2 text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${SECTION} text-center`} aria-labelledby="titulo-final">
        <h2 id="titulo-final" className={H2}>
          Bora estudar?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">Comece pelo tópico que você mais precisa.</p>
        <Link href="/app/conteudo" className="btn btn-primary mt-6">
          Ver o conteúdo
        </Link>
      </section>
    </main>
    <PublicFooter />
  </div>
);
