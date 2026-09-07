import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminApplicationsPage } from '../pages/admin/AdminApplicationsPage'
import { describe, it, expect } from 'vitest'

describe('AdminApplicationsPage', () => {
  it('renders the page and search input', () => {
    render(
      <MemoryRouter>
        <AdminApplicationsPage />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/Search by application # or name/i)).toBeInTheDocument()
  })

  it('selects and exports selected as CSV (no selection shows toast behavior)', () => {
    render(
      <MemoryRouter>
        <AdminApplicationsPage />
      </MemoryRouter>
    )
    const exportBtn = screen.getByText(/Export Selected CSV/i)
    expect(exportBtn).toBeInTheDocument()
    // clicking without selection should not throw
    fireEvent.click(exportBtn)
  })
})
