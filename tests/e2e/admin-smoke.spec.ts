import { test, expect } from '@playwright/test'

const base = process.env.TEST_BASE_URL || 'http://localhost:4173'

test('admin login and navigate admin pages (smoke)', async ({ page }) => {
  await page.goto(`${base}/admin/login`)
  await expect(page.locator('text=Admin Login')).toBeVisible()

  await page.fill('input[placeholder="admin"]', 'admin')
  await page.fill('input[type="password"]', 'password')
  await page.click('button:has-text("Login")')

  // wait for dashboard load
  await page.waitForURL('**/admin/dashboard', { timeout: 5000 })
  await expect(page.locator('text=Admin Portal')).toBeVisible()

  // capture dashboard screenshot
  await page.screenshot({ path: 'tests/e2e/screens/admin-dashboard.png', fullPage: true })

  // visit documents page
  await page.goto(`${base}/admin/documents`)
  await expect(page.locator('text=Documents for Verification')).toBeVisible()
  await page.screenshot({ path: 'tests/e2e/screens/admin-documents.png', fullPage: true })

  // visit candidates list
  await page.goto(`${base}/admin/candidates`)
  await expect(page.getByRole('heading', { name: 'Candidates' })).toBeVisible()
  await page.screenshot({ path: 'tests/e2e/screens/admin-candidates.png', fullPage: true })

  // candidate view navigation is flaky in CI — skipping detailed navigation here
})
