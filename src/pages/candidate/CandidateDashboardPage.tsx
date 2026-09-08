import { ArrowRight, Check, Clock3, FileText, Lock, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { notifications, progressSteps, quickActions } from '../../mock/candidate/dashboardData'
import { useEffect, useState } from 'react'
import { realtimeService } from '../../services/realtimeService'

export function CandidateDashboardPage() {
  const quickActionRoutes: Record<string, string> = {
    'View Application': '/candidate/application/view',
    'Edit Application': '/candidate/application/edit',
    Documents: '/candidate/documents',
    Payment: '/candidate/payment',
    'Application Receipt': '/candidate/payment/history',
    Cancellation: '/candidate/cancellation',
    'Hall Ticket': '/candidate/hall-ticket',
  }

  const [candidate, setCandidate] = useState<any>(() => {
    try { return JSON.parse(localStorage.getItem('candidate_auth') || '{}') } catch { return {} }
  })
  const applicationNumber = candidate.applicationNumber || ''
  const [status, setStatus] = useState(candidate.status || 'UNDER_VERIFICATION')
  const [lastUpdated, setLastUpdated] = useState(candidate.updatedAt || candidate.registrationDate || '')
  const [uploadedCount, setUploadedCount] = useState(() => {
    try {
      let c = 0
      // count doc_upload_ keys for this application
      const prefix = `doc_upload_${applicationNumber}_`
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(prefix)) c++
      }
      return c
    } catch (e) {
      return 0
    }
  })

  useEffect(() => {
    async function refreshCandidate() {
      if (!applicationNumber) return
      try {
        const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
        const response = await fetch(`${apiBase}/api/candidates/${encodeURIComponent(applicationNumber)}`)
        if (response.ok) {
          const latest = await response.json()
          setCandidate(latest)
          setStatus(latest.status || 'UNDER_VERIFICATION')
          setLastUpdated(latest.updatedAt || latest.registrationDate || '')
        }
      } catch (error) {
        console.warn('Unable to refresh dashboard candidate details', error)
      }
    }
    void refreshCandidate()
    const unsub = realtimeService.subscribe((m) => {
      if (!m || !m.type) return
      if (m.type === 'application:status' || m.type === 'application:bulk_status') {
        const payload = m.payload || {}
        if (payload.applicationNumber === applicationNumber) {
          setStatus(payload.status || status)
          setLastUpdated(new Date().toISOString())
        }
      }
      if (m.type.startsWith('document:') || m.type === 'document:remark') {
        // recompute uploadedCount
        try {
          const prefix = `doc_upload_${applicationNumber}_`
          let c = 0
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i)
            if (k && k.startsWith(prefix)) c++
          }
          setUploadedCount(c)
        } catch (e) {}
      }
    })
    return unsub
  }, [applicationNumber])

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Overview</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard</h1>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Application Status</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">{(status || 'UNDER_VERIFICATION').replace('_', ' ').toUpperCase()}</h2>
                  </div>
                  <div className="rounded-full bg-warning-50 p-2 text-warning-700">
                    <Clock3 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Application Number</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{applicationNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
                    <p className="mt-2 text-lg font-medium text-slate-800">{lastUpdated}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Profile</p>
                  <span className="text-sm font-medium text-slate-500">{candidate.name}</span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-700 text-xl font-semibold text-white">AD</div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{candidate.name}</p>
                    <p className="text-sm text-slate-500">Application ID: {applicationNumber}</p>
                  </div>
                </div>
              </Card>
            </div>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">Application Progress</h2>
                <span className="text-sm text-slate-500">5/8 completed</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {progressSteps.map(({ label, done, locked }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <span className={['flex h-8 w-8 items-center justify-center rounded-full', done ? 'bg-success-100 text-success-700' : locked ? 'bg-slate-200 text-slate-500' : 'bg-primary-50 text-primary-700'].join(' ')}>
                      {done ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((action) => (
                  <Link
                    key={action}
                    to={quickActionRoutes[action] ?? '/candidate/dashboard'}
                    className="rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-100"
                  >
                    <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                          {action.includes('Document') || action === 'Documents' ? <FileText className="h-5 w-5" /> : action.includes('Payment') ? <Wallet className="h-5 w-5" /> : action.includes('Receipt') ? <ReceiptText className="h-5 w-5" /> : action.includes('Hall') ? <ShieldCheck className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                      <p className="mt-4 text-base font-semibold text-slate-900">{action}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">Important Notifications</h2>
                  <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">3 updates</span>
                </div>
                <div className="space-y-4">
                  {notifications.map((notice) => (
                    <div key={notice} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-success-100 text-success-700">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-slate-700">{notice}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">Candidate Snapshot</h2>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Status</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{(status || 'Under Verification').replace('_', ' ')}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Documents</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{uploadedCount}/5 uploaded</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Next Action</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Await verification result</p>
                  </div>
                </div>
                <Link to="/candidate/application" className="mt-6 inline-block">
                  <Button className="w-full">View Application</Button>
                </Link>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
