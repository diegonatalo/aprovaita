import { test } from "@playwright/test";
import { markSeen } from "./fixtures";

// Gera os prints da landing em public/landing/. Fica fora da suíte normal:
// rode com `SCREENSHOTS=1 pnpm test:e2e e2e/screenshots.spec.ts`.
test.skip(!process.env.SCREENSHOTS, "só com SCREENSHOTS=1");

for (const scheme of ["light", "dark"] as const) {
  test(`print do início (${scheme})`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: scheme });
    // Um tópico estudado, para o progresso não aparecer zerado.
    await markSeen(page);
    await page.goto("/app");
    await page.waitForTimeout(1_500);
    const name = scheme === "light" ? "inicio-claro" : "inicio-escuro";
    await page.screenshot({ path: `public/landing/${name}.png` });
  });
}
