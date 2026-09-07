import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { PublicLayout } from '../../components/public/PublicLayout'

export function LoginPage() {
  return (
    <PublicLayout hideNav>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-700 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Candidate Login</p>
                <h1 className="mt-1 text-3xl font-semibold text-slate-900">Welcome back</h1>
              </div>
            </div>

            <form className="space-y-5">
              <Input label="Application Number / Email" placeholder="EXAM20260001234 or candidate@example.com" />
              <Input label="Password" type="password" placeholder="Enter your password" />

              <div className="flex flex-col justify-between gap-3 text-sm text-slate-600 sm:flex-row">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary-700 focus:ring-primary-200" />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="font-medium text-primary-700 hover:text-primary-800">Forgot Password?</Link>
              </div>

              <Button type="submit" size="lg" className="w-full">Login</Button>

              <p className="text-center text-sm text-slate-600">
                New Candidate?{' '}
                <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-800">Register Now</Link>
              </p>
            </form>
          </div>

          <aside className="border-t border-slate-200 bg-slate-100 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Exam information</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Important dates</h2>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  <li className="rounded-xl border border-slate-200 bg-white p-3">Registration starts: 01 September 2026</li>
                  <li className="rounded-xl border border-slate-200 bg-white p-3">Registration ends: 30 September 2026</li>
                  <li className="rounded-xl border border-slate-200 bg-white p-3">Exam date: 15 November 2026</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900">
                <div className="mb-3 flex items-center gap-2 font-semibold">
                  <LockKeyhole className="h-4 w-4" />
                  Security Notice
                </div>
                Never share your password or OTP details with anyone. Official communication will only come from verified exam account channels.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  )
}
