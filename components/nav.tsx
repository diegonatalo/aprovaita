"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Icon, Logo, type IconName } from "./icons";
import { SITE } from "@/lib/site";

interface Destination {
  href: string;
  label: string;
  icon: IconName;
  /** Prefixo que mantém o item ativo (ex.: /conteudo/ vale para todas as áreas). */
  prefix?: string;
}

// Barra inferior (mobile): 5 destinos principais.
const ABAS: Destination[] = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/conteudo", label: "Estudar", icon: "book", prefix: "/conteudo" },
  { href: "/simulado", label: "Simulado", icon: "exam", prefix: "/simulado" },
  { href: "/revisao", label: "Erros", icon: "review", prefix: "/revisao" },
  { href: "/progresso", label: "Progresso", icon: "chart", prefix: "/progresso" },
];

// Barra lateral (desktop): áreas aparecem como subitens de "Estudar".
const SIDEBAR_AREAS: Destination[] = [
  { href: "/conteudo/especificos", label: "Específicos", icon: "folder", prefix: "/conteudo/especificos" },
  { href: "/conteudo/portugues", label: "Português", icon: "letters", prefix: "/conteudo/portugues" },
  { href: "/conteudo/matematica", label: "Matemática", icon: "calc", prefix: "/conteudo/matematica" },
  { href: "/conteudo/legislacao", label: "Legislação", icon: "scale", prefix: "/conteudo/legislacao" },
];

function subscribeTheme(f: () => void) {
  const o = new MutationObserver(f);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => o.disconnect();
}

function useTheme() {
  const dark = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  function toggle() {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("tema", nextDark ? "dark" : "light");
    } catch {}
  }
  return { dark, toggle };
}

function active(path: string, d: Destination) {
  if (d.href === "/") return path === "/";
  return path.startsWith(d.prefix ?? d.href);
}

const ThemeButton = ({ className = "" }: { className?: string }) => {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-borda bg-card text-muted transition hover:text-acento ${className}`}
    >
      <Icon name={dark ? "sun" : "moon"} className="h-[1.15rem] w-[1.15rem]" />
    </button>
  );
};

export const Nav = () => {
  const path = usePathname();

  return (
    <>
      {/* Topo (mobile) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-borda bg-background/85 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-lg font-bold tracking-tight">{SITE.name}</span>
        </Link>
        <ThemeButton />
      </header>

      {/* Lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-borda bg-card/60 p-5 backdrop-blur-xl lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Logo size={42} />
          <span>
            <span className="block font-display text-xl font-bold leading-tight tracking-tight">{SITE.name}</span>
            <span className="block text-xs text-muted">Câmara de Itanhaém</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {ABAS.map((d) => (
            <div key={d.href}>
              <SidebarItem d={d} active={active(path, d)} />
              {d.href === "/conteudo" && (
                <div className="mb-1 ml-5 mt-1 space-y-0.5 border-l border-borda pl-3">
                  {SIDEBAR_AREAS.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      aria-current={active(path, a) ? "page" : undefined}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-acento-suave hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-acento"
                    >
                      <Icon name={a.icon} className="h-4 w-4" />
                      {a.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between border-t border-borda pt-4">
          <span className="text-xs text-muted">Prova em 06/12/2026</span>
          <ThemeButton />
        </div>
      </aside>

      {/* Barra inferior (mobile) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {ABAS.map((d) => {
            const a = active(path, d);
            return (
              <li key={d.href}>
                <Link
                  href={d.href}
                  aria-current={a ? "page" : undefined}
                  className="group flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-[0.68rem] font-medium text-muted transition aria-[current=page]:text-acento"
                >
                  <span className="flex h-8 w-14 items-center justify-center rounded-full transition group-aria-[current=page]:bg-acento-suave">
                    <Icon name={d.icon} className="h-[1.35rem] w-[1.35rem]" />
                  </span>
                  <span className="group-aria-[current=page]:font-bold">{d.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

const SidebarItem = ({ d, active: a }: { d: Destination; active: boolean }) => {
  return (
    <Link
      href={d.href}
      aria-current={a ? "page" : undefined}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-acento-suave hover:text-foreground aria-[current=page]:bg-acento-suave aria-[current=page]:font-semibold aria-[current=page]:text-acento"
    >
      <Icon name={d.icon} />
      {d.label === "Erros" ? "Caderno de erros" : d.label}
    </Link>
  );
};
