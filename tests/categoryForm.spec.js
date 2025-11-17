import { test, expect } from "@playwright/test";

test("CategoryForm input and submit works", async ({ page }) => {
  await page.goto("http://localhost:3000/category"); // page with CategoryForm

  // Type in input
  await page.fill('input[placeholder="Enter new category"]', "Electronics");

  // Click submit
  await page.click('button:has-text("Submit")');

  // Expect success message or category added
  await expect(page.locator("text=Electronics")).toBeVisible();
});
