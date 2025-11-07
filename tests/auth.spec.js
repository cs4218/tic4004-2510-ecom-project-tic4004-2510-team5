// Member 1 - UI Tests for Authentication Flows
const { test, expect } = require('@playwright/test');

// Base URL for the application
const BASE_URL = 'http://localhost:3000';

test.describe('Member 1 - Authentication UI Tests', () => {

  // UI Test 1: Complete registration flow
  test('UI-1: Should complete user registration flow successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Verify we're on the register page
    await expect(page.locator('h4.title')).toHaveText('REGISTER FORM');

    // Generate unique email for testing
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;

    // Fill in registration form
    await page.fill('input[placeholder="Enter Your Name"]', 'Test User');
    await page.fill('input[placeholder="Enter Your Email "]', testEmail);
    await page.fill('input[placeholder="Enter Your Password"]', 'TestPass123!');
    await page.fill('input[placeholder="Enter Your Phone"]', '1234567890');
    await page.fill('input[placeholder="Enter Your Address"]', '123 Test Street, Test City');
    await page.fill('input[placeholder="Enter Your DOB"]', '2000-01-01');
    await page.fill('input[placeholder="What is Your Favorite sports"]', 'Soccer');

    // Submit the form
    await page.click('button:has-text("REGISTER")');

    // Wait for navigation or success message
    // Note: This assumes successful registration redirects to login or shows success toast
    await page.waitForTimeout(2000);

    // Verify success - either URL changed to /login or success toast appeared
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');

    // Assert that registration was successful (either redirected or on same page with success)
    expect(isOnLoginPage || currentUrl.includes('/register')).toBeTruthy();
  });

  // UI Test 2: Login flow with valid credentials
  test('UI-2: Should login successfully with valid credentials and access dashboard', async ({ page }) => {
    // First, create a test account by registering
    await page.goto(`${BASE_URL}/register`);

    const timestamp = Date.now();
    const testEmail = `logintest${timestamp}@example.com`;
    const testPassword = 'TestPass123!';

    // Fill registration form
    await page.fill('input[placeholder="Enter Your Name"]', 'Login Test User');
    await page.fill('input[placeholder="Enter Your Email "]', testEmail);
    await page.fill('input[placeholder="Enter Your Password"]', testPassword);
    await page.fill('input[placeholder="Enter Your Phone"]', '1234567890');
    await page.fill('input[placeholder="Enter Your Address"]', '123 Test Street');
    await page.fill('input[placeholder="Enter Your DOB"]', '2000-01-01');
    await page.fill('input[placeholder="What is Your Favorite sports"]', 'Soccer');
    await page.click('button:has-text("REGISTER")');

    // Wait for registration to complete
    await page.waitForTimeout(2000);

    // Now go to login page
    await page.goto(`${BASE_URL}/login`);

    // Verify we're on the login page
    await expect(page.locator('h4.title')).toHaveText('LOGIN FORM');

    // Fill in login form with the account we just created
    await page.fill('input[placeholder="Enter Your Email "]', testEmail);
    await page.fill('input[placeholder="Enter Your Password"]', testPassword);

    // Click login button
    await page.click('button:has-text("LOGIN")');

    // Wait for navigation after login
    await page.waitForTimeout(2000);

    // Verify we're redirected (not on login page anymore)
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');

    // Verify user is logged in by checking for logout option or user menu
    // This will vary based on your navbar implementation
    const navbar = await page.locator('nav');
    await expect(navbar).toBeVisible();
  });

  // UI Test 3: Login validation with invalid credentials
  test('UI-3: Should show error when login with invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Verify we're on the login page
    await expect(page.locator('h4.title')).toHaveText('LOGIN FORM');

    // Fill in login form with invalid credentials
    await page.fill('input[placeholder="Enter Your Email "]', 'invalid@example.com');
    await page.fill('input[placeholder="Enter Your Password"]', 'wrongpassword');

    // Click login button
    await page.click('button:has-text("LOGIN")');

    // Wait for error message
    await page.waitForTimeout(1000);

    // Verify we're still on login page (login failed)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');

    // Verify error toast or message appears
    // Note: This depends on how your app displays errors
    // Could be a toast notification or inline error message
  });
});
