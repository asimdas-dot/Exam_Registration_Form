import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'

export const AdminCandidateViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState<any>(null)

  useEffect(() => {
    const load = () => {
      const c = id ? mockAdminService.getCandidateByApp(id) : null
      setCandidate(c)
    }
    const unsub = mockAdminService.subscribe(load)
    load()
    return () => unsub()
  }, [id])

  if (!candidate) return <div className="min-h-screen p-6">Candidate not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Candidate {candidate.name}</h2>
              <div className="text-sm text-slate-500">Application {candidate.applicationNumber}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded">Back</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded shadow-sm">
              <h3 className="font-semibold mb-2">Profile</h3>
              <div className="text-sm text-slate-600"><strong>Name:</strong> {candidate.name}</div>
              <div className="text-sm text-slate-600"><strong>Application #:</strong> {candidate.applicationNumber}</div>
              <div className="text-sm text-slate-600"><strong>Email:</strong> {candidate.email}</div>
              <div className="text-sm text-slate-600"><strong>Mobile:</strong> {candidate.mobile}</div>
            </div>

            <div className="p-4 bg-white rounded shadow-sm">
              <h3 className="font-semibold mb-2">Status</h3>
              <div className="text-sm text-slate-600"><strong>Current:</strong> {candidate.status}</div>
              <div className="text-sm text-slate-600"><strong>Registered:</strong> {candidate.registrationDate}</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded shadow-sm">
            <h3 className="font-semibold mb-2">Notes</h3>
            <div className="text-sm text-slate-600">No admin notes.</div>
          </div>

          <div className="mt-6 p-4 bg-white rounded shadow-sm">
            <h3 className="font-semibold mb-3">Uploaded Documents</h3>
            <div className="space-y-3">
              {mockAdminService.getUploadedDocuments().filter(d => d.record?.applicationNumber === candidate.applicationNumber).length === 0 ? (
                <div className="text-sm text-slate-600">No uploads for this candidate.</div>
              ) : (
                mockAdminService.getUploadedDocuments().filter(d => d.record?.applicationNumber === candidate.applicationNumber).map((d) => (
                  <div key={d.key} className="flex items-start justify-between gap-4 border rounded p-3">
                    <div className="flex gap-3 items-center">
                      {d.record?.dataUrl && d.record.dataUrl.startsWith('data:image') ? (
                        <img src={d.record.dataUrl} alt={d.record.fileName} className="h-12 w-12 rounded object-cover border" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">PDF</div>
                      )}
                      <div>
                        <div className="text-sm font-medium">{d.record?.fileName || d.key}</div>
                        <div className="text-xs text-slate-500">Uploaded: {d.record?.uploadedAt ? new Date(d.record.uploadedAt).toLocaleString() : '—'}</div>
                        <div className="text-xs mt-1">Status: <span className={['inline-block rounded px-2 py-0.5 text-xs', d.record?.status === 'approved' ? 'bg-success-100 text-success-700' : d.record?.status === 'rejected' ? 'bg-danger-100 text-danger-700' : 'bg-warning-50 text-warning-700'].join(' ')}>{d.record?.status || 'pending'}</span></div>
                        {d.record?.adminRemark ? <div className="text-xs mt-1 text-slate-600">Note: {d.record.adminRemark}</div> : null}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <button onClick={() => window.open(d.record?.dataUrl || '')} className="px-3 py-1 rounded bg-slate-100 text-slate-700">Preview</button>
                        <button onClick={() => mockAdminService.approveDocument(d.key, 'admin')} className="px-3 py-1 rounded bg-success-600 text-white">Approve</button>
                        <button onClick={() => { const r = prompt('Reason for rejection (optional):') || ''; mockAdminService.rejectDocument(d.key, r, 'admin') }} className="px-3 py-1 rounded bg-danger-600 text-white">Reject</button>
                        <button onClick={() => { const note = prompt('Add note (optional):') || ''; if (note) mockAdminService.setDocumentRemark(d.key, note, 'admin') }} className="px-3 py-1 rounded border">Add Note</button>
                      </div>
                      <div className="text-xs text-slate-500">Key: {d.key}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
