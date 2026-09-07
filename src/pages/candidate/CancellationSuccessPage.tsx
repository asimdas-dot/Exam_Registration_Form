import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'

export function CancellationSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <Card className="p-8 text-center shadow-soft sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning-50 text-warning-700">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">Cancellation Request Submitted</h1>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm text-slate-700">Status: CANCELLATION PENDING</p>
                <p className="mt-2 text-sm text-slate-600">Application Number: EXAM20260001234</p>
                <p className="mt-2 text-sm text-slate-600">Request date: 13 August 2026</p>
                <p className="mt-3 text-sm text-slate-500">You will receive an update once the request has been processed. Expected processing time: 3–5 business days.</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/candidate/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
                <Link to="/candidate/application">
                  <Button variant="outline">View Application</Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
