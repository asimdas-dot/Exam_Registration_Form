import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { PublicLayout } from '../../components/public/PublicLayout'

const personalSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select gender'),
  fatherName: z.string().min(2, 'Father name is required'),
  motherName: z.string().min(2, 'Mother name is required'),
})

const contactSchema = z.object({
  mobileNumber: z.string().min(10, 'Enter a valid mobile number'),
  email: z.string().email('Enter a valid email address'),
})

const addressSchema = z.object({
  address: z.string().min(10, 'Address is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  city: z.string().min(2, 'City is required'),
  pinCode: z.string().min(6, 'PIN code is required'),
})

const accountSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[A-Z]/, 'Must include uppercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const registerSchema = z.object({
  ...personalSchema.shape,
  ...contactSchema.shape,
  ...addressSchema.shape,
  ...accountSchema.shape,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const totalSteps = 5
const stepLabels = ['Personal Information', 'Contact Information', 'Address', 'Account Setup', 'Review']

type FormValues = {
  fullName: string
  dateOfBirth: string
  gender: string
  fatherName: string
  motherName: string
  mobileNumber: string
  email: string
  address: string
  state: string
  district: string
  city: string
  pinCode: string
  password: string
  confirmPassword: string
}

const defaultValues: FormValues = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  fatherName: '',
  motherName: '',
  mobileNumber: '',
  email: '',
  address: '',
  state: '',
  district: '',
  city: '',
  pinCode: '',
  password: '',
  confirmPassword: '',
}

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const passwordValue = form.watch('password') || ''
  const strength = useMemo(() => {
    const conditions = [passwordValue.length >= 8, /[A-Z]/.test(passwordValue), /[0-9]/.test(passwordValue), /[^A-Za-z0-9]/.test(passwordValue)]
    const passed = conditions.filter(Boolean).length
    if (passed <= 1) return 'Weak'
    if (passed === 2 || passed === 3) return 'Medium'
    return 'Strong'
  }, [passwordValue])

  const goToNextStep = async () => {
    const schema = currentStep === 1 ? personalSchema : currentStep === 2 ? contactSchema : currentStep === 3 ? addressSchema : accountSchema
    const isValid = await form.trigger(Object.keys(schema.shape) as Array<keyof FormValues>)
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const onSubmit = async () => {
    const isValid = await form.trigger(Object.keys(accountSchema.shape) as Array<keyof FormValues>)
    if (isValid) {
      // build candidate object
      const values = form.getValues()
      // generate application number (simple timestamp-based)
      const appNumber = `EXAM${new Date().getFullYear()}${Date.now().toString().slice(-8)}`
      const candidate = {
        applicationNumber: appNumber,
        name: values.fullName,
        email: values.email,
        mobile: values.mobileNumber,
        password: values.password,
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
        registrationDate: new Date().toISOString(),
        status: 'SUBMITTED',
      }

      try {
        const apiBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:4000'
        const res = await fetch(`${apiBase}/api/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidate),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        // notify other tabs (realtime)
        try {
          const { realtimeService } = await import('../../services/realtimeService')
          realtimeService.publish('application:created', { applicationNumber: appNumber })
        } catch (e) {
          // ignore
        }
        localStorage.setItem('last_registration', JSON.stringify({ applicationNumber: appNumber, email: values.email }))
        navigate('/registration-success')
      } catch (e) {
        console.error('Registration failed to save to backend:', e)
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Full Name" placeholder="Enter full name" error={form.formState.errors.fullName?.message} {...form.register('fullName')} />
            <Input label="Date of Birth" type="date" error={form.formState.errors.dateOfBirth?.message} {...form.register('dateOfBirth')} />
            <Input label="Gender" placeholder="Male / Female / Other" error={form.formState.errors.gender?.message} {...form.register('gender')} />
            <Input label="Father's Name" placeholder="Enter father's name" error={form.formState.errors.fatherName?.message} {...form.register('fatherName')} />
            <Input label="Mother's Name" placeholder="Enter mother's name" className="md:col-span-2" error={form.formState.errors.motherName?.message} {...form.register('motherName')} />
          </div>
        )
      case 2:
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <button type="button" className="rounded-lg border border-primary-200 bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700">
                  Verify
                </button>
              </div>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-100">
                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">+91</span>
                <input
                  id="mobileNumber"
                  type="tel"
                  className="w-full border-0 bg-transparent px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                  placeholder="____________"
                  {...form.register('mobileNumber')}
                />
              </div>
              {form.formState.errors.mobileNumber?.message ? <span className="mt-1.5 block text-xs font-medium text-danger-600">{form.formState.errors.mobileNumber.message}</span> : null}
            </div>
            <div className="md:col-span-2">
              <Input label="Email Address" type="email" placeholder="candidate@example.com" error={form.formState.errors.email?.message} {...form.register('email')} />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Address" placeholder="House number, street, locality" className="md:col-span-2" error={form.formState.errors.address?.message} {...form.register('address')} />
            <Input label="State" placeholder="Enter state" error={form.formState.errors.state?.message} {...form.register('state')} />
            <Input label="District" placeholder="Enter district" error={form.formState.errors.district?.message} {...form.register('district')} />
            <Input label="City" placeholder="Enter city" error={form.formState.errors.city?.message} {...form.register('city')} />
            <Input label="PIN Code" placeholder="Enter 6-digit PIN" error={form.formState.errors.pinCode?.message} {...form.register('pinCode')} />
          </div>
        )
      case 4:
        return (
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  error={form.formState.errors.password?.message}
                  {...form.register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[42px] rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  error={form.formState.errors.confirmPassword?.message}
                  {...form.register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[42px] rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Password strength</p>
                <span className="text-sm font-medium text-primary-700">{strength}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={[
                    'h-full rounded-full transition-all',
                    strength === 'Weak' ? 'w-1/3 bg-danger-500' : strength === 'Medium' ? 'w-2/3 bg-warning-500' : 'w-full bg-success-500',
                  ].join(' ')}
                />
              </div>
              <ul className="mt-4 grid gap-2 text-xs text-slate-600 md:grid-cols-2">
                <li>• Minimum length: 8 characters</li>
                <li>• At least 1 uppercase letter</li>
                <li>• At least 1 number</li>
                <li>• At least 1 special character</li>
              </ul>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Please verify your information before continuing.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Full Name', form.watch('fullName')],
                ['Date of Birth', form.watch('dateOfBirth')],
                ['Email', form.watch('email')],
                ['Mobile Number', form.watch('mobileNumber')],
                ['City', form.watch('city')],
                ['State', form.watch('state')],
                ['Address', form.watch('address')],
                ['Password', '********'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <PublicLayout hideNav>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">New Registration</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create your profile</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600">
            <ShieldCheck className="h-4 w-4 text-primary-700" />
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="mb-8">
            <div className="grid gap-3 md:grid-cols-5">
              {stepLabels.map((label, index) => {
                const stepNumber = index + 1
                const isActive = currentStep === stepNumber
                const isDone = currentStep > stepNumber
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={[
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                      isActive ? 'bg-primary-700 text-white' : isDone ? 'bg-success-100 text-success-700' : 'bg-slate-100 text-slate-500',
                    ].join(' ')}>
                      {stepNumber}
                    </div>
                    <span className={['hidden text-xs font-medium md:block', isActive ? 'text-slate-900' : 'text-slate-500'].join(' ')}>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {renderStep()}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={goToPreviousStep} disabled={currentStep === 1}>
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={goToNextStep}>Continue</Button>
              ) : (
                <Button type="button" onClick={onSubmit}>Create Account</Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </PublicLayout>
  )
}
