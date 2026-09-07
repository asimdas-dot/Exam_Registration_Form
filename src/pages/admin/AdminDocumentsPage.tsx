import React, { useEffect, useState } from 'react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'
import { Button } from '../../components/common/Button'

export const AdminDocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<Array<{ key: string; record: any }>>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const load = () => setDocs(mockAdminService.getUploadedDocuments())
    const unsub = mockAdminService.subscribe(load)
    load()
    return () => unsub()
  }, [])

  function handleApprove(k: string) {
    mockAdminService.approveDocument(k, 'admin')
  }

  function handleReject(k: string) {
    const reason = prompt('Reason for rejection (optional):') || ''
    mockAdminService.rejectDocument(k, reason, 'admin')
  }

  const [selected, setSelected] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const filtered = docs.filter((d) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    const fileName = (d.record?.fileName || '').toLowerCase()
    const key = (d.key || '').toLowerCase()
    const app = (d.record?.applicationNumber || '').toLowerCase()
    return fileName.includes(q) || key.includes(q) || app.includes(q)
  })

  React.useEffect(() => {
    if (selectAll) setSelected(filtered.map((f) => f.key))
    else setSelected([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll, query])

  const toggleSelect = (k: string) => {
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))
  }

  function handleBulkApprove() {
    if (!selected.length) return alert('No documents selected')
    const changed = mockAdminService.bulkApproveDocuments(selected, 'admin')
    alert(`Approved ${changed.length} documents`)
  }

  function handleBulkReject() {
    if (!selected.length) return alert('No documents selected')
    const reason = prompt('Reason for rejection (optional):') || ''
    const changed = mockAdminService.bulkRejectDocuments(selected, reason, 'admin')
    alert(`Rejected ${changed.length} documents`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Documents for Verification</h2>
              <div className="text-sm text-slate-500">All uploaded documents across candidates</div>
            </div>
          <div className="flex items-center gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by file, key or application" className="px-3 py-2 border rounded" />
          </div>
          </div>

          <div className="mb-3 flex items-center gap-2">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />
              <span className="text-sm text-slate-600">Select all results</span>
            </label>
            <button onClick={handleBulkApprove} className="px-3 py-2 rounded bg-emerald-600 text-white">Approve Selected</button>
            <button onClick={handleBulkReject} className="px-3 py-2 rounded bg-rose-600 text-white">Reject Selected</button>
          </div>

          <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-6 bg-white rounded shadow-sm">No uploaded documents found.</div>
          ) : (
            filtered.map((d) => (
              <div key={d.key} className="p-4 bg-white rounded shadow-sm flex items-start justify-between gap-4">
                <div className="flex gap-3 items-center">
                  {d.record?.dataUrl && d.record.dataUrl.startsWith('data:image') ? (
                    <img src={d.record.dataUrl} alt={d.record.fileName} className="h-12 w-12 rounded object-cover border" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">PDF</div>
                  )}
                  <div>
                    <div className="text-sm font-semibold">{d.record?.applicationNumber ? `Application: ${d.record.applicationNumber}` : d.key}</div>
                    <div className="text-xs text-slate-600">File: {d.record?.fileName || '—'}</div>
                    <div className="text-xs text-slate-500">Uploaded: {d.record?.uploadedAt ? new Date(d.record.uploadedAt).toLocaleString() : '—'}</div>
                    <div className="text-xs mt-1">Status: <span className={['inline-block rounded px-2 py-0.5 text-xs', d.record?.status === 'approved' ? 'bg-success-100 text-success-700' : d.record?.status === 'rejected' ? 'bg-danger-100 text-danger-700' : 'bg-warning-50 text-warning-700'].join(' ')}>{d.record?.status || 'pending'}</span></div>
                    {d.record?.adminRemark ? <div className="text-xs mt-1 text-slate-600">Note: {d.record.adminRemark}</div> : null}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" checked={selected.includes(d.key)} onChange={() => toggleSelect(d.key)} />
                    </label>
                    <Button size="sm" onClick={() => { window.open(d.record?.dataUrl || '') }}>Preview</Button>
                    {d.record?.applicationNumber ? <Button variant="outline" size="sm" onClick={() => { window.location.href = `/admin/candidates/${d.record.applicationNumber}` }}>Open Candidate</Button> : null}
                    <Button variant="outline" size="sm" onClick={() => handleApprove(d.key)}>Approve</Button>
                    <Button variant="danger" size="sm" onClick={() => handleReject(d.key)}>Reject</Button>
                    <Button size="sm" variant="outline" onClick={() => { const note = prompt('Add note to document (optional):') || ''; if (note) mockAdminService.setDocumentRemark(d.key, note, 'admin') }}>Add Note</Button>
                  </div>
                  <div className="text-xs text-slate-500">Key: {d.key}</div>
                </div>
              </div>
            ))
          )}
          </div>
        </main>
      </div>
    </div>
  )
}
