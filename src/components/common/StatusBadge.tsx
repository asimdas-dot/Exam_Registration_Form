interface StatusBadgeProps {
  status: 'draft' | 'submitted' | 'payment_pending' | 'payment_completed' | 'under_verification' | 'approved' | 'rejected' | 'reupload_required' | 'cancellation_requested' | 'cancelled' | 'hall_ticket_available'
  className?: string
}

const badgeMap: Record<StatusBadgeProps['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  submitted: 'bg-info-50 text-info-700',
  payment_pending: 'bg-warning-50 text-warning-700',
  payment_completed: 'bg-success-50 text-success-700',
  under_verification: 'bg-amber-50 text-amber-700',
  approved: 'bg-success-50 text-success-700',
  rejected: 'bg-danger-50 text-danger-700',
  reupload_required: 'bg-danger-50 text-danger-700',
  cancellation_requested: 'bg-warning-50 text-warning-700',
  cancelled: 'bg-slate-200 text-slate-700',
  hall_ticket_available: 'bg-primary-50 text-primary-700',
}

const labelMap: Record<StatusBadgeProps['status'], string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  payment_pending: 'Payment Pending',
  payment_completed: 'Payment Completed',
  under_verification: 'Under Verification',
  approved: 'Approved',
  rejected: 'Rejected',
  reupload_required: 'Reupload Required',
  cancellation_requested: 'Cancellation Requested',
  cancelled: 'Cancelled',
  hall_ticket_available: 'Hall Ticket Available',
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={['inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]', badgeMap[status], className].join(' ')}>
      {labelMap[status]}
    </span>
  )
}
