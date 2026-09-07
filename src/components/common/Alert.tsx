import type { ReactNode } from 'react'

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  children: ReactNode
}

const variantClasses: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'border-info-200 bg-info-50 text-info-800',
  success: 'border-success-200 bg-success-50 text-success-800',
  warning: 'border-warning-200 bg-warning-50 text-warning-800',
  danger: 'border-danger-200 bg-danger-50 text-danger-800',
}

export function Alert({ variant = 'info', title, children }: AlertProps) {
  return (
    <div className={['rounded-2xl border p-4', variantClasses[variant]].join(' ')} role="alert">
      {title ? <p className="mb-1 text-sm font-semibold">{title}</p> : null}
      <div className="text-sm leading-6">{children}</div>
    </div>
  )
}
