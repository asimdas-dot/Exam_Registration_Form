import React, { useEffect, useMemo, useState } from 'react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'
import { downloadCSV } from '../../utils/csv'
export const AdminAuditLogsPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    setItems(mockAdminService.getAuditLogs())
    const unsub = mockAdminService.subscribe(() => setItems(mockAdminService.getAuditLogs()))
    return () => unsub()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (query) {
        const q = query.toLowerCase()
        const matchesText = i.applicationNumber?.toLowerCase().includes(q) || i.action?.toLowerCase().includes(q) || i.by?.toLowerCase().includes(q)
        if (!matchesText) return false
      }
      if (startDate) {
        const s = new Date(startDate)
        if (new Date(i.timestamp) < s) return false
      }
      if (endDate) {
        const e = new Date(endDate)
        // include whole day
        e.setHours(23, 59, 59, 999)
        if (new Date(i.timestamp) > e) return false
      }
      return true
    })
  }, [items, query, startDate, endDate])

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Audit Logs</h2>
            <div className="flex items-center gap-2">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs" className="px-3 py-2 border rounded" />

              <label className="text-sm text-slate-600">From</label>
              <input type="date" value={startDate || ''} onChange={(e) => setStartDate(e.target.value || null)} className="px-2 py-2 border rounded" />
              <label className="text-sm text-slate-600">To</label>
              <input type="date" value={endDate || ''} onChange={(e) => setEndDate(e.target.value || null)} className="px-2 py-2 border rounded" />

              <button onClick={() => downloadCSV('audit-logs.csv', filtered)} className="px-3 py-2 rounded bg-slate-700 text-white">Export CSV</button>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Application</th>
                  <th className="px-4 py-3 text-left">By</th>
                  <th className="px-4 py-3 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="px-4 py-3">{new Date(i.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{i.action}</td>
                    <td className="px-4 py-3">{i.applicationNumber || '—'}</td>
                    <td className="px-4 py-3">{i.by || 'system'}</td>
                    <td className="px-4 py-3">{i.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-600">Showing {pageItems.length} of {total} log entries</div>
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
