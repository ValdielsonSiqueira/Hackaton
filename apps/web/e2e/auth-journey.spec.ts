import { test, expect } from "@playwright/test";

test.describe("Jornada de Autenticação E2E", () => {
  test("deve acessar a página de login, realizar autenticação e redirecionar para o dashboard", async ({ page }) => {
    // 1. Acessar a aplicação
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);

    // 2. Preencher formulário de login
    await page.fill("#email-input", "estudante@fiap.com.br");
    await page.fill("#password-input", "senha123456");

    // 3. Submeter formulário
    await page.click("#login-submit-btn");

    // 4. Verificar se redirecionou para o Dashboard e exibiu a saudação
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("#welcome-banner")).toBeVisible();
  });
});
