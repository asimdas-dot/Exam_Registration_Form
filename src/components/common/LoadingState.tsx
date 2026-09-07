import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  title?: string
  description?: string
}

export function LoadingState({
  title = 'Loading',
  description = 'Please wait while your data is being prepared.',
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <div>
          <p className="text-base font-semibold text-slate-800">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  )
}
