import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'

export function ApplicationReviewPage() {
  const navigate = useNavigate()
  const [candidate, setCandidate] = useState<any>(() => {
    try {
      const raw = localStorage.getItem('candidate_auth')
      const draft = localStorage.getItem('candidate_application_draft')
      return {
        ...(raw ? JSON.parse(raw) : {}),
        ...(draft ? JSON.parse(draft) : {}),
      }
    } catch {
      return null
    }
  })

  useEffect(() => {
    async function loadCandidate() {
      const raw = localStorage.getItem('candidate_auth')
      if (!raw) return
      try {
        let value = JSON.parse(raw)
        const draftRaw = localStorage.getItem('candidate_application_draft')
        if (draftRaw) value = { ...value, ...JSON.parse(draftRaw) }
        if (value.applicationNumber) {
          const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
          const response = await fetch(`${apiBase}/api/candidates/${encodeURIComponent(value.applicationNumber)}`)
          if (response.ok) {
            value = { ...value, ...await response.json() }
            localStorage.setItem('candidate_auth', JSON.stringify(value))
          }
        }
        setCandidate(value)
      } catch (error) {
        console.warn('Unable to load candidate review details', error)
      }
    }
    void loadCandidate()
  }, [])

  const personal = candidate?.personal || {}
  const address = candidate?.address || {}
  const exam = candidate?.exam || {}

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Review</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Application Review</h1>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Full Name" value={personal.fullName || candidate?.name || ''} />
                  <ReviewItem label="Date of Birth" value={personal.dateOfBirth || ''} />
                  <ReviewItem label="Gender" value={personal.gender || ''} />
                  <ReviewItem label="Father's Name" value={personal.fatherName || ''} />
                  <ReviewItem label="Mother's Name" value={personal.motherName || ''} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Mobile Number" value={candidate?.mobile || ''} />
                  <ReviewItem label="Email Address" value={candidate?.email || ''} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Address" value={address.address || ''} />
                  <ReviewItem label="State" value={address.state || ''} />
                  <ReviewItem label="District" value={address.district || ''} />
                  <ReviewItem label="City" value={address.city || ''} />
                  <ReviewItem label="PIN Code" value={address.pinCode || ''} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Exam Name" value={exam.examName || ''} />
                  <ReviewItem label="Category" value={exam.category || ''} />
                  <ReviewItem label="Qualification" value={exam.qualification || ''} />
                  <ReviewItem label="Exam Centre" value={exam.preferredCentre || ''} />
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-200" />
                  <span>I confirm that all information provided by me is correct.</span>
                </label>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/candidate/application')}>Back</Button>
                <div className="flex flex-1 justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/candidate/application/edit')}>Edit</Button>
                  <Button type="button" className="min-w-[180px]" onClick={() => navigate('/candidate/documents')}>Continue to Documents</Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
