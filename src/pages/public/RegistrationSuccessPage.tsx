import { CheckCircle2, Download, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PublicLayout } from '../../components/public/PublicLayout'

export function RegistrationSuccessPage() {
  return (
    <PublicLayout hideNav>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="p-8 text-center shadow-soft sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success-700">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">Registration Successful</h1>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Application Number</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">EXAM20260001234</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/login">
              <Button icon={<LogIn className="h-4 w-4" />}>Go to Login</Button>
            </Link>
            <Button variant="outline" icon={<Download className="h-4 w-4" />}>Download Registration Details</Button>
          </div>
        </Card>
      </div>
    </PublicLayout>
  )
}
