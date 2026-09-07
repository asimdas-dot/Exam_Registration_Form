export const adminCandidates = Array.from({ length: 18 }).map((_, i) => ({
  applicationNumber: `EXAM2026000${100 + i}`,
  name: `Candidate ${i + 1}`,
  email: `candidate${i + 1}@example.com`,
  mobile: `+91 98765${(100 + i).toString().slice(-4)}`,
  exam: 'General Entrance',
  status: ['DRAFT', 'SUBMITTED', 'UNDER_VERIFICATION', 'APPROVED', 'REJECTED'][i % 5],
  registrationDate: `2026-08-${(10 + (i % 20)).toString().padStart(2, '0')}`
}))

export const adminApplications = adminCandidates.map((c, idx) => ({
  applicationNumber: c.applicationNumber,
  candidateName: c.name,
  exam: c.exam,
  paymentStatus: idx % 3 === 0 ? 'Paid' : 'Pending',
  documentStatus: idx % 4 === 0 ? 'Complete' : 'Pending',
  status: c.status,
  submittedAt: c.registrationDate
}))
