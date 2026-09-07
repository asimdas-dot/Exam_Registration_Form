import { CalendarCheck2, FileText, LayoutGrid, ShieldCheck, Users } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutGrid, active: true },
  { label: 'Applications', icon: FileText },
  { label: 'Candidates', icon: Users },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Schedules', icon: CalendarCheck2 },
]

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-50 lg:block">
      <div className="flex h-full flex-col p-5">
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Admin Portals</p>
            <p className="text-xs text-slate-500">Operations</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={[
                'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition',
                active ? 'bg-primary-700 text-white shadow-soft' : 'text-slate-600 hover:bg-white hover:text-slate-900',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
