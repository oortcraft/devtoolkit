import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('homepage has unique title and description', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DevToolkit/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.+/);
  });

  test('tool page has unique title', async ({ page }) => {
    await page.goto('/tools/json-formatter');
    await expect(page).toHaveTitle(/JSON Formatter/);
  });

  test('blog post has unique title', async ({ page }) => {
    await page.goto('/blog/what-is-json');
    await expect(page).toHaveTitle(/JSON/);
  });

  test('pages have OG tags', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
  });

  test('pages have canonical URL', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/);
  });

  test('sitemap exists', async ({ page }) => {
    const response = await page.goto('/sitemap-index.xml');
    expect(response!.status()).toBe(200);
  });

  test('robots.txt exists with sitemap reference', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response!.status()).toBe(200);
    const text = await response!.text();
    expect(text).toContain('Sitemap');
  });
});
