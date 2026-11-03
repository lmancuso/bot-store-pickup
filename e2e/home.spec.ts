import { expect, test } from "@playwright/test";

test("home loads", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.ok()).toBe(true);
  await expect(page.locator("body")).toBeVisible();
});
