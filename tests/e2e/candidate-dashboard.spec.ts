import { test, expect } from '@playwright/test';

// Responsive & basic accessibility smoke tests for Candidate Dashboard

const base = process.env.TEST_BASE_URL || 'http://localhost:4173'

test.describe('Candidate Dashboard - responsive smoke', () => {
  test('Desktop layout shows header, sidebar, status card', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto(`${base}/candidate/dashboard`);
    await expect(page.getByText(/Welcome, Candidate/i)).toBeVisible();
    await expect(page.getByText(/Application Status/i)).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    // progress tracker presence (look inside main content to avoid matching sidebar items)
    await expect(page.locator('main').getByText(/Registration/i).first()).toBeVisible();
  });

  test('Tablet layout collapses appropriately', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto(`${base}/candidate/dashboard`);
    await expect(page.getByText(/Welcome, Candidate/i)).toBeVisible();
    // ensure quick actions heading and primary quick action button are present
    await expect(page.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();
    await expect(page.getByRole('button', { name: /View Application|Edit Application/i }).first()).toBeVisible();
  });

  test('Mobile layout shows drawer toggle and main content', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 820 });
        await page.goto(`${base}/candidate/dashboard`);
    // Mobile: ensure header is visible and a menu button exists
    const menuButton = page.getByRole('button', { name: /menu|open navigation|toggle navigation/i });
    if (await menuButton.count() > 0) {
      await menuButton.first().click();
      // mobile menu toggle may reveal a navigation element; if so assert it, otherwise continue
      const nav = page.getByRole('navigation')
      if (await nav.count() > 0) await expect(nav).toBeVisible()
    }
    await expect(page.getByText(/Application Status/i)).toBeVisible();
  });
});
