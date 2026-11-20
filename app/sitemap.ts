import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { AREAS, listTopics } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    "/",
    "/app",
    "/app/conteudo",
    ...AREAS.map((a) => `/app/conteudo/${a}`),
    ...listTopics().map((t) => `/app/conteudo/${t.area}/${t.slug}`),
    "/app/simulado",
    "/app/revisao",
    "/app/progresso",
    "/privacidade",
    "/termos",
  ];
  return routes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified }));
}
