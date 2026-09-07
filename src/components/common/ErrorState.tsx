import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  description?: string
}

export function ErrorState({
  title = 'Unable to load data',
  description = 'Something went wrong while retrieving the latest information.',
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-danger-200 bg-danger-50 p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-100 text-danger-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-danger-700">{title}</h3>
        <p className="mt-2 text-sm text-danger-600">{description}</p>
      </div>
    </div>
  )
}
