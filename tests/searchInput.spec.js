import { test, expect } from "@playwright/test";

test("SearchInput navigates to search results", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Type in search bar
  await page.fill('input[placeholder="Search"]', "Laptop");

  // Click search
  await page.click('button:has-text("Search")');

  // Expect to navigate to /search page
  await expect(page).toHaveURL(/.*\/search/);

  // Expect result visible
  await expect(page.locator("text=Laptop")).toBeVisible();
});
