import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { AREAS, listTopics } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/conteudo",
    ...AREAS.map((a) => `/conteudo/${a}`),
    ...listTopics().map((t) => `/conteudo/${t.area}/${t.slug}`),
    "/simulado",
    "/revisao",
    "/progresso",
  ];
  return routes.map((r) => ({ url: `${SITE.url}${r}` }));
}
