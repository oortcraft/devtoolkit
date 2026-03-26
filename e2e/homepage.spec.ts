import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('renders hero section with title and CTA buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Developer Tools');
    await expect(page.getByText('Explore Tools')).toBeVisible();
    await expect(page.getByText('Read the Blog')).toBeVisible();
  });

  test('displays 3 tool cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('JSON Formatter')).toBeVisible();
    await expect(page.getByText('JSON Validator')).toBeVisible();
    await expect(page.getByText('JSON to YAML')).toBeVisible();
  });

  test('tool card links to correct tool page', async ({ page }) => {
    await page.goto('/');
    await page.getByText('JSON Formatter').click();
    await expect(page).toHaveURL(/\/tools\/json-formatter/);
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('has correct meta title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DevToolkit/);
  });
});
