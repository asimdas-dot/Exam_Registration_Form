export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-white">Exam Registration System</h3>
          <p className="mt-3 text-sm text-slate-400">
            Secure, accessible, and transparent examination registration services for candidates and administrators.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Company</p>
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
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Support</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>support@examreg.gov.in</li>
            <li>+91 033 1234 5678</li>
            <li>Mon–Sat, 9am–6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          <span>© 2026 Exam Registration System</span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
