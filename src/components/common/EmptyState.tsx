import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  title = 'No items found',
  description = 'There is nothing to display at the moment.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  )
}
