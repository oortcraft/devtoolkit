import { test, expect } from '@playwright/test';

test.describe('JSON to YAML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-to-yaml');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('JSON to YAML');
  });

  test('auto-converts valid JSON to YAML', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('{"name":"test","items":[1,2,3]}');

    // Wait for debounce (300ms)
    await page.waitForTimeout(500);

    const result = await output.inputValue();
    expect(result).toContain('name: test');
    expect(result).toContain('- 1');
  });

  test('shows error for invalid JSON', async ({ page }) => {
    const input = page.locator('textarea').first();

    await input.fill('{not valid}');
    await page.waitForTimeout(500);

    await expect(page.getByText('Invalid JSON')).toBeVisible();
  });

  test('clears output when input is emptied', async ({ page }) => {
    const input = page.locator('textarea').first();
    const output = page.locator('textarea').nth(1);

    await input.fill('{"a":1}');
    await page.waitForTimeout(500);
    expect(await output.inputValue()).toContain('a: 1');

    await input.fill('');
    await page.waitForTimeout(500);
    expect(await output.inputValue()).toBe('');
  });
});
