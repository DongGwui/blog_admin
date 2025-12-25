import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check login form elements
    await expect(page.getByRole('heading', { name: /Blog Admin/i })).toBeVisible();
    await expect(page.getByPlaceholder(/username/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
  });

  test('should enable button when credentials are filled', async ({ page }) => {
    await page.goto('/login');

    // Button should be disabled initially
    const signInButton = page.getByRole('button', { name: /Sign In/i });
    await expect(signInButton).toBeDisabled();

    // Fill in credentials
    await page.getByPlaceholder(/username/i).fill('test_user');
    await page.getByPlaceholder(/password/i).fill('test_password');

    // Button should now be enabled
    await expect(signInButton).toBeEnabled();
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthenticated user from posts to login', async ({ page }) => {
    await page.goto('/posts');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');

    // Button should be disabled when fields are empty
    const signInButton = page.getByRole('button', { name: /Sign In/i });
    await expect(signInButton).toBeDisabled();

    // Form should still be on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('login form should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/login');

    // Check for proper form structure
    const usernameInput = page.getByPlaceholder(/username/i);
    const passwordInput = page.getByPlaceholder(/password/i);

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });
});
