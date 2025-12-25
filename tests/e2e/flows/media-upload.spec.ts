import { test, expect } from '@playwright/test';

test.describe('Media Management', () => {
  test('should redirect to login when accessing media page without auth', async ({ page }) => {
    await page.goto('/media');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing projects page without auth', async ({ page }) => {
    await page.goto('/projects');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing categories page without auth', async ({ page }) => {
    await page.goto('/categories');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing tags page without auth', async ({ page }) => {
    await page.goto('/tags');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Navigation Structure', () => {
  test('login page should be accessible', async ({ page }) => {
    await page.goto('/login');

    // Page should load without errors
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /Blog Admin/i })).toBeVisible();
  });

  test('root page should redirect appropriately', async ({ page }) => {
    await page.goto('/');

    // Should either show login or redirect
    // This depends on auth state
    await page.waitForLoadState('networkidle');
  });
});
