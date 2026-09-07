import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { applicationData } from '../../mock/candidate/applicationData'

export function ApplicationReviewPage() {
  const navigate = useNavigate()

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
                  <ReviewItem label="Full Name" value={applicationData.personal.fullName} />
                  <ReviewItem label="Date of Birth" value={applicationData.personal.dateOfBirth} />
                  <ReviewItem label="Gender" value={applicationData.personal.gender} />
                  <ReviewItem label="Father's Name" value={applicationData.personal.fatherName} />
                  <ReviewItem label="Mother's Name" value={applicationData.personal.motherName} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Mobile Number" value={applicationData.contact.mobileNumber} />
                  <ReviewItem label="Email Address" value={applicationData.contact.email} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Address" value={applicationData.address.address} />
                  <ReviewItem label="State" value={applicationData.address.state} />
                  <ReviewItem label="District" value={applicationData.address.district} />
                  <ReviewItem label="City" value={applicationData.address.city} />
                  <ReviewItem label="PIN Code" value={applicationData.address.pinCode} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <ReviewItem label="Exam Name" value={applicationData.exam.examName} />
                  <ReviewItem label="Category" value={applicationData.exam.category} />
                  <ReviewItem label="Qualification" value={applicationData.exam.qualification} />
                  <ReviewItem label="Exam Centre" value={applicationData.exam.preferredCentre} />
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
                  <Button type="button" className="min-w-[180px]" onClick={() => navigate('/candidate/application/view')}>Final Submit</Button>
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
