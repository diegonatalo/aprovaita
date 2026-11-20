import { expect, test } from "@playwright/test";
import { markSeen, quizAnswers, TOPIC, TOPIC_PATH } from "./fixtures";

test("marca o tópico como visto e mostra isso na lista da área", async ({ page }) => {
  await markSeen(page);
  const title = (await page.getByRole("heading", { level: 1 }).textContent())?.trim() ?? "";

  await page.reload();
  await expect(page.getByRole("button", { name: "Marcar como visto" })).toHaveAttribute("aria-pressed", "true");

  await page.goto(`/app/conteudo/${TOPIC.area}`);
  await expect(page.getByRole("link", { name: new RegExp(title) })).toContainText("Visto");
});

test("corrige o quiz e manda a questão errada para o caderno de erros", async ({ page }) => {
  const answers = quizAnswers();
  await page.goto(TOPIC_PATH);
  const quiz = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Quiz A — questões autorais" }),
  });

  const questions = quiz.getByRole("group");
  await expect(questions).toHaveCount(answers.length);
  for (const [i, key] of answers.entries()) {
    // Erra só a primeira questão.
    const choice = i === 0 ? (key + 1) % 4 : key;
    await questions.nth(i).getByRole("radio").nth(choice).check({ force: true });
  }
  await quiz.getByRole("button", { name: "Corrigir" }).click();
  await expect(quiz.getByText(`Você acertou ${answers.length - 1} de ${answers.length}.`)).toBeVisible();

  await page.reload();
  await expect(page.getByText(`Último resultado: ${answers.length - 1}/${answers.length}`)).toBeVisible();

  await page.goto("/app/revisao");
  await expect(page.getByText("1 questão(ões) errada(s).")).toBeVisible();
});

test("um simulado em andamento sobrevive a recarregar a página", async ({ page }) => {
  await page.goto("/app/simulado");
  await page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Simulado A — questões autorais" }) })
    .getByRole("button", { name: /^Iniciar/ })
    .click();
  await expect(page.getByRole("button", { name: "Finalizar" })).toBeVisible();
  await page.getByRole("group").first().getByRole("radio").first().check({ force: true });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Prova em andamento" })).toBeVisible();
  await expect(page.getByText(/1\/\d+ respondidas/)).toBeVisible();

  await page.getByRole("button", { name: "Retomar" }).click();
  await page.getByRole("button", { name: "Finalizar" }).click();
  await page.getByRole("button", { name: "Sim, finalizar" }).click();
  await expect(page.getByRole("heading", { name: /^Resultado — Simulado A/ })).toBeVisible();
});
