import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { PublicLayout } from '../../components/public/PublicLayout'

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <PublicLayout hideNav>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Link to="/login" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Password Reset</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">Forgot Password</h1>
            </div>
          </div>

          {!submitted ? (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
              <Input label="Email Address / Application Number" placeholder="example@domain.com or EXAM20260001234" />
              <Button type="submit" size="lg" icon={<Mail className="h-4 w-4" />} className="w-full">Send Reset Link</Button>
            </form>
          ) : (
            <div className="rounded-2xl border border-success-200 bg-success-50 p-5 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-success-700 shadow-card">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-900">Reset link sent</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A reset instruction has been sent to your registered email address. Please follow the link to continue.
              </p>
              <Link to="/login" className="mt-6 inline-block">
                <Button variant="outline">Back to Login</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </PublicLayout>
  )
}
