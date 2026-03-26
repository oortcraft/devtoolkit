import { test, expect } from '@playwright/test';

test.describe('JSON Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-formatter');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('JSON Formatter');
  });

  test('formats valid JSON', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('{"name":"test","value":42}');
    await page.getByRole('button', { name: 'Format' }).click();

    const result = await output.inputValue();
    expect(result).toContain('"name": "test"');
    expect(result).toContain('"value": 42');
  });

  test('minifies formatted JSON', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('{\n  "a": 1,\n  "b": 2\n}');
    await page.getByRole('button', { name: 'Minify' }).click();

    const result = await output.inputValue();
    expect(result).toBe('{"a":1,"b":2}');
  });

  test('shows error for invalid JSON', async ({ page }) => {
    const input = page.locator('textarea').first();

    await input.fill('{invalid json}');
    await page.getByRole('button', { name: 'Format' }).click();

    await expect(page.locator('p:has-text("Invalid JSON")')).toBeVisible();
  });

  test('indent tabs switch works', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('{"a":1}');
    await page.getByRole('button', { name: '4 spaces' }).click();
    await page.getByRole('button', { name: 'Format' }).click();

    const result = await output.inputValue();
    expect(result).toContain('    "a"');
  });

  test('copy button works', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const input = page.locator('textarea').first();

    await input.fill('{"a":1}');
    await page.getByRole('button', { name: 'Format' }).click();
    await page.getByRole('button', { name: 'Copy' }).click();

    await expect(page.getByText('Copied!')).toBeVisible();
  });
});
