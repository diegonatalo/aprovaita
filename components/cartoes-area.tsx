import Link from "next/link";
import { NOMES_AREA, PROVA } from "@/lib/prova";
import { listarTopicos } from "@/lib/content";
import { BarraArea } from "./home-widgets";
import { Icone, type NomeIcone } from "./icones";
import type { Area } from "@/types";

const ICONE: Record<Area, NomeIcone> = {
  especificos: "pasta",
  portugues: "letras",
  matematica: "calc",
  legislacao: "balanca",
};
const ORDEM: Area[] = ["especificos", "portugues", "matematica", "legislacao"];

/** Grade com as quatro áreas da prova e o progresso de cada uma. */
export function CartoesArea() {
  const topicos = listarTopicos();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ORDEM.map((a) => {
        const ts = topicos.filter((t) => t.area === a);
        return (
          <Link key={a} href={`/conteudo/${a}`} className="card card-link flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-acento-suave text-acento">
                <Icone nome={ICONE[a]} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold leading-tight">{NOMES_AREA[a]}</span>
                <span className="block text-sm text-muted">
                  {PROVA.distribuicao[a]} questões na prova · {ts.length} tópicos
                </span>
              </span>
              <Icone nome="seta" className="mt-1 h-5 w-5 shrink-0 text-muted" />
            </div>
            <BarraArea chaves={ts.map((t) => `${t.area}/${t.slug}`)} />
          </Link>
        );
      })}
    </div>
  );
}
