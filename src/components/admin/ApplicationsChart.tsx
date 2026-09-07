import React from 'react'
import { mockAdminService } from '../../services/mock/mockAdminService'

export const ApplicationsChart: React.FC = () => {
  const data = mockAdminService.getApplications()
  const counts: Record<string, number> = {}
  data.forEach((d) => {
    counts[d.status] = (counts[d.status] || 0) + 1
  })
  const entries = Object.entries(counts)
  const max = Math.max(...entries.map(([, v]) => v), 1)

  return (
    <div className="w-full">
      <svg viewBox="0 0 600 160" className="w-full h-40">
        {entries.map(([k, v], i) => {
          const barW = (v / max) * 420
          const x = 40
          const y = 20 + i * 24
          return (
            <g key={k}>
              <text x={10} y={y + 12} fontSize={12} fill="#475569">{k}</text>
              <rect x={x} y={y} width={barW} height={18} rx={6} fill="#1e3a8a" opacity={0.85} />
              <text x={x + barW + 8} y={y + 12} fontSize={12} fill="#0f172a">{v}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
