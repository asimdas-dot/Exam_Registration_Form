import { Download, Edit3, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { applicationData } from '../../mock/candidate/applicationData'

export function ApplicationViewPage() {
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
                  <InfoItem label="Candidate Name" value={applicationData.personal.fullName} />
                  <InfoItem label="Date of Birth" value={applicationData.personal.dateOfBirth} />
                  <InfoItem label="Gender" value={applicationData.personal.gender} />
                  <InfoItem label="Father's Name" value={applicationData.personal.fatherName} />
                  <InfoItem label="Mother's Name" value={applicationData.personal.motherName} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Address</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Address" value={applicationData.address.address} />
                  <InfoItem label="State" value={applicationData.address.state} />
                  <InfoItem label="District" value={applicationData.address.district} />
                  <InfoItem label="City" value={applicationData.address.city} />
                  <InfoItem label="PIN Code" value={applicationData.address.pinCode} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Exam Information</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Exam Name" value={applicationData.exam.examName} />
                  <InfoItem label="Category" value={applicationData.exam.category} />
                  <InfoItem label="Qualification" value={applicationData.exam.qualification} />
                  <InfoItem label="Preferred Centre" value={applicationData.exam.preferredCentre} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Application Status</h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <InfoItem label="Current Status" value="Under Verification" />
                  <InfoItem label="Application Number" value={applicationData.contact.email} />
                  <InfoItem label="Last Updated" value="13 August 2026" />
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
