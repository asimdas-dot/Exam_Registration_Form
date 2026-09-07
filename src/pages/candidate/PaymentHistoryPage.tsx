import { Table } from '../../components/common/Table'
import { CandidateHeader } from '../../components/candidate/CandidateHeader'
import { CandidateSidebar } from '../../components/candidate/CandidateSidebar'
import { PageHeader } from '../../components/layout/PageHeader'
import { getTransactions } from '../../services/mock/mockPaymentService'

export function PaymentHistoryPage() {
  const rows = getTransactions()

  return (
    <div className="min-h-screen bg-slate-50">
      <CandidateHeader />
      <div className="flex min-h-[calc(100vh-81px)]">
        <CandidateSidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader title="Payment history" description="All your transactions related to application fees." />

            <div className="mt-6">
              <Table
                rows={rows}
                columns={[
                  { header: 'Transaction ID', accessor: 'transactionId' },
                  { header: 'Date', accessor: 'date' },
                  { header: 'Amount (₹)', accessor: 'amount' },
                  { header: 'Payment Method', accessor: 'method' },
                  { header: 'Status', accessor: 'status' },
                ]}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
