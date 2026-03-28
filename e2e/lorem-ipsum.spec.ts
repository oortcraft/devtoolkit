import { test, expect } from '@playwright/test';

test.describe('Lorem Ipsum Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/lorem-ipsum');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Lorem Ipsum');
  });

  test('generates text on load', async ({ page }) => {
    const output = page.locator('textarea').first();
    const text = await output.inputValue();
    expect(text).toContain('Lorem ipsum');
  });

  test('generate button produces new text', async ({ page }) => {
    const output = page.locator('textarea').first();
    const before = await output.inputValue();
    await page.getByRole('button', { name: 'Generate' }).click();
    const after = await output.inputValue();
    expect(after).toContain('Lorem ipsum');
  });

  test('paragraph count changes output', async ({ page }) => {
    await page.selectOption('#para-count', '1');
    await page.getByRole('button', { name: 'Generate' }).click();
    const one = await page.locator('textarea').first().inputValue();

    await page.selectOption('#para-count', '5');
    await page.getByRole('button', { name: 'Generate' }).click();
    const five = await page.locator('textarea').first().inputValue();

    expect(five.length).toBeGreaterThan(one.length);
  });
});
