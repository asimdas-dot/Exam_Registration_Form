import { paymentSummary as defaultSummary, paymentTransactions as seedTransactions } from '../../mock/candidate/paymentData'

const KEY = 'mock_payment_transactions'

export type Transaction = {
  transactionId: string
  date: string
  amount: number
  method: string
  status: 'Success' | 'Failed' | 'Pending'
}

export function getSummary() {
  return defaultSummary
}

export function getTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seedTransactions))
      return seedTransactions as Transaction[]
    }
    return JSON.parse(raw) as Transaction[]
  } catch (e) {
    console.error('Failed to read transactions', e)
    return seedTransactions as Transaction[]
  }
}

export function addTransaction(tx: Transaction) {
  const list = getTransactions()
  list.unshift(tx)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function clearTransactions() {
  localStorage.removeItem(KEY)
}
