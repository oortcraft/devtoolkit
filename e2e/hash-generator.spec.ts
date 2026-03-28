import { test, expect } from '@playwright/test';

test.describe('Hash Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/hash-generator');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hash Generator');
  });

  test('generates hash on input', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('hello');
    await page.waitForTimeout(500);
    await expect(page.locator('.font-mono').first()).not.toBeEmpty();
  });

  test('algorithm tabs switch correctly', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('test');
    await page.getByRole('button', { name: 'MD5' }).click();
    await page.waitForTimeout(500);
    const md5 = await page.locator('.font-mono').first().textContent();
    expect(md5).toHaveLength(32);
  });

  test('copy button appears', async ({ page }) => {
    const input = page.locator('textarea').first();
    await input.fill('hello');
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
  });
});
