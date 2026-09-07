import type { ReactNode } from 'react'

interface ToastProps {
  children: ReactNode
  visible?: boolean
}

export function Toast({ children, visible = true }: ToastProps) {
  if (!visible) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
      {children}
    </div>
  )
}
