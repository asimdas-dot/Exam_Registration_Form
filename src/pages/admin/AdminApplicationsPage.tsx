import React, { useMemo, useState } from 'react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { downloadCSV } from '../../utils/csv'
export const AdminApplicationsPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const [items, setItems] = React.useState<any[]>([])

  useEffect(() => {
    setItems(mockAdminService.getApplications())
    const unsub = mockAdminService.subscribe(() => setItems(mockAdminService.getApplications()))
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const matchesQuery = a.applicationNumber.includes(query) || a.candidateName.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter ? a.status === statusFilter : true
      return matchesQuery && matchesStatus
    })
  }, [items, query, statusFilter])

  const total = filtered.length
  const pages = Math.ceil(total / pageSize)
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  const [selected, setSelected] = React.useState<string[]>([])
  const [selectAll, setSelectAll] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [bulkAction, setBulkAction] = React.useState<'APPROVE' | 'REJECT' | null>(null)
  const [remark, setRemark] = React.useState('')
  const [toast, setToast] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (selectAll) setSelected(filtered.map((f) => f.applicationNumber))
    else setSelected([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll, page, query, statusFilter])

  const toggleSelect = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const openBulk = (type: 'APPROVE' | 'REJECT') => {
    if (!selected.length) {
      setToast('No applications selected')
      setTimeout(() => setToast(null), 2000)
      return
    }
    setBulkAction(type)
    setConfirmOpen(true)
  }

  const confirmBulk = () => {
    if (!bulkAction) return
    const status = bulkAction === 'APPROVE' ? 'APPROVED' : 'REJECTED'
    const changed = mockAdminService.bulkUpdateApplications(selected, status, remark)
    setConfirmOpen(false)
    setToast(`Updated ${changed.length} applications`)
    setSelected([])
    setSelectAll(false)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Applications</h2>
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by application # or name"
                className="px-3 py-2 border rounded"
              />

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded">
                <option value="">All statuses</option>
                <option value="DRAFT">DRAFT</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_VERIFICATION">UNDER_VERIFICATION</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
              <button
                type="button"
                onClick={async () => {
                  if (!confirm('Clear all applications? This action cannot be undone.')) return
                  try {
                    const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
                    const response = await fetch(`${apiBase}/api/applications`, { method: 'DELETE' })
                    if (!response.ok && response.status !== 404) {
                      const result = await response.json()
                      throw new Error(result.error || `HTTP ${response.status}`)
                    }
                  } catch (error) {
                    console.warn('Application collection clear unavailable; clearing local application state.', error)
                  }
                  mockAdminService.clearApplications()
                  setSelected([])
                  setSelectAll(false)
                  setPage(1)
                  setToast('All applications cleared')
                  setTimeout(() => setToast(null), 3000)
                }}
                className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
              >
                Clear all applications
              </button>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />
              <span className="text-sm text-slate-600">Select all on page</span>
            </label>
            <button onClick={() => openBulk('APPROVE')} className="px-3 py-2 rounded bg-emerald-600 text-white">Approve Selected</button>
            <button onClick={() => openBulk('REJECT')} className="px-3 py-2 rounded bg-rose-600 text-white">Reject Selected</button>
            <button onClick={() => downloadCSV('selected-applications.csv', items.filter((i) => selected.includes(i.applicationNumber)))} className="px-3 py-2 rounded bg-slate-700 text-white">Export Selected CSV</button>
          </div>

          <div className="bg-white rounded shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">&nbsp;</th>
                  <th className="px-4 py-3 text-left">Application #</th>
                  <th className="px-4 py-3 text-left">Candidate</th>
                  <th className="px-4 py-3 text-left">Exam</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Documents</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((a) => (
                  <tr key={a.applicationNumber} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(a.applicationNumber)} onChange={() => toggleSelect(a.applicationNumber)} /></td>
                    <td className="px-4 py-3"><Link to={`/admin/applications/${a.applicationNumber}`} className="text-primary-600">{a.applicationNumber}</Link></td>
                    <td className="px-4 py-3"><Link to={`/admin/candidates/${a.applicationNumber}`} className="text-slate-700">{a.candidateName}</Link></td>
                    <td className="px-4 py-3">{a.exam}</td>
                    <td className="px-4 py-3">{a.paymentStatus}</td>
                    <td className="px-4 py-3">{a.documentStatus}</td>
                    <td className="px-4 py-3">{a.status}</td>
                    <td className="px-4 py-3">{a.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Showing {pageItems.length} of {total} applications</div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <div className="px-3">{page} / {pages}</div>
              <button disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>

          {/* confirmation modal */}
          {confirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
              <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                <h3 className="text-lg font-semibold">Confirm {bulkAction === 'APPROVE' ? 'Approval' : 'Rejection'}</h3>
                <p className="mt-2">Are you sure you want to {bulkAction === 'APPROVE' ? 'approve' : 'reject'} {selected.length} applications?</p>
                {bulkAction === 'REJECT' && (
                  <textarea value={remark} onChange={(e) => setRemark(e.target.value)} className="w-full border rounded p-2 mt-2" placeholder="Optional rejection note"></textarea>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setConfirmOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                  <button onClick={confirmBulk} className="px-3 py-2 rounded bg-primary-600 text-white">Confirm</button>
                </div>
              </div>
            </div>
          )}

          {toast && <div className="fixed bottom-5 right-5 z-50 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">{toast}</div>}
        </main>
      </div>
    </div>
  )
}
