import { useEffect, useState } from 'react'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { documentRows } from '../../mock/candidate/documentData'
import { DocumentCard } from '../../components/common/DocumentCard'
import { candidateProfile } from '../../mock/candidate/dashboardData'
import { realtimeService } from '../../services/realtimeService'

export function DocumentsPage() {
  const app = candidateProfile.applicationNumber
  const [_tick, setTick] = useState(0)

  useEffect(() => {
    const unsub = realtimeService.subscribe((m) => {
      if (!m) return
      if (m.type && (m.type.startsWith('document:') || m.type === 'audit:entry')) setTick((t) => t + 1)
    })
    return unsub
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Documents</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Document Submission</h1>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
                {/* compute uploaded count from localStorage */}
                {(() => {
                  try {
                    let count = 0
                    documentRows.forEach((d) => {
                      const key = `doc_upload_${app}_${d.name.replace(/\s+/g, '_').toLowerCase()}`
                      const raw = localStorage.getItem(key)
                      if (raw) count++
                    })
                    return `${count} of ${documentRows.length} uploaded`
                  } catch (e) {
                    return `0 of ${documentRows.length} uploaded`
                  }
                })()}
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2">
              <div className="flex h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                <div className="w-2/3 bg-primary-600" />
              </div>
              <span className="text-sm text-slate-600">3/5 steps complete</span>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {documentRows.map((doc) => (
                <Card key={doc.name} className="p-5">
                  <div>
                    <DocumentCard doc={doc} applicationNumber={app} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
