import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-200',
  secondary: 'bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-200',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-primary-100',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-200',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-200',
  ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-200',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {icon ? <span className="inline-flex items-center">{icon}</span> : null}
      {children}
    </button>
  )
}
