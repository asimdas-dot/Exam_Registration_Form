import type { ReactNode } from 'react'
import { Menu, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../common/Button'

interface PublicLayoutProps {
  children: ReactNode
  hideNav?: boolean
}

export function PublicLayout({ children, hideNav = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Go to home page">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white shadow-soft">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Exam Registration System</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Government Portal</p>
            </div>
          </Link>

          {!hideNav ? (
            <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
              <Link to="/" className="transition hover:text-primary-700">Home</Link>
              <a href="#important-dates" className="transition hover:text-primary-700">Important Dates</a>
              <a href="#instructions" className="transition hover:text-primary-700">Instructions</a>
              <a href="#contact" className="transition hover:text-primary-700">Contact</a>
            </nav>
          ) : null}

          <div className="flex items-center gap-3">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 md:hidden" aria-label="Open navigation menu">
              <Menu className="h-4 w-4" />
            </button>
            <Link to="/login">
              <Button size="sm" variant="primary">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <h3 className="text-lg font-semibold text-white">Exam Registration System</h3>
            <p className="mt-3 text-sm text-slate-400">Complete your examination application securely and conveniently with a trusted digital process.</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">About</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>About</li>
              <li>Contact</li>
              <li>Help</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Legal</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms &amp; Conditions</li>
              <li>Accessibility</li>
            </ul>
          </div>
          <div id="contact">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Support</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>support@examreg.gov.in</li>
              <li>+91 033 1234 5678</li>
              <li>Mon – Sat, 9 AM – 6 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span>© 2026 Exam Registration System</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
