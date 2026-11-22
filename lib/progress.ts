import type { TopicStatus } from "@/types";

export const SCHEMA_VERSION = 2;

export type QuizResult = {
  correct: number;
  total: number;
  data: string; // ISO
};

export type Attempt = {
  id: string;
  mockExam: "A" | "B";
  startedAt: string;
  seconds: number; // tempo gasto
  order: string[]; // ids das questões, na ordem da prova
  answers: Record<string, number | null>; // questaoId -> alternativa
  correct: number;
  total: number;
  score: number;
  partial: boolean; // simulado reduzido (banco incompleto)
  qualified: boolean | null;
  byArea: Record<string, { correct: number; total: number }>;
};

/** Prova em andamento (sobrevive a recarregar a página). */
export type ExamSession = {
  mockExam: "A" | "B";
  startedAt: string;
  order: string[];
  answers: Record<string, number | null>;
  flagged: string[]; // "revisar depois"
  remainingSeconds: number;
  durationSeconds: number;
  current: number;
};

export type Progress = {
  version: number;
  topics: Record<string, TopicStatus>; // "area/slug"
  quizzes: Record<string, { A?: QuizResult; B?: QuizResult }>;
  mistakes: string[]; // ids de questões erradas (caderno de erros)
  attempts: Attempt[];
};

export const EMPTY_PROGRESS: Progress = {
  version: SCHEMA_VERSION,
  topics: {},
  quizzes: {},
  mistakes: [],
  attempts: [],
};

// Tipos e regras do progresso salvo. Funções puras: ler e gravar o localStorage fica em
// hooks/use-progress.ts e hooks/use-exam-session.ts.

// Lê só o formato atual. Dado salvo em outra versão é descartado.
type Loose = Record<string, unknown>;

const isObject = (v: unknown): v is Loose => !!v && typeof v === "object" && !Array.isArray(v);

export function parseProgress(raw: unknown): Progress {
  if (!isObject(raw) || raw.version !== SCHEMA_VERSION) return EMPTY_PROGRESS;
  return {
    version: SCHEMA_VERSION,
    topics: isObject(raw.topics) ? (raw.topics as Record<string, TopicStatus>) : {},
    quizzes: isObject(raw.quizzes) ? (raw.quizzes as Progress["quizzes"]) : {},
    mistakes: Array.isArray(raw.mistakes) ? (raw.mistakes as string[]) : [],
    attempts: Array.isArray(raw.attempts) ? (raw.attempts as Attempt[]) : [],
  };
}

export function parseExamSession(raw: unknown): ExamSession | null {
  if (!isObject(raw) || !Array.isArray(raw.order)) return null;
  return raw as unknown as ExamSession;
}

export const topicKey = (area: string, slug: string) => `${area}/${slug}`;

const updateMistakes = (mistakes: string[], wrongIds: string[], correctIds: string[]) => {
  const set = new Set(mistakes);
  wrongIds.forEach((i) => set.add(i));
  correctIds.forEach((i) => set.delete(i));
  return [...set];
};

export const withTopicStatus = (p: Progress, key: string, status: TopicStatus): Progress => ({
  ...p,
  topics: { ...p.topics, [key]: status },
});

/** Erradas entram no caderno de erros; acertadas saem dele. */
export const withMistakes = (p: Progress, wrongIds: string[], correctIds: string[]): Progress => ({
  ...p,
  mistakes: updateMistakes(p.mistakes, wrongIds, correctIds),
});

export const withQuiz = (
  p: Progress,
  key: string,
  quiz: "A" | "B",
  r: QuizResult,
  wrongIds: string[],
  correctIds: string[],
): Progress => ({
  ...p,
  quizzes: { ...p.quizzes, [key]: { ...p.quizzes[key], [quiz]: r } },
  mistakes: updateMistakes(p.mistakes, wrongIds, correctIds),
});

export const withAttempt = (p: Progress, t: Attempt): Progress => ({ ...p, attempts: [...p.attempts, t] });

/** Identifica o arquivo de backup: um JSON de outro app nunca é lido como progresso. */
export const BACKUP_APP = "aprovaita";

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isStringList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
const TOPIC_STATUSES: readonly unknown[] = ["unseen", "seen", "mastered"] satisfies TopicStatus[];

const isQuizResult = (v: unknown): v is QuizResult =>
  isObject(v) && isNumber(v.correct) && isNumber(v.total) && typeof v.data === "string";

const isQuizEntry = (v: unknown) =>
  isObject(v) && (v.A === undefined || isQuizResult(v.A)) && (v.B === undefined || isQuizResult(v.B));

const isScore = (v: unknown) => isObject(v) && isNumber(v.correct) && isNumber(v.total);

const isAttempt = (v: unknown): v is Attempt =>
  isObject(v) &&
  typeof v.id === "string" &&
  (v.mockExam === "A" || v.mockExam === "B") &&
  typeof v.startedAt === "string" &&
  isNumber(v.seconds) &&
  isStringList(v.order) &&
  isObject(v.answers) &&
  Object.values(v.answers).every((answer) => answer === null || isNumber(answer)) &&
  isNumber(v.correct) &&
  isNumber(v.total) &&
  isNumber(v.score) &&
  typeof v.partial === "boolean" &&
  (v.qualified === null || typeof v.qualified === "boolean") &&
  isObject(v.byArea) &&
  Object.values(v.byArea).every(isScore);

/** O arquivo que o "Exportar JSON" baixa. */
export const backupJson = (p: Progress) => JSON.stringify({ app: BACKUP_APP, ...p }, null, 2);

const NOT_BACKUP = "Arquivo não parece ser um backup de progresso do Aprovaita.";

/**
 * Lê um backup exportado; devolve o progresso ou o motivo da recusa. Confere o app, a versão e
 * cada registro: um arquivo de outro app, de outra versão ou com dado quebrado é recusado
 * inteiro, e o progresso salvo fica como está. Backups de antes do campo `app` são aceitos
 * quando o formato inteiro bate.
 */
export function parseBackup(text: string): { ok: true; progress: Progress } | { ok: false; error: string } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "JSON inválido." };
  }
  if (!isObject(raw) || (raw.app !== undefined && raw.app !== BACKUP_APP)) return { ok: false, error: NOT_BACKUP };
  if (raw.version !== SCHEMA_VERSION) {
    return { ok: false, error: "Este backup é de outra versão do app e não pode ser importado." };
  }
  const { topics, quizzes, mistakes, attempts } = raw;
  const valid =
    isObject(topics) &&
    Object.values(topics).every((status) => TOPIC_STATUSES.includes(status)) &&
    isObject(quizzes) &&
    Object.values(quizzes).every(isQuizEntry) &&
    isStringList(mistakes) &&
    Array.isArray(attempts) &&
    attempts.every(isAttempt);
  if (!valid) return { ok: false, error: NOT_BACKUP };
  return {
    ok: true,
    progress: {
      version: SCHEMA_VERSION,
      topics: topics as Progress["topics"],
      quizzes: quizzes as Progress["quizzes"],
      mistakes,
      attempts,
    },
  };
}
