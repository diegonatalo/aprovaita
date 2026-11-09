import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { AREAS, listarTopicos } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = [
    "/",
    "/conteudo/",
    ...AREAS.map((a) => `/conteudo/${a}/`),
    ...listarTopicos().map((t) => `/conteudo/${t.area}/${t.slug}/`),
    "/simulado/",
    "/revisao/",
    "/progresso/",
  ];
  return rotas.map((r) => ({ url: `${SITE.url}${r}` }));
}
