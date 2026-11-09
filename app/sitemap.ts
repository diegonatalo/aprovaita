import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { AREAS, listTopics } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "/",
    "/conteudo",
    ...AREAS.map((a) => `/conteudo/${a}`),
    ...listTopics().map((t) => `/conteudo/${t.area}/${t.slug}`),
    "/simulado",
    "/revisao",
    "/progresso",
  ];
  return routes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified }));
}
