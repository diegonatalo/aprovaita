import Link from "next/link";
import type { Metadata } from "next";
import { NOMES_AREA } from "@/config/prova";
import { AREAS } from "@/lib/content";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NaoEncontrada() {
  return (
    <div className="mx-auto max-w-xl space-y-6 py-10 text-center">
      <p className="font-display text-8xl font-extrabold text-acento" aria-hidden="true">404</p>
      <h1 className="font-display text-2xl font-bold">Essa página não existe</h1>
      <p className="text-muted">
        O endereço pode ter mudado ou estar digitado errado. Volte ao início ou escolha uma área para continuar estudando.
      </p>
      <Link href="/" className="btn btn-primary">
        Ir para o início
      </Link>
      <nav aria-label="Áreas de estudo" className="flex flex-wrap justify-center gap-2 text-sm">
        {AREAS.map((a) => (
          <Link key={a} href={`/conteudo/${a}/`} className="chip">
            {NOMES_AREA[a]}
          </Link>
        ))}
        <Link href="/simulado/" className="chip">Simulado</Link>
        <Link href="/progresso/" className="chip">Progresso</Link>
      </nav>
    </div>
  );
}
