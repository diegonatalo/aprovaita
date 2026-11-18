import { expect, test } from "@playwright/test";
import { TOPIC_PATH } from "./fixtures";

const PAGES = [
  { path: "/", heading: null },
  { path: "/conteudo", heading: "O que vamos estudar hoje?" },
  { path: "/conteudo/matematica", heading: "Matemática" },
  { path: TOPIC_PATH, heading: null },
  { path: "/simulado", heading: "Simulados" },
  { path: "/revisao", heading: "Caderno de erros" },
  { path: "/progresso", heading: "Progresso" },
];

for (const { path, heading } of PAGES) {
  test(`abre ${path} sem erros no console`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(path);
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(heading ? page.getByRole("heading", { level: 1, name: heading }) : h1).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("endereço desconhecido mostra a página 404", async ({ page }) => {
  const response = await page.goto("/nao-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Essa página não existe" })).toBeVisible();
  await page.getByRole("link", { name: "Ir para o início" }).click();
  await expect(page).toHaveURL("/");
});
