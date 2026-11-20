"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Logo, type IconName } from "./icons";
import { SITE_NAME } from "@/lib/site";
import { useTheme } from "@/hooks/use-theme";
import { STORAGE_KEYS } from "@/lib/storage-keys";

type Destination = {
  href: string;
  label: string;
  icon: IconName;
  /** Prefixo que mantém o item ativo (ex.: /conteudo/ vale para todas as áreas). */
  prefix?: string;
};

// Barra inferior (mobile): 5 destinos principais.
const ABAS: Destination[] = [
  { href: "/app", label: "Início", icon: "home" },
  { href: "/app/conteudo", label: "Estudar", icon: "book", prefix: "/app/conteudo" },
  { href: "/app/simulado", label: "Simulado", icon: "exam", prefix: "/app/simulado" },
  { href: "/app/revisao", label: "Erros", icon: "review", prefix: "/app/revisao" },
  { href: "/app/progresso", label: "Progresso", icon: "chart", prefix: "/app/progresso" },
];

// Barra lateral (desktop): áreas aparecem como subitens de "Estudar".
const SIDEBAR_AREAS: Destination[] = [
  { href: "/app/conteudo/especificos", label: "Específicos", icon: "folder", prefix: "/app/conteudo/especificos" },
  { href: "/app/conteudo/portugues", label: "Português", icon: "letters", prefix: "/app/conteudo/portugues" },
  { href: "/app/conteudo/matematica", label: "Matemática", icon: "calc", prefix: "/app/conteudo/matematica" },
  { href: "/app/conteudo/legislacao", label: "Legislação", icon: "scale", prefix: "/app/conteudo/legislacao" },
];

function active(path: string, d: Destination) {
  if (d.href === "/app") return path === "/app";
  return path.startsWith(d.prefix ?? d.href);
}

export const ThemeButton = ({ className = "" }: { className?: string }) => {
  const { theme, toggle } = useTheme(STORAGE_KEYS.theme);
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted transition hover:text-accent ${className}`}
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
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-lg font-bold tracking-tight">{SITE_NAME}</span>
        </Link>
        <ThemeButton />
      </header>

      {/* Lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card/60 p-5 backdrop-blur-xl md:flex">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Logo size={42} />
          <span>
            <span className="block font-display text-xl font-bold leading-tight tracking-tight">{SITE_NAME}</span>
            <span className="block text-xs text-muted">Câmara de Itanhaém</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {ABAS.map((d) => (
            <div key={d.href}>
              <SidebarItem d={d} active={active(path, d)} />
              {d.href === "/app/conteudo" && (
                <div className="mb-1 ml-5 mt-1 space-y-0.5 border-l border-border pl-3">
                  {SIDEBAR_AREAS.map((a) => (
                    <Link
                      key={a.href}
                      href={a.href}
                      aria-current={active(path, a) ? "page" : undefined}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-accent"
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

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted">Prova em 06/12/2026</span>
          <ThemeButton />
        </div>
      </aside>

      {/* Barra inferior (mobile) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {ABAS.map((d) => {
            const a = active(path, d);
            return (
              <li key={d.href}>
                <Link
                  href={d.href}
                  aria-current={a ? "page" : undefined}
                  className="group flex min-h-16 flex-col items-center justify-center gap-0.5 px-1 text-[0.68rem] font-medium text-muted transition aria-[current=page]:text-accent"
                >
                  <span className="flex h-8 w-14 items-center justify-center rounded-full transition group-aria-[current=page]:bg-accent-soft">
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
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-accent-soft hover:text-foreground aria-[current=page]:bg-accent-soft aria-[current=page]:font-semibold aria-[current=page]:text-accent"
    >
      <Icon name={d.icon} />
      {d.label === "Erros" ? "Caderno de erros" : d.label}
    </Link>
  );
};
