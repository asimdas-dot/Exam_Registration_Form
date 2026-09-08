import { LockKeyhole } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export function ApplicationEditPage() {
  const navigate = useNavigate()
  const { register, reset, handleSubmit } = useForm<Record<string, string>>()

  useEffect(() => {
    async function load() {
      const raw = localStorage.getItem('candidate_auth')
      if (!raw) return
      try {
        let candidate = JSON.parse(raw)
        const draft = JSON.parse(localStorage.getItem('candidate_application_draft') || '{}')
        candidate = { ...candidate, ...draft }
        if (candidate.applicationNumber) {
          const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
          const response = await fetch(`${apiBase}/api/candidates/${encodeURIComponent(candidate.applicationNumber)}`)
          if (response.ok) candidate = { ...candidate, ...await response.json() }
        }
        reset({
          mobileNumber: candidate.mobile || '',
          email: candidate.email || '',
          address: candidate.address?.address || '',
          state: candidate.address?.state || '',
          district: candidate.address?.district || '',
          city: candidate.address?.city || '',
          pinCode: candidate.address?.pinCode || '',
        })
      } catch (error) {
        console.warn('Unable to load candidate edit details', error)
      }
    }
    void load()
  }, [reset])

  const saveChanges = async (values: Record<string, string>) => {
    const raw = localStorage.getItem('candidate_auth')
    if (!raw) return
    const candidate = JSON.parse(raw)
    const updated = {
      ...candidate,
      mobile: values.mobileNumber,
      email: values.email,
      address: {
        ...(candidate.address || {}),
        address: values.address,
        state: values.state,
        district: values.district,
        city: values.city,
        pinCode: values.pinCode,
      },
    }
    localStorage.setItem('candidate_auth', JSON.stringify(updated))
    localStorage.setItem('candidate_application_draft', JSON.stringify(updated))
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
      await fetch(`${apiBase}/api/candidates/${encodeURIComponent(candidate.applicationNumber)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
    } catch (error) {
      console.warn('Unable to save candidate edit details', error)
    }
    navigate('/candidate/application/view')
  }

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

            <form id="candidate-edit-form" onSubmit={handleSubmit(saveChanges)} className="space-y-6">
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
                  <Input label="Mobile Number" {...register('mobileNumber')} />
                  <Input label="Email Address" {...register('email')} />
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
            </form>

            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => navigate('/candidate/application/view')}>Back</Button>
              <Button type="submit" form="candidate-edit-form">Save Changes</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
