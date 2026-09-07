import React from 'react'
import { Logo } from '../common/Logo'
import { useNavigate } from 'react-router-dom'
import { mockAuthService } from '../../services/mock/mockAuthService'

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate()

  function handleLogout() {
    mockAuthService.logout()
    navigate('/admin/login')
  }

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <div className="text-sm font-semibold">Admin Portal</div>
          <div className="text-xs text-slate-500">Exam Registration System</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-600">{mockAuthService.getUser()?.user || 'Admin User'}</div>
        <button onClick={handleLogout} className="px-3 py-1 border rounded text-sm">Logout</button>
      </div>
    </header>
  )
}
