/** URL pública do site. Para outro domínio, defina NEXT_PUBLIC_SITE_URL no build. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aprovaita.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Aprova Ita";
export const SITE_DESCRIPTION =
  "Estudos para o Concurso nº 01/2026 da Câmara de Itanhaém (Agente Administrativo, VUNESP): conteúdo, questões, simulados e progresso.";
