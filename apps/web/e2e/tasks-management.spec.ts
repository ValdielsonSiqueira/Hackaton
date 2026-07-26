import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Atividades E2E", () => {
  test("deve cadastrar uma nova atividade com prioridade urgente na página de tarefas", async ({ page }) => {
    // Authenticate into dashboard
    await page.goto("/login");
    await page.fill("#email-input", "estudante@fiap.com.br");
    await page.fill("#password-input", "senha123456");
    await page.click("#login-submit-btn");
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to tasks page
    await page.goto("/tarefas");
    await expect(page).toHaveURL(/\/tarefas/);

    // Open new task modal
    const newTaskBtn = page.locator("#btn-new-task");
    await expect(newTaskBtn).toBeVisible();
    await newTaskBtn.click();

    // Fill task form
    await page.fill("#new-task-name", "Entregar Desafio Final FIAP");
    
    // Click Urgent priority button
    const urgentBtn = page.getByRole("button", { name: /Urgente/i });
    await urgentBtn.click();

    // Save task
    await page.click("button:has-text('Salvar Atividade')");

    // Verify task is displayed on task list
    await expect(page.locator("body")).toContainText("Entregar Desafio Final FIAP");
  });
});
