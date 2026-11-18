import { expect, test } from "@playwright/test";
import { markSeen, TOPIC_PATH } from "./fixtures";

test("exporta o progresso e importa em outro navegador", async ({ page, browser }, testInfo) => {
  await markSeen(page);

  await page.goto("/progresso");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Exportar JSON" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^progresso-concurso-\d{4}-\d{2}-\d{2}\.json$/);
  const file = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(file);

  // Outro contexto é outro navegador, sem progresso salvo.
  const other = await browser.newContext();
  const fresh = await other.newPage();
  await fresh.goto(TOPIC_PATH);
  await expect(fresh.getByRole("button", { name: "Marcar como visto" })).toHaveAttribute("aria-pressed", "false");

  await fresh.goto("/progresso");
  await fresh.getByLabel("Importar JSON (substitui o atual)").setInputFiles(file);
  await expect(fresh.getByRole("status")).toHaveText("Progresso importado.");

  await fresh.goto(TOPIC_PATH);
  await expect(fresh.getByRole("button", { name: "Marcar como visto" })).toHaveAttribute("aria-pressed", "true");
  await other.close();
});

test("recusa um arquivo que não é progresso", async ({ page }) => {
  await page.goto("/progresso");
  await page.getByLabel("Importar JSON (substitui o atual)").setInputFiles({
    name: "qualquer.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"nada": true}'),
  });
  await expect(page.getByRole("status")).not.toHaveText("Progresso importado.");
});
