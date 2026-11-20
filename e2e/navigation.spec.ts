import { expect, test } from "@playwright/test";
import { TOPIC_PATH } from "./fixtures";

const PAGES = [
  { path: "/app", heading: null },
  { path: "/app/conteudo", heading: "O que vamos estudar hoje?" },
  { path: "/app/conteudo/matematica", heading: "Matemática" },
  { path: TOPIC_PATH, heading: null },
  { path: "/app/simulado", heading: "Simulados" },
  { path: "/app/revisao", heading: "Caderno de erros" },
  { path: "/app/progresso", heading: "Progresso" },
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

const collectErrors = (page: import("@playwright/test").Page) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
};

test("a página inicial apresenta o Aprova Ita e leva ao app", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Câmara de Itanhaém/);
  await page.getByRole("main").getByRole("link", { name: "Começar a estudar" }).first().click();
  await expect(page).toHaveURL("/app");
  expect(errors).toEqual([]);
});

test("os endereços antigos redirecionam para /app", async ({ request }) => {
  for (const [from, to] of [
    ["/conteudo", "/app/conteudo"],
    ["/conteudo/matematica", "/app/conteudo/matematica"],
    ["/simulado", "/app/simulado"],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

for (const { path, heading } of [
  { path: "/privacidade", heading: "Privacidade" },
  { path: "/termos", heading: "Termos de uso" },
]) {
  test(`abre ${path} pelo rodapé sem erros no console`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: heading }).click();
    await expect(page).toHaveURL(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
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
