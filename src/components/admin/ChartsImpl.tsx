import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { mockAdminService } from '../../services/mock/mockAdminService'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ChartsImpl: React.FC = () => {
  const data = mockAdminService.getApplications()
  const counts: Record<string, number> = {}
  data.forEach((d) => (counts[d.status] = (counts[d.status] || 0) + 1))
  const labels = Object.keys(counts)
  const values = labels.map((l) => counts[l])

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Applications',
        data: values,
        backgroundColor: 'rgba(30,58,138,0.8)'
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    }
  }

  return <Bar data={chartData} options={options} />
}

export default ChartsImpl
