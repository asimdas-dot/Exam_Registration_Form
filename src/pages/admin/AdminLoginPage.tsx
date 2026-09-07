import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockAuthService } from '../../services/mock/mockAuthService'
import { Button } from '../../components/common/Button'

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = mockAuthService.login(username.trim(), password)
    if (res.ok) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-slate-500 mb-4">Use the demo admin credentials to access admin pages.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="admin" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="password" />
          </div>

          {error ? <div className="text-sm text-danger-700">{error}</div> : null}

          <div className="flex items-center justify-between">
            <Button type="submit">Login</Button>
            <Button variant="outline" onClick={() => { setUsername('admin'); setPassword('password') }}>Fill demo</Button>
          </div>
        </form>

        <div className="mt-4 text-xs text-slate-500">Demo credentials: <strong>admin / password</strong></div>
      </div>
    </div>
  )
}
