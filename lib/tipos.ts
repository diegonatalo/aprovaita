export type Area = "portugues" | "matematica" | "legislacao" | "especificos";
export type Subarea =
  | "administracao-geral"
  | "arquivologia"
  | "administracao-publica";
export type Origem = "autoral" | "banca";
export type StatusTopico = "nao-visto" | "visto" | "dominado";
export type StatusFonte = "ok" | "PENDENTE_FONTE";

export interface FonteBanca {
  orgao: string;
  ano: number;
  cargo: string;
  numero: number;
  /** Documento oficial de onde veio o gabarito (edital de divulgação etc.) e sua condição. */
  gabaritoFonte: string;
}

export interface Questao {
  id: string;
  area: Area;
  subarea?: Subarea;
  topicoSlug: string;
  origem: Origem;
  fonte?: FonteBanca; // obrigatório se origem === "banca"
  enunciado: string; // aceita Markdown
  alternativas: [string, string, string, string, string]; // A–E
  gabarito: 0 | 1 | 2 | 3 | 4;
  comentario: string; // por que a certa está certa e as outras erradas
}

export interface Topico {
  area: Area;
  subarea?: Subarea;
  slug: string;
  titulo: string;
  ordem: number;
  resumo: string;
  statusFonte: StatusFonte;
  conteudo: string; // markdown
  autorais: Questao[];
  banca: Questao[];
}
