export const paymentSummary = {
  applicationNumber: 'EXAM20260001234',
  applicationFee: 500,
  processingFee: 20,
  total: 520,
}

export const paymentTransactions = [
  {
    transactionId: 'TXN202608130001',
    date: '13 Aug 2026',
    amount: 520,
    method: 'Debit Card',
    status: 'Success',
  },
  {
    transactionId: 'TXN202608120045',
    date: '12 Aug 2026',
    amount: 520,
    method: 'UPI',
    status: 'Failed',
  },
]
