import { useId, type SVGProps } from "react";

export type NomeIcone =
  | "casa"
  | "livro"
  | "prova"
  | "revisao"
  | "grafico"
  | "lua"
  | "sol"
  | "pasta"
  | "letras"
  | "calc"
  | "balanca"
  | "seta"
  | "relogio"
  | "check";

const CAMINHOS: Record<NomeIcone, React.ReactNode> = {
  casa: <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5" />,
  livro: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 0 6.5 23H20M9 8h7" />,
  prova: (
    <>
      <path d="M7 3h8l4 4v14H7V3Z" />
      <path d="M15 3v4h4M10 12h6M10 16h6" />
    </>
  ),
  revisao: <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5" />,
  grafico: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  lua: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  pasta: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  letras: <path d="M4 19 9.5 5 15 19M6 14.5h7M17 10h4M19 10v9" />,
  calc: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
    </>
  ),
  balanca: <path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7ZM19 7l-3 7a3 3 0 0 0 6 0l-3-7Z" />,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

export function Icone({ nome, className = "h-5 w-5", ...resto }: { nome: NomeIcone } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...resto}
    >
      {CAMINHOS[nome]}
    </svg>
  );
}

/** Marca do app: quadrado do mar com sol e um "check" de aprovação. */
export function Logo({ tamanho = 36 }: { tamanho?: number }) {
  // id único: a marca aparece duas vezes (topo mobile e lateral desktop) e um deles fica oculto
  const gradiente = useId();
  return (
    <svg viewBox="0 0 64 64" width={tamanho} height={tamanho} aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={gradiente} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f8396" />
          <stop offset="1" stopColor="#0a3a4f" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gradiente})`} />
      <circle cx="46" cy="18" r="6" fill="#ff8a63" />
      <path d="m16 33 10 10 22-22" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 52c6-4 10-4 16 0s10 4 16 0 10-4 16 0" fill="none" stroke="#ffffff55" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
