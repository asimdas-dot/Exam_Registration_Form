import { BellDot, CreditCard, FileText, LayoutDashboard, LogOut, ReceiptText, ShieldCheck, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/candidate/dashboard' },
  { label: 'Application', icon: FileText, to: '/candidate/application' },
  { label: 'Documents', icon: ReceiptText, to: '/candidate/documents' },
  { label: 'Payment', icon: CreditCard, to: '/candidate/payment' },
  { label: 'Hall Ticket', icon: ShieldCheck, to: '/candidate/hall-ticket' },
  { label: 'Profile', icon: UserRound, to: '/candidate/application/view' },
]

export function CandidateSidebar() {
  return (
    <aside id="candidate-sidebar" aria-label="Candidate sidebar" className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50 lg:block">
      <div className="flex h-full flex-col p-5">
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white" aria-hidden>
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Candidate Panel</p>
            <p className="text-xs text-slate-500">Exam portal</p>
          </div>
        </div>

        <nav aria-label="Candidate navigation" className="space-y-2">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              aria-label={label}
              title={label}
              className={({ isActive }) => [
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-primary-700 text-white shadow-soft' : 'text-slate-600 hover:bg-white hover:text-slate-900',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <BellDot className="h-4 w-4" aria-hidden />
            <span className="text-xs font-medium uppercase tracking-[0.12em]">Alerts</span>
          </div>
          <p className="text-sm text-slate-700">Your payment has been successfully completed.</p>
        </div>

        <button type="button" aria-label="Logout" className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <LogOut className="h-4 w-4" aria-hidden />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
