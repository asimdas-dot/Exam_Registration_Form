import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { applicationData } from '../../mock/candidate/applicationData'

const defaultValues = {
  fullName: applicationData.personal.fullName,
  dateOfBirth: applicationData.personal.dateOfBirth,
  gender: applicationData.personal.gender,
  fatherName: applicationData.personal.fatherName,
  motherName: applicationData.personal.motherName,
  mobileNumber: applicationData.contact.mobileNumber.replace('+91 ', ''),
  email: applicationData.contact.email,
  address: applicationData.address.address,
  state: applicationData.address.state,
  district: applicationData.address.district,
  city: applicationData.address.city,
  pinCode: applicationData.address.pinCode,
  examName: applicationData.exam.examName,
  category: applicationData.exam.category,
  qualification: applicationData.exam.qualification,
  preferredCentre: applicationData.exam.preferredCentre,
}

export function ApplicationPage() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm({ defaultValues })

  const onSubmit = () => {
    navigate('/candidate/application/review')
  }

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
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Application Form</h1>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" type="button">Save Draft</Button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Personal Details</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Full Name" {...register('fullName')} />
                  <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
                  <Input label="Gender" {...register('gender')} />
                  <Input label="Father's Name" {...register('fatherName')} />
                  <Input label="Mother's Name" className="md:col-span-2" {...register('motherName')} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Contact Details</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Mobile Number</label>
                    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-100">
                      <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">+91</span>
                      <input className="w-full border-0 bg-transparent px-3.5 py-2.5 text-sm text-slate-900 outline-none" {...register('mobileNumber')} />
                    </div>
                  </div>
                  <Input label="Email Address" type="email" {...register('email')} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Address</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Address" className="md:col-span-2" {...register('address')} />
                  <Input label="State" {...register('state')} />
                  <Input label="District" {...register('district')} />
                  <Input label="City" {...register('city')} />
                  <Input label="PIN Code" {...register('pinCode')} />
                </div>
              </Card>

              <Card className="p-5 sm:p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Examination Details</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label="Exam Name" {...register('examName')} />
                  <Input label="Category" {...register('category')} />
                  <Input label="Qualification" {...register('qualification')} />
                  <Input label="Exam Centre Preference" {...register('preferredCentre')} />
                </div>
              </Card>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                <Button type="button" variant="outline">Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
