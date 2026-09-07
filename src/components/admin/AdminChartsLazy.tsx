import React, { Suspense } from 'react'

const ChartsImpl = React.lazy(() => import('./ChartsImpl'))

export const AdminChartsLazy: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-40 flex items-center justify-center text-slate-400">Loading chart...</div>}>
      <ChartsImpl />
    </Suspense>
  )
}
