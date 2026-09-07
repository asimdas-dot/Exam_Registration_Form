import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
}

export function Input({
  label,
  helperText,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      ) : null}
      <input
        className={[
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100',
          error ? 'border-danger-300 bg-danger-50/30' : 'border-slate-200',
          className,
        ].join(' ')}
        {...props}
      />
      {helperText ? <span className="mt-1.5 block text-xs text-slate-500">{helperText}</span> : null}
      {error ? <span className="mt-1.5 block text-xs font-medium text-danger-600">{error}</span> : null}
    </label>
  )
}
