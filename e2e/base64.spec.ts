import { test, expect } from '@playwright/test';

test.describe('Base64 Encoder / Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/base64');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Base64');
  });

  test('encodes text to Base64 automatically', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('Hello, World!');
    await page.waitForTimeout(400);

    const result = await output.inputValue();
    expect(result).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  test('switches to decode mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Decode' }).click();

    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('SGVsbG8sIFdvcmxkIQ==');
    await page.waitForTimeout(400);

    const result = await output.inputValue();
    expect(result).toBe('Hello, World!');
  });

  test('shows error for invalid Base64 in decode mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Decode' }).click();

    const input = page.locator('textarea').first();
    await input.fill('not-valid!!!');
    await page.waitForTimeout(400);

    await expect(page.locator('p:has-text("Invalid Base64")')).toBeVisible();
  });

  test('tool tabs show Base64 as active', async ({ page }) => {
    const activeTab = page.locator('nav a.shadow-sm', { hasText: 'Base64' });
    await expect(activeTab).toBeVisible();
  });
});
