import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageHeader } from '../../components/layout/PageHeader'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { getSummary, addTransaction } from '../../services/mock/mockPaymentService'

export function PaymentPage() {
  const summary = getSummary()
  const [method, setMethod] = useState<'UPI' | 'Debit Card' | 'Credit Card' | 'Net Banking'>('UPI')
  const [processing, setProcessing] = useState(false)
  const navigate = useNavigate()

  function proceedToPayment() {
    setProcessing(true)
    setTimeout(() => {
      // simulate success
      setProcessing(false)
      const txId = 'TXN' + Date.now()
      const tx = {
        transactionId: txId,
        date: new Date().toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: summary.total,
        method,
        status: 'Success' as const,
      }
      addTransaction(tx)
      navigate('/candidate/payment/success', { state: { transactionId: txId, amount: summary.total } })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader title="Payment" description="Complete your application fee payment securely." />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Application summary</h3>
                  <div className="mt-4 grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Application Number</span>
                      <span className="font-medium text-slate-900">{summary.applicationNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Application Fee</span>
                      <span className="font-medium text-slate-900">₹{summary.applicationFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Processing Fee</span>
                      <span className="font-medium text-slate-900">₹{summary.processingFee}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="text-sm font-semibold text-slate-700">Total</span>
                      <span className="text-lg font-bold text-slate-900">₹{summary.total}</span>
                    </div>
                  </div>
                </Card>

                <Card className="mt-6 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Payment methods</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {['UPI', 'Debit Card', 'Credit Card', 'Net Banking'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m as any)}
                        className={['flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition', method === m ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 bg-white text-slate-700'].join(' ')}
                      >
                        <span>{m}</span>
                        <span className="text-xs text-slate-500">{m === 'UPI' ? 'Pay via UPI' : m === 'Net Banking' ? 'Choose bank' : 'Enter card details'}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <aside>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Payment Summary</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-900">₹{summary.applicationFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Processing</span>
                      <span className="font-medium text-slate-900">₹{summary.processingFee}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="text-sm font-semibold text-slate-700">Total</span>
                      <span className="text-lg font-bold text-slate-900">₹{summary.total}</span>
                    </div>
                    <div className="mt-5">
                      <Button onClick={proceedToPayment} className="w-full" disabled={processing}>{processing ? 'Processing…' : 'Proceed to Payment'}</Button>
                    </div>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
