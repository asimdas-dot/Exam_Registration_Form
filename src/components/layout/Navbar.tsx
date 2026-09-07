import { Bell, Menu, ShieldCheck } from 'lucide-react'
import { Button } from '../common/Button'

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white shadow-soft">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Exam Registration System</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Portal</p>
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#" className="transition hover:text-primary-700">Home</a>
          <a href="#" className="transition hover:text-primary-700">Important Dates</a>
          <a href="#" className="transition hover:text-primary-700">Instructions</a>
          <a href="#" className="transition hover:text-primary-700">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 md:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <Button size="sm" variant="primary">Login</Button>
        </div>
      </div>
    </header>
  )
}
