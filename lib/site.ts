// Identidade do app e endereço público (usado em sitemap, robots e metadados).
export const SITE = {
  nome: "Aprova Ita",
  descricao:
    "Estudos para o Concurso nº 01/2026 da Câmara de Itanhaém (Agente Administrativo, VUNESP): conteúdo, questões, simulados e progresso.",
  // Para publicar em outro domínio, defina NEXT_PUBLIC_SITE_URL no build.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://aprovaita.vercel.app").replace(/\/+$/, ""),
} as const;
