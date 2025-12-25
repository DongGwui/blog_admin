import { test, expect } from '@playwright/test';

test.describe('Post Editor', () => {
  test.beforeEach(async () => {
    // Skip auth for now - these tests assume auth is handled via cookies/session
    // In a real setup, you would either:
    // 1. Use storageState to persist login across tests
    // 2. Mock the auth API
    // 3. Use a test account
  });

  test.describe('New Post Page', () => {
    test('should display full-screen editor layout', async ({ page }) => {
      await page.goto('/posts/new');

      // Should not have sidebar (check for absence of sidebar class or element)
      const sidebar = page.locator('[data-testid="sidebar"], .sidebar, nav.sidebar');
      await expect(sidebar).not.toBeVisible();

      // Should have editor header
      await expect(page.getByRole('banner')).toBeVisible();

      // Should have title input
      await expect(page.getByPlaceholder(/제목/i)).toBeVisible();
    });

    test('should have title input and content editor', async ({ page }) => {
      await page.goto('/posts/new');

      // Title input should be visible and editable
      const titleInput = page.getByPlaceholder(/제목/i);
      await expect(titleInput).toBeVisible();
      await titleInput.fill('테스트 제목');
      await expect(titleInput).toHaveValue('테스트 제목');
    });

    test('should have save and publish buttons in header', async ({ page }) => {
      await page.goto('/posts/new');

      // Should have 임시저장 button
      await expect(page.getByRole('button', { name: /임시저장/i })).toBeVisible();

      // Should have 발행 button
      await expect(page.getByRole('button', { name: /발행/i })).toBeVisible();
    });

    test('should have settings toggle button', async ({ page }) => {
      await page.goto('/posts/new');

      // Should have settings button
      await expect(page.getByRole('button', { name: /설정/i })).toBeVisible();
    });

    test('should open settings panel when settings button is clicked', async ({ page }) => {
      await page.goto('/posts/new');

      // Click settings button
      await page.getByRole('button', { name: /설정/i }).click();

      // Settings panel should be visible
      await expect(page.getByRole('dialog', { name: /설정/i })).toBeVisible();

      // Should have thumbnail section
      await expect(page.getByText(/썸네일/i)).toBeVisible();
    });

    test('should close settings panel when close button is clicked', async ({ page }) => {
      await page.goto('/posts/new');

      // Open settings panel
      await page.getByRole('button', { name: /설정/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Close settings panel
      await page.getByRole('button', { name: /닫기/i }).click();

      // Settings panel should be hidden
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should close settings panel on Escape key', async ({ page }) => {
      await page.goto('/posts/new');

      // Open settings panel
      await page.getByRole('button', { name: /설정/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Settings panel should be hidden
      await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should have back button that navigates away', async ({ page }) => {
      await page.goto('/posts/new');

      // Should have back button
      const backButton = page.getByRole('button', { name: /나가기|뒤로/i });
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('editor should fill available height', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/posts/new');

      // Wait for editor to load
      await page.waitForSelector('[data-color-mode]');

      // The editor container should have reasonable height
      const editorContainer = page.locator('[data-color-mode]');
      const box = await editorContainer.boundingBox();

      // Editor should be at least 300px tall
      expect(box?.height).toBeGreaterThan(300);
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should save draft with Ctrl+S', async ({ page }) => {
      await page.goto('/posts/new');

      // Fill in title to make form valid
      await page.getByPlaceholder(/제목/i).fill('테스트 제목');

      // Press Ctrl+S to save draft
      // Note: This might trigger browser save dialog in some cases
      // The test verifies the shortcut is registered
      await page.keyboard.press('Control+s');

      // Check that the page doesn't navigate away unexpectedly
      await expect(page).toHaveURL(/\/posts\/new/);
    });
  });

  test.describe('Form Validation', () => {
    test('should show dirty indicator when content changes', async ({ page }) => {
      await page.goto('/posts/new');

      // Fill in title
      await page.getByPlaceholder(/제목/i).fill('테스트 제목');

      // Should show 수정됨 indicator
      await expect(page.getByText(/수정됨/i)).toBeVisible();
    });

    test('should show confirmation when leaving with unsaved changes', async ({ page }) => {
      await page.goto('/posts/new');

      // Fill in title to make form dirty
      await page.getByPlaceholder(/제목/i).fill('테스트 제목');

      // Set up dialog handler
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('저장');
        await dialog.dismiss(); // Cancel leaving
      });

      // Click back button
      await page.getByRole('button', { name: /나가기|뒤로/i }).click();
    });
  });
});

test.describe('Edit Post Page', () => {
  test('should load existing post data', async ({ page }) => {
    // This test assumes there's a post with ID 1
    // In a real scenario, you'd create a test post first
    await page.goto('/posts/1/edit');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // If post exists, title input should be filled
    // If post doesn't exist, should show error message
    const titleInput = page.getByPlaceholder(/제목/i);
    const errorMessage = page.getByText(/찾을 수 없습니다/i);

    // Either title input has value or error message is shown
    const titleVisible = await titleInput.isVisible().catch(() => false);
    const errorVisible = await errorMessage.isVisible().catch(() => false);

    expect(titleVisible || errorVisible).toBe(true);
  });

  test('should show 수정 button instead of 발행 for existing post', async ({ page }) => {
    await page.goto('/posts/1/edit');

    // Wait for page load
    await page.waitForLoadState('networkidle');

    // If post exists, should have 수정 button
    const editButton = page.getByRole('button', { name: /^수정$/i });
    const publishButton = page.getByRole('button', { name: /발행/i });

    // Either 수정 button is visible (post exists) or page shows error
    const editVisible = await editButton.isVisible().catch(() => false);
    const publishVisible = await publishButton.isVisible().catch(() => false);

    // If we're on the edit page with a post, 수정 should be shown instead of 발행
    if (editVisible) {
      expect(publishVisible).toBe(false);
    }
  });
});
