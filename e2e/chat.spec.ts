import { expect, test } from "@playwright/test";

test("send message, see reply, persists after reload", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByTestId("chat-app")).toBeVisible();
  const input = page.getByTestId("chat-input");
  await input.fill("Hola equipo");
  await page.getByTestId("chat-send").click();

  await expect(page.getByTestId("bubble-user").filter({ hasText: "Hola equipo" })).toBeVisible();
  await expect(page.getByTestId("typing-indicator")).toBeVisible();
  await expect(
    page.getByTestId("bubble-assistant").filter({ hasText: /categorías|comer|pizza/i }).last(),
  ).toBeVisible({ timeout: 10_000 });

  await page.reload();
  await expect(page.getByTestId("bubble-user").filter({ hasText: "Hola equipo" })).toBeVisible();
});

test("pizza highlights nearest and shows menu; can confirm order", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const input = page.getByTestId("chat-input");
  await input.fill("pizza");
  await page.getByTestId("chat-send").click();

  await expect(page.getByText(/Don Tomás/i).first()).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("menu-buttons")).toBeVisible();
  await expect(page.getByTestId("store-map")).toBeVisible();

  await page.getByRole("button", { name: /Agregar Muzzarella/i }).click();
  await expect(page.getByText(/Sumé 1× Muzzarella/i)).toBeVisible({ timeout: 10_000 });

  await input.fill("confirmar pedido");
  await page.getByTestId("chat-send").click();
  await expect(page.getByText(/Código de retiro:/i)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/Cómo llegar:/i)).toBeVisible();
});
