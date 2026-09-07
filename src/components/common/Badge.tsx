import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info'
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  primary: 'bg-primary-50 text-primary-700 ring-primary-200',
  success: 'bg-success-50 text-success-700 ring-success-200',
  warning: 'bg-warning-50 text-warning-700 ring-warning-200',
  danger: 'bg-danger-50 text-danger-700 ring-danger-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-info-50 text-info-700 ring-info-200',
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase ring-1 ring-inset',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
