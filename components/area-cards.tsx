import Link from "next/link";
import { AREA_NAMES, EXAM } from "@/lib/exam";
import { listTopics } from "@/lib/content";
import { AreaBar } from "./home-widgets";
import { Icon, type IconName } from "./icons";
import type { Area } from "@/types";

const ICON: Record<Area, IconName> = {
  especificos: "folder",
  portugues: "letters",
  matematica: "calc",
  legislacao: "scale",
};
const ORDER: Area[] = ["especificos", "portugues", "matematica", "legislacao"];

/** Grade com as quatro áreas da prova e o progresso de cada uma. */
export function AreaCards() {
  const topics = listTopics();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ORDER.map((a) => {
        const ts = topics.filter((t) => t.area === a);
        return (
          <Link key={a} href={`/conteudo/${a}`} className="card card-link flex flex-col gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-acento-suave text-acento">
                <Icon name={ICON[a]} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold leading-tight">{AREA_NAMES[a]}</span>
                <span className="block text-sm text-muted">
                  {EXAM.distribution[a]} questões na prova · {ts.length} tópicos
                </span>
              </span>
              <Icon name="arrow" className="mt-1 h-5 w-5 shrink-0 text-muted" />
            </div>
            <AreaBar topicKeys={ts.map((t) => `${t.area}/${t.slug}`)} />
          </Link>
        );
      })}
    </div>
  );
}
