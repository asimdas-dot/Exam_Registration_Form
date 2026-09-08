import { Bell, LogOut, Search, UserCircle2 } from 'lucide-react'
import { Button } from '../common/Button'
import { useNavigate } from 'react-router-dom'

export function CandidateHeader() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('candidate_auth')
    localStorage.removeItem('candidate_application_draft')
    navigate('/login')
  }

  return (
    <header role="banner" className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Open navigation menu"
            aria-controls="candidate-sidebar"
          >
            <Search className="h-4 w-4" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Welcome, Candidate</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">Application Portal</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex" aria-hidden>
            <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Application Number</span>
            <span className="font-semibold text-slate-800">EXAM20260001234</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700" aria-hidden>
            <UserCircle2 className="h-5 w-5" />
          </div>
          <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 md:inline-flex" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <Button variant="outline" size="sm" icon={<LogOut className="h-4 w-4" />} aria-label="Logout" onClick={logout}>Logout</Button>
        </div>
      </div>
    </header>
  )
}
