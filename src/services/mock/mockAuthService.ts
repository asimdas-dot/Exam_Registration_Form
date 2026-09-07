export const mockAuthService = {
  login: (username: string, password: string) => {
    // very small mock: accept admin / password
    if (username === 'admin' && password === 'password') {
      const token = `admintoken_${Date.now()}`
      localStorage.setItem('admin_auth', JSON.stringify({ user: username, token, loggedAt: new Date().toISOString() }))
      return { ok: true, token }
    }
    return { ok: false }
  },
  logout: () => {
    localStorage.removeItem('admin_auth')
  },
  isAuthenticated: () => {
    const raw = localStorage.getItem('admin_auth')
    return !!raw
  },
  getUser: () => {
    const raw = localStorage.getItem('admin_auth')
    return raw ? JSON.parse(raw) : null
  }
}
