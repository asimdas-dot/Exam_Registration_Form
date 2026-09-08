import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import type { SelectHTMLAttributes } from 'react'
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
  const { register, handleSubmit, reset } = useForm({ defaultValues })

  useEffect(() => {
    async function loadCandidate() {
      const raw = localStorage.getItem('candidate_auth')
      if (!raw) return
      try {
        let candidate = JSON.parse(raw)
        if (candidate.applicationNumber) {
          const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
          const response = await fetch(`${apiBase}/api/candidates/${encodeURIComponent(candidate.applicationNumber)}`)
          if (response.ok) {
            candidate = await response.json()
            localStorage.setItem('candidate_auth', JSON.stringify(candidate))
          }
        }
      const personal = candidate.personal || {}
      const address = candidate.address || {}
      const fields: Record<string, string> = {
        fullName: personal.fullName || candidate.name || '',
        dateOfBirth: personal.dateOfBirth || '',
        gender: personal.gender || '',
        fatherName: personal.fatherName || '',
        motherName: personal.motherName || '',
        mobileNumber: (candidate.mobile || '').replace('+91 ', ''),
        email: candidate.email || '',
        address: address.address || '',
        state: address.state || '',
        district: address.district || '',
        city: address.city || '',
        pinCode: address.pinCode || '',
        examName: candidate.exam?.examName || '',
        category: candidate.exam?.category || '',
        qualification: candidate.exam?.qualification || '',
        preferredCentre: candidate.exam?.preferredCentre || '',
      }
      reset({ ...defaultValues, ...fields })
      } catch (error) {
        console.warn('Unable to load candidate application details', error)
      }
    }
    void loadCandidate()
  }, [])

  const onSubmit = async (values: typeof defaultValues) => {
    const raw = localStorage.getItem('candidate_auth')
    if (raw) {
      try {
        const candidate = JSON.parse(raw)
        const updatedCandidate = {
          ...candidate,
          name: values.fullName,
          email: values.email,
          mobile: values.mobileNumber,
          personal: {
            fullName: values.fullName,
            dateOfBirth: values.dateOfBirth,
            gender: values.gender,
            fatherName: values.fatherName,
            motherName: values.motherName,
          },
          address: {
            address: values.address,
            state: values.state,
            district: values.district,
            city: values.city,
            pinCode: values.pinCode,
          },
          exam: {
            examName: values.examName,
            category: values.category,
            qualification: values.qualification,
            preferredCentre: values.preferredCentre,
          },
        }
        localStorage.setItem('candidate_application_draft', JSON.stringify(updatedCandidate))
        const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
        const response = await fetch(`${apiBase}/api/candidates/${encodeURIComponent(candidate.applicationNumber)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCandidate),
        })
        if (response.ok) {
          localStorage.setItem('candidate_auth', JSON.stringify(await response.json()))
        } else {
          localStorage.setItem('candidate_auth', JSON.stringify(updatedCandidate))
        }
      } catch (error) {
        console.warn('Unable to save application details before review', error)
      }
    }
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
                  <SelectField label="Exam Name" {...register('examName')}>
                    <option value="">Select exam</option>
                    <option value="Government Recruitment Examination 2026">Government Recruitment Examination 2026</option>
                    <option value="State Eligibility Examination 2026">State Eligibility Examination 2026</option>
                    <option value="Graduate Entrance Examination 2026">Graduate Entrance Examination 2026</option>
                  </SelectField>
                  <SelectField label="Category" {...register('category')}>
                    <option value="">Select category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </SelectField>
                  <SelectField label="Qualification" {...register('qualification')}>
                    <option value="">Select qualification</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Diploma">Diploma</option>
                    <option value="B.A.">B.A.</option>
                    <option value="B.Sc.">B.Sc.</option>
                    <option value="B.Tech.">B.Tech.</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </SelectField>
                  <SelectField label="Exam Centre Preference" {...register('preferredCentre')}>
                    <option value="">Select exam centre</option>
                    <option value="ABC Examination Centre, Kolkata">ABC Examination Centre, Kolkata</option>
                    <option value="Government College Centre, Kolkata">Government College Centre, Kolkata</option>
                    <option value="City Examination Centre, Howrah">City Examination Centre, Howrah</option>
                    <option value="District Examination Centre, Durgapur">District Examination Centre, Durgapur</option>
                  </SelectField>
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

const SelectField = ({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    <select
      {...props}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
    >
      {children}
    </select>
  </label>
)
