import { test, expect } from '@playwright/test';

test.describe('UUID Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/uuid-generator');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('UUID Generator');
  });

  test('generates a UUID on button click', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate' }).click();

    const uuidText = page.locator('p.font-mono');
    const text = await uuidText.textContent();
    expect(text).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  test('copy button copies UUID to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Generate' }).click();

    const uuidText = page.locator('p.font-mono');
    const expected = await uuidText.textContent();

    await page.getByRole('button', { name: 'Copy' }).first().click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe(expected);
  });

  test('version toggle switches between v4 and v1', async ({ page }) => {
    await page.getByRole('button', { name: 'v1' }).click();
    await page.getByRole('button', { name: 'Generate' }).click();

    const uuidText = page.locator('p.font-mono');
    const text = await uuidText.textContent();
    expect(text).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  test('history shows last generated UUIDs', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.getByRole('button', { name: 'Generate' }).click();

    const historyItems = page.locator('ul li span.font-mono');
    await expect(historyItems).toHaveCount(2);
  });
});
