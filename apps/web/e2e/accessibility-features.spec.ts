import { test, expect } from "@playwright/test";

test.describe("Recursos de Acessibilidade E2E", () => {
  test("deve abrir o painel de acessibilidade e aplicar os modos de contraste", async ({ page }) => {
    // Authenticate into dashboard
    await page.goto("/login");
    await page.fill("#email-input", "estudante@fiap.com.br");
    await page.fill("#password-input", "senha123456");
    await page.click("#login-submit-btn");
    await expect(page).toHaveURL(/\/dashboard/);

    // Open floating accessibility toolbar
    const a11yButton = page.locator("#a11y-toolbar-floating button");
    await expect(a11yButton).toBeVisible();
    await a11yButton.click();

    // Click Alto Contraste
    const highContrastBtn = page.getByRole("button", { name: /Contraste Alto/i });
    await expect(highContrastBtn).toBeVisible();
    await highContrastBtn.click();

    // Verify HTML element has 'high-contrast' class
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/high-contrast/);
  });
});
