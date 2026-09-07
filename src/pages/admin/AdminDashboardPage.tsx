import React from 'react'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { AdminChartsLazy } from '../../components/admin/AdminChartsLazy'

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-slate-500">Total Candidates</div>
              <div className="text-2xl font-bold">12,345</div>
            </div>
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-slate-500">Applications Submitted</div>
              <div className="text-2xl font-bold">8,765</div>
            </div>
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-slate-500">Payments Completed</div>
              <div className="text-2xl font-bold">7,890</div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded shadow-sm p-4">
            <div className="text-sm text-slate-500">Applications by Status (mock)</div>
            <div className="mt-3 h-48">
              <AdminChartsLazy />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
