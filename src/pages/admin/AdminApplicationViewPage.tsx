import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'
import { Modal } from '../../components/common/Modal'
import { Toast } from '../../components/common/Toast'
import { downloadCSV } from '../../utils/csv'
export const AdminApplicationViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null)
  const [remark, setRemark] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const load = () => {
      setLoading(true)
      const a = id ? mockAdminService.getApplicationById(id) : null
      setApplication(a)
      setLoading(false)
    }
    const unsub = mockAdminService.subscribe(load)
    load()
    return () => unsub()
  }, [id])

  if (loading) return <div className="min-h-screen p-6">Loading...</div>
  if (!application) return <div className="min-h-screen p-6">Application not found</div>

  const handleAction = (type: 'APPROVE' | 'REJECT') => {
    setActionType(type)
    setConfirmOpen(true)
  }

  const confirm = () => {
    if (!actionType) return
    const status = actionType === 'APPROVE' ? 'APPROVED' : 'REJECTED'
    mockAdminService.updateApplicationStatus(application.applicationNumber, status, remark)
    setConfirmOpen(false)
    setToast(`Application ${status}`)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold">Application {application.applicationNumber}</h2>
              <div className="text-sm text-slate-500">{application.candidateName} — {application.exam}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded">Back</button>
              <button onClick={() => handleAction('REJECT')} className="px-3 py-2 rounded bg-rose-600 text-white">Reject</button>
              <button onClick={() => handleAction('APPROVE')} className="px-3 py-2 rounded bg-emerald-600 text-white">Approve</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded shadow-sm">
              <h3 className="font-semibold mb-2">Candidate Information</h3>
              <div className="text-sm text-slate-600"><strong>Name:</strong> {application.candidateName}</div>
              <div className="text-sm text-slate-600"><strong>Application #:</strong> {application.applicationNumber}</div>
              <div className="text-sm text-slate-600"><strong>Email:</strong> {application.email || '—'}</div>
              <div className="text-sm text-slate-600"><strong>Mobile:</strong> {application.mobile || '—'}</div>
            </div>

            <div className="p-4 bg-white rounded shadow-sm">
              <h3 className="font-semibold mb-2">Application Details</h3>
              <div className="text-sm text-slate-600"><strong>Exam:</strong> {application.exam}</div>
              <div className="text-sm text-slate-600"><strong>Payment:</strong> {application.paymentStatus}</div>
              <div className="text-sm text-slate-600"><strong>Documents:</strong> {application.documentStatus}</div>
              <div className="text-sm text-slate-600"><strong>Status:</strong> {application.status}</div>
              <div className="text-sm text-slate-600"><strong>Submitted:</strong> {application.submittedAt}</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2">Application History</h3>
              <div>
                <button onClick={() => downloadCSV(`audit-${application.applicationNumber}.csv`, mockAdminService.getAuditLogs().filter((l) => l.applicationNumber === application.applicationNumber))} className="px-3 py-2 rounded bg-slate-700 text-white">Export Audit CSV</button>
              </div>
            </div>
            <ul className="text-sm text-slate-600 list-disc pl-5">
              {(application.history || []).map((h: any, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
 
            <div className="mt-4">
              <h4 className="font-medium">Audit entries</h4>
              <ul className="text-sm text-slate-600 list-disc pl-5">
                {mockAdminService.getAuditLogs().filter((l) => l.applicationNumber === application.applicationNumber).map((e) => (
                  <li key={e.id}>{new Date(e.timestamp).toLocaleString()} — {e.action} {e.note ? ` — ${e.note}` : ''}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Documents for this application */}
          <div className="mt-4 p-4 bg-white rounded shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2">Uploaded Documents</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const docs = mockAdminService.getUploadedDocuments().filter(d => d.record?.applicationNumber === application.applicationNumber)
                  downloadCSV(`documents-${application.applicationNumber}.csv`, docs.map(d => ({ key: d.key, fileName: d.record?.fileName, status: d.record?.status, uploadedAt: d.record?.uploadedAt })))
                }} className="px-3 py-2 rounded bg-slate-700 text-white">Export Documents CSV</button>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {mockAdminService.getUploadedDocuments().filter(d => d.record?.applicationNumber === application.applicationNumber).length === 0 ? (
                <div className="text-sm text-slate-600">No uploaded documents for this application.</div>
              ) : (
                mockAdminService.getUploadedDocuments().filter(d => d.record?.applicationNumber === application.applicationNumber).map((d) => (
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

          <Modal open={confirmOpen} title={actionType === 'APPROVE' ? 'Confirm Approval' : 'Confirm Rejection'} onClose={() => setConfirmOpen(false)}>
            <div className="space-y-3">
              <p>Are you sure you want to {actionType === 'APPROVE' ? 'approve' : 'reject'} this application?</p>
              {actionType === 'REJECT' && (
                <textarea value={remark} onChange={(e) => setRemark(e.target.value)} className="w-full border rounded p-2" placeholder="Reason for rejection (optional)"></textarea>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button onClick={confirm} className="px-3 py-2 rounded bg-primary-600 text-white">Confirm</button>
              </div>
            </div>
          </Modal>

          {toast && <Toast>{toast}</Toast>}
        </main>
      </div>
    </div>
  )
}
