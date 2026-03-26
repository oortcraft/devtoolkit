import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('blog listing shows posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByText('What is JSON?')).toBeVisible();
    await expect(page.getByText('JSON vs XML')).toBeVisible();
  });

  test('blog post page renders content', async ({ page }) => {
    await page.goto('/blog/what-is-json');
    await expect(page.locator('h1')).toContainText('What is JSON');
    // Verify prose content renders (not empty)
    const article = page.locator('article');
    const text = await article.textContent();
    expect(text!.length).toBeGreaterThan(500);
  });

  test('blog post has related tools section', async ({ page }) => {
    await page.goto('/blog/what-is-json');
    await expect(page.getByText('Related Tools')).toBeVisible();
    await expect(page.getByRole('link', { name: 'JSON Formatter →' })).toBeVisible();
  });
});

test.describe('Static Pages', () => {
  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact page has mailto link', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('a[href^="mailto:"]')).toBeVisible();
  });
});
