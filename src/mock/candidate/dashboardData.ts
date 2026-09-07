export const candidateProfile = {
  name: 'Asim Das',
  applicationNumber: 'EXAM20260001234',
  lastUpdated: '13 August 2026',
  status: 'under_verification' as const,
}

export const progressSteps = [
  { label: 'Registration', done: true },
  { label: 'Profile', done: true },
  { label: 'Documents', done: true },
  { label: 'Payment', done: true },
  { label: 'Submission', done: true },
  { label: 'Verification', done: false },
  { label: 'Approval', done: false },
  { label: 'Hall Ticket', done: false, locked: true },
]

export const quickActions = [
  'View Application',
  'Edit Application',
  'Documents',
  'Payment',
  'Application Receipt',
  'Cancellation',
  'Hall Ticket',
]

export const notifications = [
  'Your payment has been successfully completed.',
  'Your government ID is under verification.',
  'Hall ticket has not yet been released.',
]
