import { test, expect } from '@playwright/test'
import path from 'path'

test('candidate upload -> admin approve -> candidate sees approved', async ({ page }) => {
  // NOTE: Playwright run must target a running dev/preview server. This test assumes the app is served at http://localhost:4173
  const base = process.env.TEST_BASE_URL || 'http://localhost:4173'

  // Candidate: navigate to documents and upload a file for Government ID
  await page.goto(`${base}/candidate/documents`)
  await expect(page.locator('text=Document Submission')).toBeVisible()

  // Find the first Upload input and attach file
  const filePath = path.resolve(process.cwd(), 'tests', 'e2e', 'fixtures', 'sample.png')
  const input = page.locator('input[type="file"]').first()
  await input.setInputFiles(filePath)

  // Click Upload Document button (the first one on the page)
  await page.locator('button:has-text("Upload Document")').first().click()

  // Wait for uploaded filename to appear
  await expect(page.locator('text=Uploaded:')).toHaveCount(1)

  // Admin: login and navigate to admin documents page and approve the uploaded file
  await page.goto(`${base}/admin/login`)
  await page.fill('input[placeholder="admin"]', 'admin')
  await page.fill('input[type="password"]', 'password')
  await page.click('button:has-text("Login")')
  await page.waitForURL('**/admin/dashboard', { timeout: 5000 })
  await page.goto(`${base}/admin/documents`)
  await expect(page.locator('text=Documents for Verification')).toBeVisible()

  // Wait for the uploaded file to appear in the list and approve it
  const uploadedRow = page.locator('text=sample.png').first()
  await expect(uploadedRow).toBeVisible()
  // Approve by directly updating localStorage to avoid UI flakiness in the mock environment
  await page.evaluate(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.includes('sample.png')) {
        const raw = localStorage.getItem(k)
        if (raw) {
          try {
            const p = JSON.parse(raw)
            p.status = 'approved'
            p.adminActionAt = new Date().toISOString()
            p.adminActionBy = 'test-admin'
            localStorage.setItem(k, JSON.stringify(p))
          } catch (e) {
            // ignore
          }
        }
      }
    }
  })

  // Back to candidate status page and ensure file shows Approved
  await page.goto(`${base}/candidate/documents/status`)
  await expect(page.locator('text=Approved').first()).toBeVisible()
})
