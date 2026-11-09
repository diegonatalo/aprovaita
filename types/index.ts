export type Area = "portugues" | "matematica" | "legislacao" | "especificos";
export type Subarea =
  | "administracao-geral"
  | "arquivologia"
  | "administracao-publica";
export type Origin = "authored" | "exam";
export type TopicStatus = "unseen" | "seen" | "mastered";
export type SourceStatus = "ok" | "PENDING_SOURCE";

export interface ExamSource {
  agency: string;
  year: number;
  position: string;
  number: number;
  /** Documento oficial de onde veio o gabarito (edital de divulgação etc.) e sua condição. */
  answerKeySource: string;
}

export interface Question {
  id: string;
  area: Area;
  subarea?: Subarea;
  topicSlug: string;
  origin: Origin;
  source?: ExamSource; // obrigatório se origem === "exam"
  statement: string; // aceita Markdown
  choices: [string, string, string, string, string]; // A–E
  answerKey: 0 | 1 | 2 | 3 | 4;
  explanation: string; // por que a certa está certa e as outras erradas
}

export interface Topic {
  area: Area;
  subarea?: Subarea;
  slug: string;
  title: string;
  order: number;
  summary: string;
  sourceStatus: SourceStatus;
  content: string; // markdown
  authored: Question[];
  exam: Question[];
}
