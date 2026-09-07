import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { AdminSidebar } from '../../components/admin/AdminSidebar'
import { mockAdminService } from '../../services/mock/mockAdminService'

export const AdminAuditLogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<any | null>(null)

  useEffect(() => {
    const find = mockAdminService.getAuditLogs().find((e) => e.id === id)
    setEntry(find || null)
  }, [id])

  if (!entry) return (
    <div className="min-h-screen p-6">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">Audit entry not found</main>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Audit Entry</h2>
            <div>
              <button onClick={() => navigate(-1)} className="px-3 py-2 border rounded">Back</button>
            </div>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <div className="text-sm text-slate-600"><strong>Time:</strong> {new Date(entry.timestamp).toLocaleString()}</div>
            <div className="text-sm text-slate-600"><strong>Action:</strong> {entry.action}</div>
            <div className="text-sm text-slate-600"><strong>Application:</strong> {entry.applicationNumber || '—'}</div>
            <div className="text-sm text-slate-600"><strong>By:</strong> {entry.by || 'system'}</div>
            <div className="mt-2 text-sm text-slate-600"><strong>Note:</strong> {entry.note || '—'}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
