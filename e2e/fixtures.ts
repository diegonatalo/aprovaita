import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

/** Tópico usado nos testes: tem 5 questões autorais no quiz A. */
export const TOPIC = { area: "matematica", slug: "equacoes-sistemas" };
export const TOPIC_PATH = `/app/conteudo/${TOPIC.area}/${TOPIC.slug}`;

/** Gabarito do quiz A, lido do próprio conteúdo para o teste não ficar desatualizado. */
export const quizAnswers = (): number[] => {
  const file = path.join(process.cwd(), "content", TOPIC.area, TOPIC.slug, "questoes-autorais.json");
  const questions = JSON.parse(readFileSync(file, "utf8")) as { answerKey: number; choices: unknown[] }[];
  return questions.map((q) => q.answerKey);
};

export const markSeen = async (page: Page) => {
  await page.goto(TOPIC_PATH);
  const button = page.getByRole("button", { name: "Marcar como visto" });
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
};
