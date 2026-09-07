import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { cancellationReasons } from '../../mock/candidate/cancellationData'

export function CancellationPage() {
  const [reason, setReason] = useState<string>('')
  const [comments, setComments] = useState('')
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  function requestCancellation() {
    setModalOpen(false)
    // simulate submission
    setTimeout(() => {
      navigate('/candidate/cancellation/success')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Cancellation</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Request Cancellation</h1>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Cancellation reason</label>
                  <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900">
                    <option value="">Select reason</option>
                    {cancellationReasons.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Additional comments (optional)</label>
                  <textarea value={comments} onChange={(e) => setComments(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 min-h-[100px]" />
                </div>

                <div className="flex items-start gap-3">
                  <input id="confirm" type="checkbox" checked={confirmChecked} onChange={(e) => setConfirmChecked(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-200" />
                  <label htmlFor="confirm" className="text-sm text-slate-700">I confirm that I want to request cancellation of my application.</label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => navigate('/candidate/dashboard')}>Back</Button>
                  <Button onClick={() => setModalOpen(true)} disabled={!confirmChecked || !reason}>Request Cancellation</Button>
                </div>
              </div>
            </Card>

            {modalOpen ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                  <h3 className="text-lg font-semibold text-slate-900">Confirm cancellation</h3>
                  <p className="mt-3 text-sm text-slate-600">This will submit a cancellation request for your application. You will receive updates via your dashboard.</p>
                  <div className="mt-5 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={requestCancellation}>Confirm Request</Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
