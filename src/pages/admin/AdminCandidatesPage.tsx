import React, { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'

export const AdminCandidatesPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const [items, setItems] = React.useState<any[]>([])
  const [migrationStatus, setMigrationStatus] = useState<'idle'|'working'|'success'|'error'>('idle')
  const [migrationMessage, setMigrationMessage] = useState('')

  const [loadingBackend, setLoadingBackend] = useState(false)
  const [backendError, setBackendError] = useState<string | null>(null)

  async function fetchFromBackend() {
    setLoadingBackend(true)
    setBackendError(null)
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
      const res = await fetch(`${apiBase}/api/candidates`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setBackendError(String(e))
      setItems([])
    } finally {
      setLoadingBackend(false)
    }
  }

  useEffect(() => {
    // try loading from backend first, fall back to mock service
    fetchFromBackend()
    const unsub = mockAdminService.subscribe(() => setItems(mockAdminService.getCandidates()))
    // subscribe realtime events to refresh list when new applications are created
    let unsubRealtime: any = () => {}
    try {
      // dynamic import to avoid SSR/build issues
      import('../../services/realtimeService').then((m) => {
        unsubRealtime = m.realtimeService.subscribe((msg: any) => {
          if (!msg || !msg.type) return
          if (msg.type === 'application:created' || msg.type === 'application:status' || msg.type === 'application:bulk_status') {
            fetchFromBackend()
          }
        })
      }).catch(() => {})
    } catch (e) {}

    return () => {
      unsub()
      if (typeof unsubRealtime === 'function') unsubRealtime()
    }
  }, [])

  const filtered = useMemo(() => {
    return items.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.applicationNumber.includes(query))
  }, [items, query])

  const total = filtered.length
  const pages = Math.ceil(total / pageSize)
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Candidates</h2>
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or application #"
                className="px-3 py-2 border rounded"
              />
              <button
                onClick={async () => {
                  if (!confirm('Migrate candidates from the running app into the backend? This will clear existing candidates in the DB.')) return
                  try {
                    setMigrationStatus('working')
                    setMigrationMessage('')
                    const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
                    // clear existing
                    const delRes = await fetch(`${apiBase}/api/candidates`, { method: 'DELETE' })
                    const delJson = await delRes.json()
                    // collect current candidates from mock service
                    const data = mockAdminService.getCandidates()
                    const importRes = await fetch(`${apiBase}/api/candidates/import`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data),
                    })
                    const importJson = await importRes.json()
                    if (importRes.ok) {
                      setMigrationStatus('success')
                      setMigrationMessage(`Deleted ${delJson.deleted || 0}, Imported ${importJson.inserted || 0} candidates`)
                    } else {
                      setMigrationStatus('error')
                      setMigrationMessage(importJson.error || 'Import failed')
                    }
                  } catch (e: any) {
                    setMigrationStatus('error')
                    setMigrationMessage(String(e))
                  }
                }}
                className="px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                disabled={migrationStatus === 'working'}
              >
                {migrationStatus === 'working' ? 'Migrating...' : 'Migrate from app'}
              </button>

              <button
                onClick={async () => {
                  setMigrationStatus('working')
                  try {
                    await fetchFromBackend()
                    setMigrationStatus('success')
                    setMigrationMessage('Refreshed from backend')
                  } catch (e: any) {
                    setMigrationStatus('error')
                    setMigrationMessage(String(e))
                  }
                }}
                className="px-3 py-2 border rounded"
                disabled={loadingBackend}
              >
                {loadingBackend ? 'Refreshing...' : 'Refresh from backend'}
              </button>

              <button
                onClick={async () => {
                  if (!confirm('Clear all candidates from MongoDB? This action cannot be undone.')) return
                  setMigrationStatus('working')
                  setMigrationMessage('')
                  try {
                    const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
                    const response = await fetch(`${apiBase}/api/candidates`, { method: 'DELETE' })
                    const result = await response.json()
                    if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`)
                    setItems([])
                    setPage(1)
                    setMigrationStatus('success')
                    setMigrationMessage(`Cleared ${result.deleted || 0} candidates`)
                  } catch (e: any) {
                    setMigrationStatus('error')
                    setMigrationMessage(String(e))
                  }
                }}
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={migrationStatus === 'working'}
              >
                Clear all candidates
              </button>

              <div className="text-sm text-slate-600">
                {migrationStatus !== 'idle' && (
                  <div className={`mt-2 ${migrationStatus === 'error' ? 'text-red-600' : 'text-green-600'}`}>{migrationMessage || (migrationStatus === 'working' ? 'Working...' : '')}</div>
                )}
                {backendError && <div className="mt-2 text-red-600">Backend error: {backendError}</div>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Application #</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Registered</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.applicationNumber} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3"><Link to={`/admin/candidates/${c.applicationNumber}`} className="text-primary-600">{c.applicationNumber}</Link></td>
                    <td className="px-4 py-3"><Link to={`/admin/candidates/${c.applicationNumber}`} className="text-slate-700">{c.name}</Link></td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">{c.mobile}</td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3">{c.registrationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Showing {pageItems.length} of {total} candidates</div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <div className="px-3">{page} / {pages}</div>
              <button disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
