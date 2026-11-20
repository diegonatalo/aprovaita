/** URL pública do site. Para outro domínio, defina NEXT_PUBLIC_SITE_URL no build. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aprovaita.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = "Aprova Ita";

/**
 * Contato para pedidos sobre dados pessoais (LGPD, art. 18), mostrado em `/privacidade`.
 * TODO: trocar pelo e-mail definitivo; o standard-kit avisa enquanto este for o provisório.
 */
export const PRIVACY_EMAIL = "contato@exemplo.com.br";

/** Repositório público, no rodapé. */
export const SOURCE_URL = "https://github.com/diegonatalo/aprovaita";
export const SITE_DESCRIPTION =
  "Estudos para o Concurso nº 01/2026 da Câmara de Itanhaém (Agente Administrativo, VUNESP): conteúdo, questões, simulados e progresso.";
