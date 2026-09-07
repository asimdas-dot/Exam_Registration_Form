import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { AdminApplicationViewPage } from '../pages/admin/AdminApplicationViewPage'
import { mockAdminService } from '../services/mock/mockAdminService'

beforeEach(() => {
  // ensure clean state
  localStorage.clear()
  mockAdminService.resetToSeed()
})

describe('AdminApplicationViewPage', () => {
  it('approves an application and creates an audit log', async () => {
    const apps = mockAdminService.getApplications()
    const id = apps[0].applicationNumber

    render(
      <MemoryRouter initialEntries={[`/admin/applications/${id}`]}>
        <Routes>
          <Route path="/admin/applications/:id" element={<AdminApplicationViewPage />} />
        </Routes>
      </MemoryRouter>
    )

    // Click approve
    const approveBtn = await screen.findByText(/Approve/i)
    fireEvent.click(approveBtn)

    // Confirm modal confirm — find the button specifically
    const confirmBtn = await screen.findByRole('button', { name: /^Confirm$/i })
    fireEvent.click(confirmBtn)

    // Wait for audit log to appear
    await waitFor(() => {
      const logs = mockAdminService.getAuditLogs()
      const found = logs.find((l) => l.applicationNumber === id && l.action.includes('STATUS_CHANGE'))
      expect(!!found).toBe(true)
    })
  })

  it('rejects an application with remark', async () => {
    const apps = mockAdminService.getApplications()
    const id = apps[0].applicationNumber

    render(
      <MemoryRouter initialEntries={[`/admin/applications/${id}`]}>
        <Routes>
          <Route path="/admin/applications/:id" element={<AdminApplicationViewPage />} />
        </Routes>
      </MemoryRouter>
    )

    const rejectBtn = await screen.findByText(/Reject/i)
    fireEvent.click(rejectBtn)

    const textarea = await screen.findByPlaceholderText(/Reason for rejection/i)
    fireEvent.change(textarea, { target: { value: 'Invalid docs' } })

    const confirmBtn = await screen.findByRole('button', { name: /^Confirm$/i })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      const logs = mockAdminService.getAuditLogs()
      const found = logs.find((l) => l.applicationNumber === id && l.action.includes('STATUS_CHANGE') && l.note && String(l.note).includes('Invalid'))
      expect(!!found).toBe(true)
    })
  })
})
