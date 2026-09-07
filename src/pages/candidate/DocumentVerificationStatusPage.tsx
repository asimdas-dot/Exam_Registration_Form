import { useEffect, useState } from 'react'
import { AlertCircle, Check, CircleAlert, UploadCloud } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { documentVerificationRows } from '../../mock/candidate/documentData'
import { candidateProfile } from '../../mock/candidate/dashboardData'
import { realtimeService } from '../../services/realtimeService'

export function DocumentVerificationStatusPage() {
  const app = candidateProfile.applicationNumber
  const [_tick, setTick] = useState(0)

  useEffect(() => {
    const unsub = realtimeService.subscribe((m) => {
      if (!m || !m.type) return
      if (m.type.startsWith('document:') || m.type.startsWith('application:') || m.type === 'audit:entry') {
        setTick((t) => t + 1)
      }
    })
    return unsub
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Documents</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Document Verification Status</h1>
            </div>

            <div className="space-y-5">
              {documentVerificationRows.map((doc) => {
                // If a user has uploaded a file for this doc, prefer uploaded.status if admin set it, otherwise show Under Verification unless mock data marks approved/rejected
                const storageKey = `doc_upload_${app}_${doc.name.replace(/\s+/g, '_').toLowerCase()}`
                const raw = localStorage.getItem(storageKey)
                const uploaded = raw ? JSON.parse(raw) : null
                const status = doc.status === 'approved' || doc.status === 'rejected' ? doc.status : uploaded?.status ? uploaded.status : uploaded ? 'under_review' : doc.status

                return (
                  <div key={doc.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className={['flex h-10 w-10 items-center justify-center rounded-xl', status === 'approved' ? 'bg-success-100 text-success-700' : status === 'under_review' ? 'bg-warning-100 text-warning-700' : 'bg-danger-100 text-danger-700'].join(' ')}>
                          {status === 'approved' ? <Check className="h-5 w-5" /> : status === 'under_review' ? <AlertCircle className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{doc.name}</p>
                          <p className="text-sm text-slate-500">{doc.detail}</p>
                          {uploaded ? <p className="mt-1 text-xs text-slate-500">Uploaded: {uploaded.fileName}</p> : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={['inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]', status === 'approved' ? 'bg-success-100 text-success-700' : status === 'under_review' ? 'bg-warning-100 text-warning-700' : 'bg-danger-100 text-danger-700'].join(' ')}>
                          {status === 'approved' ? 'Approved' : status === 'under_review' ? 'Under Verification' : 'Rejected'}
                        </span>
                        {status === 'rejected' ? (
                          <Button variant="outline" size="sm" icon={<UploadCloud className="h-4 w-4" />}>Upload Again</Button>
                        ) : null}
                      </div>
                    </div>

                    {status === 'rejected' ? (
                      <div className="mt-4 rounded-2xl border border-danger-200 bg-danger-50 p-4">
                        <p className="text-sm font-medium text-danger-700">Reason:</p>
                        <p className="mt-1 text-sm text-danger-800">{doc.reason}</p>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
