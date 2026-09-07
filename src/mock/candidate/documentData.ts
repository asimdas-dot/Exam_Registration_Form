export const documentRows = [
  {
    name: 'Government Identification',
    required: true,
    status: 'pending',
    format: 'PDF, JPG or PNG',
    size: 'Max 2 MB',
    note: 'Upload a clear, readable document.',
  },
  {
    name: 'Exam Result',
    required: true,
    status: 'under_review',
    format: 'PDF or JPG',
    size: 'Max 2 MB',
    note: 'Latest qualifying result required.',
  },
  {
    name: 'Photograph',
    required: true,
    status: 'rejected',
    format: 'JPG or PNG',
    size: 'Max 1 MB',
    note: 'Image is unclear.',
  },
  {
    name: 'Signature',
    required: false,
    status: 'approved',
    format: 'PNG or JPG',
    size: 'Max 1 MB',
    note: 'Accepted and verified.',
  },
]

export const documentVerificationRows = [
  { name: 'Government ID', status: 'approved', detail: 'Approved' },
  { name: 'Exam Result', status: 'under_review', detail: 'Under Verification' },
  { name: 'Photograph', status: 'rejected', detail: 'Rejected', reason: 'Image is unclear.' },
]
