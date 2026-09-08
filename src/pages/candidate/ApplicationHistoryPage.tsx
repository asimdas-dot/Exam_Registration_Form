import { Check, Clock3 } from 'lucide-react'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { useState } from 'react'
import { useEffect } from 'react'

export function ApplicationHistoryPage() {
  const [candidate, setCandidate] = useState<any>(null)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('candidate_auth')
      if (raw) setCandidate(JSON.parse(raw))
    } catch (error) {
      console.warn('Unable to load candidate history', error)
    }
  }, [])
  const created = candidate?.registrationDate ? new Date(candidate.registrationDate).toLocaleDateString() : ''
  const applicationHistory = [
    { date: created, event: 'Registration Created', status: 'done' },
    { date: created, event: 'Application Submitted', status: candidate ? 'done' : 'pending' },
    { date: candidate?.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : '', event: 'Application Updated', status: candidate?.updatedAt ? 'done' : 'pending' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">History</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Application History</h1>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
              <div className="space-y-6">
                {applicationHistory.map((entry, index) => (
                  <div key={entry.event} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={['flex h-8 w-8 items-center justify-center rounded-full', entry.status === 'done' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'].join(' ')}>
                        {entry.status === 'done' ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                      </div>
                      {index < applicationHistory.length - 1 ? <div className="mt-2 h-8 w-px bg-slate-200" /> : null}
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-base font-semibold text-slate-900">{entry.event}</p>
                        <span className={['inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]', entry.status === 'done' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'].join(' ')}>
                          {entry.status === 'done' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
