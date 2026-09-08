import { useEffect, useState } from 'react'
import { Download, Edit3, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'

export function ApplicationViewPage() {
  const [candidate, setCandidate] = useState<any>(() => {
    try {
      const auth = JSON.parse(localStorage.getItem('candidate_auth') || '{}')
      const draft = JSON.parse(localStorage.getItem('candidate_application_draft') || '{}')
      return { ...auth, ...draft }
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
          if (response.ok) value = { ...value, ...await response.json() }
        }
        setCandidate(value)
      } catch (error) {
        console.warn('Unable to load candidate application view', error)
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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Application</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">View Application</h1>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" icon={<Printer className="h-4 w-4" />}>Print</Button>
                <Button variant="outline" icon={<Download className="h-4 w-4" />}>Download PDF</Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Candidate Information</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Candidate Name" value={personal.fullName || candidate?.name || ''} />
                  <InfoItem label="Date of Birth" value={personal.dateOfBirth || ''} />
                  <InfoItem label="Gender" value={personal.gender || ''} />
                  <InfoItem label="Father's Name" value={personal.fatherName || ''} />
                  <InfoItem label="Mother's Name" value={personal.motherName || ''} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Address</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Address" value={address.address || ''} />
                  <InfoItem label="State" value={address.state || ''} />
                  <InfoItem label="District" value={address.district || ''} />
                  <InfoItem label="City" value={address.city || ''} />
                  <InfoItem label="PIN Code" value={address.pinCode || ''} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Exam Information</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Exam Name" value={exam.examName || ''} />
                  <InfoItem label="Category" value={exam.category || ''} />
                  <InfoItem label="Qualification" value={exam.qualification || ''} />
                  <InfoItem label="Preferred Centre" value={exam.preferredCentre || ''} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Application Status</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Current Status" value={candidate?.status || ''} />
                  <InfoItem label="Application Number" value={candidate?.applicationNumber || ''} />
                  <InfoItem label="Last Updated" value={candidate?.updatedAt || candidate?.registrationDate || ''} />
                </div>
              </Card>
            </div>

            <div className="mt-8 flex justify-end">
              <Link to="/candidate/application/edit">
                <Button icon={<Edit3 className="h-4 w-4" />}>Edit Application</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
