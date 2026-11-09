"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Icone, Logo, type NomeIcone } from "./icones";
import { SITE } from "@/lib/site";

interface Destino {
  href: string;
  rotulo: string;
  icone: NomeIcone;
  /** Prefixo que mantém o item ativo (ex.: /conteudo/ vale para todas as áreas). */
  prefixo?: string;
}

// Barra inferior (mobile): 5 destinos principais.
const ABAS: Destino[] = [
  { href: "/", rotulo: "Início", icone: "casa" },
  { href: "/conteudo", rotulo: "Estudar", icone: "livro", prefixo: "/conteudo" },
  { href: "/simulado", rotulo: "Simulado", icone: "prova", prefixo: "/simulado" },
  { href: "/revisao", rotulo: "Erros", icone: "revisao", prefixo: "/revisao" },
  { href: "/progresso", rotulo: "Progresso", icone: "grafico", prefixo: "/progresso" },
];

// Barra lateral (desktop): áreas aparecem como subitens de "Estudar".
const AREAS_LATERAL: Destino[] = [
  { href: "/conteudo/especificos", rotulo: "Específicos", icone: "pasta", prefixo: "/conteudo/especificos" },
  { href: "/conteudo/portugues", rotulo: "Português", icone: "letras", prefixo: "/conteudo/portugues" },
  { href: "/conteudo/matematica", rotulo: "Matemática", icone: "calc", prefixo: "/conteudo/matematica" },
  { href: "/conteudo/legislacao", rotulo: "Legislação", icone: "balanca", prefixo: "/conteudo/legislacao" },
];

function assinarTema(f: () => void) {
  const o = new MutationObserver(f);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => o.disconnect();
}

function useTema() {
  const escuro = useSyncExternalStore(
    assinarTema,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  function alternar() {
    const novo = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", novo);
    try {
      localStorage.setItem("tema", novo ? "dark" : "light");
    } catch {}
  }
  return { escuro, alternar };
}

function ativo(caminho: string, d: Destino) {
  if (d.href === "/") return caminho === "/";
  return caminho.startsWith(d.prefixo ?? d.href);
}

function BotaoTema({ className = "" }: { className?: string }) {
  const { escuro, alternar } = useTema();
  return (
    <button
      onClick={alternar}
      aria-label={escuro ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-borda bg-card text-muted transition hover:text-acento ${className}`}
    >
      <Icone nome={escuro ? "sol" : "lua"} className="h-[1.15rem] w-[1.15rem]" />
    </button>
  );
}

export function Nav() {
  const caminho = usePathname();

  return (
    <>
      {/* Topo (mobile) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-borda bg-background/85 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo tamanho={30} />
          <span className="font-display text-lg font-bold tracking-tight">{SITE.nome}</span>
        </Link>
        <BotaoTema />
      </header>

      {/* Lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-borda bg-card/60 p-5 backdrop-blur-xl lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Logo tamanho={42} />
          <span>
            <span className="block font-display text-xl font-bold leading-tight tracking-tight">{SITE.nome}</span>
            <span className="block text-xs text-muted">Câmara de Itanhaém</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {ABAS.map((d) => (
            <div key={d.href}>
              <ItemLateral d={d} ativo={ativo(caminho, d)} />
              {d.href === "/conteudo" && (
                <div className="mb-1 ml-5 mt-1 space-y-0.5 border-l border-borda pl-3">
                  {AREAS_LATERAL.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      aria-current={ativo(caminho, a) ? "page" : undefined}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-acento-suave hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-acento"
                    >
                      <Icone nome={a.icone} className="h-4 w-4" />
                      {a.rotulo}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between border-t border-borda pt-4">
          <span className="text-xs text-muted">Prova em 06/12/2026</span>
          <BotaoTema />
        </div>
      </aside>

      {/* Barra inferior (mobile) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {ABAS.map((d) => {
            const a = ativo(caminho, d);
            return (
              <li key={d.href}>
                <Link
                  href={d.href}
                  aria-current={a ? "page" : undefined}
                  className="group flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-[0.68rem] font-medium text-muted transition aria-[current=page]:text-acento"
                >
                  <span className="flex h-8 w-14 items-center justify-center rounded-full transition group-aria-[current=page]:bg-acento-suave">
                    <Icone nome={d.icone} className="h-[1.35rem] w-[1.35rem]" />
                  </span>
                  <span className="group-aria-[current=page]:font-bold">{d.rotulo}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function ItemLateral({ d, ativo: a }: { d: Destino; ativo: boolean }) {
  return (
    <Link
      href={d.href}
      aria-current={a ? "page" : undefined}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-acento-suave hover:text-foreground aria-[current=page]:bg-acento-suave aria-[current=page]:font-semibold aria-[current=page]:text-acento"
    >
      <Icone nome={d.icone} />
      {d.rotulo === "Erros" ? "Caderno de erros" : d.rotulo}
    </Link>
  );
}
