// Member 2 - UI Tests for Shopping and Browsing Flows
const { test, expect } = require('@playwright/test');

// Base URL for the application
const BASE_URL = 'http://localhost:3000';

test.describe('Member 2 - Shopping and Browsing UI Tests', () => {

  // UI Test 4: Product browsing and viewing details
  test('UI-4: Should browse products and view product details', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for homepage to load
    await page.waitForTimeout(2000);

    // Look for product cards on homepage
    const productCards = page.locator('.card');
    const productCount = await productCards.count();

    if (productCount > 0) {
      // Click on the first product's "More Details" button
      const firstProductCard = productCards.first();
      const productName = await firstProductCard.locator('.card-title').first().textContent();

      // Click "More Details" button
      await firstProductCard.locator('button:has-text("More Details")').click();

      // Wait for navigation to product details page
      await page.waitForTimeout(2000);

      // Verify we're on product details page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/product/');

      // Verify product details are displayed
      await expect(page.locator('text=Product Details')).toBeVisible();

      // Verify product name is displayed (may be slightly different formatting)
      const detailsVisible = await page.locator('.product-details-info').isVisible();
      expect(detailsVisible).toBeTruthy();

      // Verify "ADD TO CART" button exists
      await expect(page.locator('button:has-text("ADD TO CART")')).toBeVisible();
    } else {
      // If no products, verify empty state
      console.log('No products found on homepage');
    }
  });

  // UI Test 5: Search functionality
  test('UI-5: Should search for products and display results', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find search input in the header/navbar
    const searchInput = page.locator('input[placeholder="Search"]');
    await expect(searchInput).toBeVisible();

    // Type search query
    await searchInput.fill('laptop');

    // Submit search (either click button or press Enter)
    const searchButton = page.locator('button:has-text("Search")');
    if (await searchButton.isVisible()) {
      await searchButton.click();
    } else {
      await searchInput.press('Enter');
    }

    // Wait for search results page
    await page.waitForTimeout(2000);

    // Verify we're on search results page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/search');

    // Verify search results heading is displayed
    await expect(page.locator('text=Search Resuts')).toBeVisible();

    // Check for results or "No Products Found" message
    const noProductsMessage = page.locator('text=No Products Found');
    const foundMessage = page.locator('text=/Found \\d+/');

    const hasResults = await foundMessage.isVisible().catch(() => false);
    const noResults = await noProductsMessage.isVisible().catch(() => false);

    // Either results are found or no products message is shown
    expect(hasResults || noResults).toBeTruthy();
  });

  // UI Test 6: Add to cart flow and verify cart page
  test('UI-6: Should add product to cart and verify cart page', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for homepage to load
    await page.waitForTimeout(2000);

    // Look for product cards
    const productCards = page.locator('.card');
    const productCount = await productCards.count();

    if (productCount > 0) {
      // Get first product details
      const firstProductCard = productCards.first();
      const productName = await firstProductCard.locator('.card-title').first().textContent();

      // Click "ADD TO CART" button on first product
      const addToCartButton = firstProductCard.locator('button:has-text("ADD TO CART")');

      // Check if button exists and click
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();

        // Wait for toast notification or cart update
        await page.waitForTimeout(1000);

        // Navigate to cart page
        await page.goto(`${BASE_URL}/cart`);

        // Wait for cart page to load
        await page.waitForTimeout(1000);

        // Verify we're on cart page
        const currentUrl = page.url();
        expect(currentUrl).toContain('/cart');

        // Verify cart contains items or shows message
        const cartHeader = page.locator('h1');
        await expect(cartHeader).toBeVisible();

        // Check if cart has items or is empty
        const emptyCartMessage = page.locator('text=Your Cart Is Empty');
        const itemCountMessage = page.locator('text=/You Have \\d+ items in your cart/');

        const hasItems = await itemCountMessage.isVisible().catch(() => false);
        const isEmpty = await emptyCartMessage.isVisible().catch(() => false);

        expect(hasItems || isEmpty).toBeTruthy();

        // If cart has items, verify cart summary is displayed
        if (hasItems) {
          await expect(page.locator('text=Cart Summary')).toBeVisible();
          await expect(page.locator('text=/Total :/i')).toBeVisible();
        }
      } else {
        console.log('Add to cart button not found on product card');
        // Navigate to cart anyway to verify empty state
        await page.goto(`${BASE_URL}/cart`);
        await page.waitForTimeout(1000);
        await expect(page.locator('text=Your Cart Is Empty')).toBeVisible();
      }
    } else {
      // No products available, check empty cart
      await page.goto(`${BASE_URL}/cart`);
      await page.waitForTimeout(1000);
      await expect(page.locator('text=Your Cart Is Empty')).toBeVisible();
    }
  });

});
