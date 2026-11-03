import { expect, test } from "@playwright/test";

test("home loads chat", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.ok()).toBe(true);
  await expect(page.getByTestId("chat-app")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Store Pickup" })).toBeVisible();
});
