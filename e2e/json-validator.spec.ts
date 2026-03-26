import { test, expect } from '@playwright/test';

test.describe('JSON Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-validator');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('JSON Validator');
  });

  test('validates valid JSON object', async ({ page }) => {
    const input = page.locator('textarea').first();

    await input.fill('{"name":"test","value":42}');
    await page.getByRole('button', { name: 'Validate' }).click();

    await expect(page.getByText('Valid JSON', { exact: true })).toBeVisible();
    await expect(page.getByText('2 key')).toBeVisible();
  });

  test('validates valid JSON array', async ({ page }) => {
    const input = page.locator('textarea').first();

    await input.fill('[1, 2, 3]');
    await page.getByRole('button', { name: 'Validate' }).click();

    await expect(page.getByText('Valid JSON', { exact: true })).toBeVisible();
    await expect(page.getByText('3 item')).toBeVisible();
  });

  test('shows error for invalid JSON', async ({ page }) => {
    const input = page.locator('textarea').first();

    await input.fill('{bad json}');
    await page.getByRole('button', { name: 'Validate' }).click();

    await expect(page.getByText('Invalid JSON', { exact: true })).toBeVisible();
  });

  test('resets result when input changes', async ({ page }) => {
    const input = page.locator('textarea').first();

    await input.fill('{"a":1}');
    await page.getByRole('button', { name: 'Validate' }).click();
    await expect(page.getByText('Valid JSON', { exact: true })).toBeVisible();

    await input.fill('{"a":1, "b"');
    await expect(page.getByText('Valid JSON', { exact: true })).not.toBeVisible();
  });
});
