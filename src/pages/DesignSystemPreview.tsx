import { useState } from 'react'
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  Sparkles,
  UploadCloud,
  UserRound,
  XCircle,
} from 'lucide-react'
import { Alert } from '../components/common/Alert'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Input } from '../components/common/Input'
import { LoadingState } from '../components/common/LoadingState'
import { Modal } from '../components/common/Modal'
import { Pagination } from '../components/common/Pagination'
import { StatusBadge } from '../components/common/StatusBadge'
import { Table } from '../components/common/Table'
import { Toast } from '../components/common/Toast'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { PageContainer } from '../components/layout/PageContainer'
import { PageHeader } from '../components/layout/PageHeader'

const stats = [
  { label: 'Total Candidates', value: '24,680', tone: 'primary' },
  { label: 'Submitted', value: '18,410', tone: 'success' },
  { label: 'Under Verification', value: '2,130', tone: 'warning' },
  { label: 'Approved', value: '4,140', tone: 'info' },
]

const rows = [
  { applicationNumber: 'EXAM20260001234', name: 'Asim Das', status: 'under_verification', date: '2026-08-13' },
  { applicationNumber: 'EXAM20260001235', name: 'Riya Sen', status: 'approved', date: '2026-08-12' },
  { applicationNumber: 'EXAM20260001236', name: 'Amit Roy', status: 'payment_pending', date: '2026-08-11' },
  { applicationNumber: 'EXAM20260001237', name: 'Nisha Das', status: 'rejected', date: '2026-08-09' },
]

const progressSteps = [
  { label: 'Registration', done: true },
  { label: 'Profile', done: true },
  { label: 'Documents', done: true },
  { label: 'Payment', done: true },
  { label: 'Submission', done: true },
  { label: 'Verification', done: false },
  { label: 'Approval', done: false },
]

const timeline = [
  { title: 'Registration created', date: '13 Aug 2026', status: 'done' },
  { title: 'Documents uploaded', date: '13 Aug 2026', status: 'done' },
  { title: 'Payment completed', date: '13 Aug 2026', status: 'done' },
  { title: 'Application submitted', date: '13 Aug 2026', status: 'done' },
  { title: 'Document verification', date: '14 Aug 2026', status: 'pending' },
]

function Breadcrumb() {
  return (
    <nav className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
      <span>Home</span>
      <ChevronRight className="h-3.5 w-3.5" />
      <span>Operations</span>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-slate-700">Design System</span>
    </nav>
  )
}

function Tabs() {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
      {['Overview', 'Applications', 'Audit', 'Settings'].map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={[
            'rounded-lg px-3 py-2 text-sm font-medium transition',
            index === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600',
          ].join(' ')}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

function FileUploadDemo() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Government Identification</p>
          <p className="mt-1 text-xs text-slate-500">PDF, JPG or PNG • Max 2 MB</p>
        </div>
        <Badge variant="warning">Required</Badge>
      </div>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-300 bg-white px-3 py-2 text-sm font-medium text-primary-700"
      >
        <UploadCloud className="h-4 w-4" /> Upload Document
      </button>
    </div>
  )
}

function ProgressTracker() {
  return (
    <div className="flex flex-wrap gap-3">
      {progressSteps.map(({ label, done }) => (
        <div key={label} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
          <span className={['flex h-6 w-6 items-center justify-center rounded-full', done ? 'bg-success-100 text-success-700' : 'bg-slate-100 text-slate-500'].join(' ')}>
            {done ? <Check className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
          </span>
          {label}
        </div>
      ))}
    </div>
  )
}

function Timeline({ items }: { items: typeof timeline }) {
  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <div key={item.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={['flex h-8 w-8 items-center justify-center rounded-full', item.status === 'done' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'].join(' ')}>
              {item.status === 'done' ? <Check className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
            </div>
            {index < items.length - 1 ? <div className="mt-2 h-8 w-px bg-slate-200" /> : null}
          </div>
          <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-slate-800">{item.title}</p>
              <Badge variant={item.status === 'done' ? 'success' : 'warning'}>{item.status === 'done' ? 'Completed' : 'Pending'}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DesignSystemPreview() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <PageContainer className="space-y-8 pb-12">
          <Breadcrumb />
          <PageHeader
            title="Design System"
            description="A modern, accessible foundation for the Exam Registration System including reusable UI primitives, layout patterns, and content states."
            action={<Button icon={<Sparkles className="h-4 w-4" />} variant="primary">Preview Components</Button>}
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                  <Badge variant={stat.tone === 'primary' ? 'primary' : stat.tone === 'success' ? 'success' : stat.tone === 'warning' ? 'warning' : 'info'}>
                    +12.5%
                  </Badge>
                </div>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Brand</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Core actions and controls</h2>
                </div>
                <Tabs />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button>Primary CTA</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input label="Application Number" placeholder="EXAM20260001234" defaultValue="EXAM20260001234" />
                <Input label="Email Address" type="email" placeholder="candidate@example.com" defaultValue="candidate@example.com" />
                <Input label="Start Date" type="date" defaultValue="2026-09-01" />
                <Input label="Password" type="password" defaultValue="Secure@123" />
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Status</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Application states</h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-700">Draft</span>
                  <StatusBadge status="draft" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-700">Submitted</span>
                  <StatusBadge status="submitted" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-700">Payment pending</span>
                  <StatusBadge status="payment_pending" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-700">Under verification</span>
                  <StatusBadge status="under_verification" />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <span className="text-sm text-slate-700">Approved</span>
                  <StatusBadge status="approved" />
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-50 text-info-700"><Info className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-slate-900">Information</h3>
              </div>
              <Alert title="Candidate notice" variant="info">
                Your application ID is valid for 30 days. Keep it confidential and use it for all portal updates.
              </Alert>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-700"><Check className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-slate-900">Success</h3>
              </div>
              <Alert title="Payment verified" variant="success">
                The transaction has been approved and the receipt has been successfully mirrored into the system.
              </Alert>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-warning-700"><Bell className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-slate-900">Warning</h3>
              </div>
              <Alert title="Document pending" variant="warning">
                One uploaded document requires a clearer image before it can proceed to verification.
              </Alert>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Workflow</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Progress tracker</h2>
                </div>
                <Badge variant="info">Live</Badge>
              </div>
              <ProgressTracker />
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700"><UserRound className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-slate-900">User status</h3>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm text-slate-500">Candidate</p>
                  <p className="mt-1 font-medium text-slate-900">Asim Das</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm text-slate-500">Application number</p>
                  <p className="mt-1 font-medium text-slate-900">EXAM20260001234</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm text-slate-500">Last updated</p>
                  <p className="mt-1 font-medium text-slate-900">13 August 2026</p>
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Table</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Candidate overview</h2>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>

              <Table
                rows={rows}
                columns={[
                  { header: 'Application Number', accessor: 'applicationNumber' },
                  { header: 'Candidate', accessor: 'name' },
                  {
                    header: 'Status',
                    accessor: 'status',
                    render: (value) => <StatusBadge status={value as never} />,
                  },
                  { header: 'Date', accessor: 'date' },
                ]}
              />

              <div className="mt-5">
                <Pagination currentPage={2} totalPages={5} />
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Timeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Application history</h2>
              <div className="mt-5">
                <Timeline items={timeline} />
              </div>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Upload</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Document card</h2>
                </div>
                <Badge variant="neutral">Mock UI</Badge>
              </div>
              <FileUploadDemo />
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Interaction</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Modal and toast</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
                  Open modal
                </Button>
              </div>

              <div className="space-y-4">
                <Alert variant="warning" title="Pending action">
                  A document has been flagged for resubmission. Review the notes before continuing.
                </Alert>
                <div className="flex gap-3">
                  <Button icon={<Check className="h-4 w-4" />} variant="success">Approve</Button>
                  <Button icon={<XCircle className="h-4 w-4" />} variant="danger">Reject</Button>
                </div>
              </div>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">State</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">Loading, empty, and error states</h2>
                  </div>
                  <Badge variant="neutral">Reusable</Badge>
                </div>

                <div className="space-y-4">
                  <LoadingState title="Preparing dashboard" description="Fetching candidate data and notifications." />
                  <EmptyState title="No documents uploaded yet" description="Upload the required documents to continue with your examination application." action={<Button variant="outline">Upload files</Button>} />
                  <ErrorState title="Unable to load application" description="The application data could not be retrieved. Please try again in a moment." />
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700"><FileText className="h-5 w-5" /></div>
                <h3 className="text-lg font-semibold text-slate-900">Required reads</h3>
              </div>
              <div className="space-y-3">
                {['Candidate guidelines', 'Application checklist', 'Department policy', 'Accessibility statement'].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-sm text-slate-700">{item}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </PageContainer>
      </main>
      <Footer />

      <Modal open={modalOpen} title="Confirm action" onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">
            This action will update the selected application and notify the candidate regarding the review outcome.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Continue</Button>
          </div>
        </div>
      </Modal>

      <Toast visible>
        Design system preview is ready for handoff.
      </Toast>
    </div>
  )
}
