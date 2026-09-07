import { LockKeyhole } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { applicationData } from '../../mock/candidate/applicationData'

export function ApplicationEditPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Edit</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit Application</h1>
            </div>

            <Card className="mb-6 border-primary-100 bg-primary-50/40 p-4 text-sm text-primary-900">
              Only permitted fields can be edited after submission.
            </Card>

            <div className="space-y-6">
              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Personal Details</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-500">
                      <LockKeyhole className="h-4 w-4" />
                      <span>Locked</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Date of Birth</label>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3 text-slate-500">
                      <LockKeyhole className="h-4 w-4" />
                      <span>Locked</span>
                    </div>
                  </div>
                  <Input label="Mobile Number" defaultValue={applicationData.contact.mobileNumber.replace('+91 ', '')} />
                  <Input label="Email Address" defaultValue={applicationData.contact.email} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Address</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Address" className="md:col-span-2" defaultValue={applicationData.address.address} />
                  <Input label="State" defaultValue={applicationData.address.state} />
                  <Input label="District" defaultValue={applicationData.address.district} />
                  <Input label="City" defaultValue={applicationData.address.city} />
                  <Input label="PIN Code" defaultValue={applicationData.address.pinCode} />
                </div>
              </Card>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" type="button">Back</Button>
              <Button type="button">Save Changes</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
