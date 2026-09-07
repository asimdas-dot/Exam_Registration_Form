import React from 'react'
import { Link } from 'react-router-dom'

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r p-4 hidden lg:block">
      <nav className="space-y-2 text-sm">
        <Link to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-slate-50">Dashboard</Link>
        <Link to="/admin/candidates" className="block px-3 py-2 rounded hover:bg-slate-50">Candidates</Link>
        <Link to="/admin/applications" className="block px-3 py-2 rounded hover:bg-slate-50">Applications</Link>
        <Link to="/admin/documents" className="block px-3 py-2 rounded hover:bg-slate-50">Documents</Link>
        <Link to="/admin/payments" className="block px-3 py-2 rounded hover:bg-slate-50">Payments</Link>
        <Link to="/admin/exam-settings" className="block px-3 py-2 rounded hover:bg-slate-50">Exam Settings</Link>
        <Link to="/admin/audit-logs" className="block px-3 py-2 rounded hover:bg-slate-50">Audit Logs</Link>
      </nav>
    </aside>
  )
}
