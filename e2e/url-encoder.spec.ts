import { test, expect } from '@playwright/test';

test.describe('URL Encoder / Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/url-encoder');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('URL Encoder');
  });

  test('encodes text to URL-encoded format automatically', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('Hello World!');
    await page.waitForTimeout(400);

    const result = await output.inputValue();
    expect(result).toBe('Hello%20World!');
  });

  test('switches to decode mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Decode' }).click();

    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('Hello%20World!');
    await page.waitForTimeout(400);

    const result = await output.inputValue();
    expect(result).toBe('Hello World!');
  });

  test('shows error for malformed URL encoding in decode mode', async ({ page }) => {
    await page.getByRole('button', { name: 'Decode' }).click();

    const input = page.locator('textarea').first();
    await input.fill('%zz');
    await page.waitForTimeout(400);

    await expect(page.locator('p:has-text("Invalid URL encoding")')).toBeVisible();
  });

  test('tool tabs show URL Enc as active', async ({ page }) => {
    const activeTab = page.locator('nav a.shadow-sm', { hasText: 'URL Enc' });
    await expect(activeTab).toBeVisible();
  });
});
