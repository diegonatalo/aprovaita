import type { NextConfig } from "next";

export type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

/** Telas que ficavam na raiz antes da landing; `:path*` cobre também áreas e tópicos. */
const MOVED = ["conteudo", "progresso", "revisao", "simulado"];

/**
 * Redirecionamentos do projeto, lidos pelo `next.config.ts` (que é igual em todos os projetos).
 * O app saiu da raiz para `/app` quando a landing entrou em `/`.
 */
export const REDIRECTS: Redirect[] = MOVED.map((name) => ({
  source: `/${name}/:path*`,
  destination: `/app/${name}/:path*`,
  permanent: true,
}));
