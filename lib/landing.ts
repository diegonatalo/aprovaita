import { EXAM } from "@/lib/exam";

/** Textos da landing (`/`). As seções ficam em `components/landing/`. */

export const HERO = {
  kicker: `${EXAM.position} · ${EXAM.exam}`,
  title: "Estude para o concurso da Câmara de Itanhaém num lugar só.",
  subtitle: `Todo o conteúdo do edital organizado em tópicos, com explicação e questões comentadas, simulados de ${EXAM.totalQuestions} questões no tempo da prova e um caderno com tudo o que você errou.`,
  note: "Grátis, sem cadastro e funciona no celular, até sem internet.",
};

export type Step = { title: string; text: string };

export const STEPS: Step[] = [
  {
    title: "Estude por tópico",
    text: "Português, Matemática, Legislação e Específicos, cada tópico com resumo e questões para fixar.",
  },
  {
    title: "Treine no tempo da prova",
    text: `Simulados de ${EXAM.totalQuestions} questões com cronômetro de ${EXAM.durationMinutes / 60} horas e a mesma divisão por área do edital.`,
  },
  {
    title: "Revise o que errou",
    text: "Cada erro vai para o caderno de erros, e o painel de progresso sugere o que estudar em seguida.",
  },
];

export type FeatureIcon = "book" | "exam" | "review" | "chart" | "offline" | "backup";

export type Feature = { icon: FeatureIcon; title: string; text: string };

export const FEATURES: Feature[] = [
  {
    icon: "book",
    title: "Conteúdo do edital",
    text: "Os tópicos do edital explicados em linguagem direta, com questões comentadas em cada um.",
  },
  {
    icon: "exam",
    title: "Simulados cronometrados",
    text: `${EXAM.totalQuestions} questões por simulado, na proporção de cada área, com correção na hora.`,
  },
  {
    icon: "review",
    title: "Caderno de erros",
    text: "As questões que você errou ficam guardadas para refazer até acertar.",
  },
  {
    icon: "chart",
    title: "Progresso por área",
    text: "Veja quanto do edital já estudou, seu desempenho por área e o próximo tópico sugerido.",
  },
  {
    icon: "offline",
    title: "Funciona offline",
    text: "Instale no celular e estude no ônibus ou onde não tiver sinal.",
  },
  {
    icon: "backup",
    title: "Backup do progresso",
    text: "Exporte o progresso num arquivo para guardar ou continuar em outro aparelho.",
  },
];

export type Screenshot = { light: string; dark: string; alt: string };

/** Prints gerados por `e2e/screenshots.spec.ts` (nunca à mão). */
export const SCREENSHOT: Screenshot = {
  light: "/landing/inicio-claro.webp",
  dark: "/landing/inicio-escuro.webp",
  alt: "Tela inicial do Aprova Ita com a contagem para a prova, o progresso geral e as áreas de estudo.",
};

export type Faq = { question: string; answer: string };

export const FAQ: Faq[] = [
  { question: "É grátis?", answer: "É. Não tem plano pago, cadastro nem anúncio." },
  {
    question: "Onde fica o meu progresso?",
    answer: "Só no seu navegador. Nada do que você estuda ou responde vai para um servidor.",
  },
  {
    question: "Como levo o progresso para o celular?",
    answer: "Em Progresso, exporte o backup num aparelho e importe no outro.",
  },
  {
    question: "É oficial?",
    answer:
      "Não. É um material de estudo independente, sem ligação com a Câmara nem com a VUNESP. Confira sempre o edital oficial.",
  },
];

export type Photo = { src: string; alt: string };

/** Foto do Unsplash (licença livre), guardada em `public/landing/`. */
export const PHOTO: Photo = { src: "/landing/estudo.webp", alt: "Mão escrevendo num caderno aberto com uma caneta laranja." };

/** Fatos da prova, lidos de `lib/exam.ts` (fonte única dos parâmetros). */
export const EXAM_FACTS = [
  `${EXAM.totalQuestions} questões`,
  `${EXAM.durationMinutes / 60} horas de prova`,
  EXAM.exam,
  `Nota mínima ${EXAM.cutoffScore}`,
];
