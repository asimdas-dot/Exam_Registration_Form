import { test, expect } from '@playwright/test';

test.describe('Exam Registration System - smoke flows', () => {
  test('Landing page has hero and New Registration CTA', async ({ page }) => {
    await page.goto('/');
    // Check hero title
    await expect(page.getByRole('heading', { level: 1, name: /EXAM REGISTRATION SYSTEM/i })).toBeVisible();
    // Primary CTA
    await expect(page.getByRole('link', { name: /New Registration/i })).toBeVisible();
  });

  test('Open register route and progress UI exists', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByText(/Personal Information/i)).toBeVisible();
    // Check for form inputs
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue|Next|Save & Continue/i })).toBeVisible();
  });

  test('Candidate dashboard loads (mock) when visiting dashboard route', async ({ page }) => {
    await page.goto('/candidate/dashboard');
    // Basic text from dashboard
    await expect(page.getByText(/Welcome, Candidate/i)).toBeVisible();
    await expect(page.getByText(/Application Status/i)).toBeVisible();
  });
});
