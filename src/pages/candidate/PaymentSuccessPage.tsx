import { CheckCircle2, Download } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { getTransactions } from '../../services/mock/mockPaymentService'

function downloadReceipt(transactionId: string) {
  const txs = getTransactions()
  const tx = txs.find((t) => t.transactionId === transactionId)
  if (!tx) return alert('Receipt not found')
  const content = `Transaction ID: ${tx.transactionId}\nAmount: ₹${tx.amount}\nMethod: ${tx.method}\nDate: ${tx.date}\nStatus: ${tx.status}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `receipt_${tx.transactionId}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function PaymentSuccessPage() {
  const { state } = useLocation() as any
  const transactionId = state?.transactionId ?? 'TXN202608130999'
  const amount = state?.amount ?? 520

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <Card className="p-8 text-center shadow-soft sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success-50 text-success-700">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">Payment Successful</h1>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Transaction ID</span>
                    <span className="font-medium text-slate-900">{transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Application Number</span>
                    <span className="font-medium text-slate-900">EXAM20260001234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Amount</span>
                    <span className="font-medium text-slate-900">₹{amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Payment Date</span>
                    <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button icon={<Download className="h-4 w-4" />} onClick={() => downloadReceipt(transactionId)}>Download Receipt</Button>
                <Link to="/candidate/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
