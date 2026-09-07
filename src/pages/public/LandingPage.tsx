import { ArrowRight, BadgeCheck, CalendarRange, CheckCircle2, CircleChevronRight, FileText, LockKeyhole, ShieldCheck, Upload, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PublicLayout } from '../../components/public/PublicLayout'
import { faqs, importantDates, instructions } from '../../mock/publicData'

const steps = [
  { number: '01', title: 'Register', icon: FileText },
  { number: '02', title: 'Complete Application', icon: CheckCircle2 },
  { number: '03', title: 'Upload Documents', icon: Upload },
  { number: '04', title: 'Pay Application Fee', icon: WalletCards },
  { number: '05', title: 'Download Hall Ticket', icon: BadgeCheck },
]

export function LandingPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge variant="primary">Secure online registration portal</Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              EXAM REGISTRATION SYSTEM
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Complete your examination application securely and conveniently.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>New Registration</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Candidate Login</Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success-600" />
                Secure process
              </div>
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-success-600" />
                Confidential data
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 h-40 w-40 rounded-full bg-primary-100 blur-3xl" />
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-blue-100 blur-3xl" />
            <Card className="relative overflow-hidden p-5 shadow-soft">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upcoming exam</p>
                    <h2 className="mt-2 text-2xl font-semibold">Government Recruitment</h2>
                  </div>
                  <div className="rounded-full bg-success-50 p-2 text-success-700">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-card">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Exam Date</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">15 Nov 2026</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-card">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Application Fee</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">₹520</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {['Eligibility verification', 'Document review', 'Payment confirmation'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-100 text-success-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="important-dates" className="bg-slate-100/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Important Dates</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Registration timeline</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {importantDates.map((item) => (
              <Card key={item.label} className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <CalendarRange className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-slate-900">{item.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Process</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">How it works</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {steps.map(({ number, title, icon: Icon }) => (
            <div key={number} className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary-700">{number}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-5 text-lg font-semibold text-slate-900">{title}</p>
              </div>
              {number !== '05' ? <div className="hidden xl:block absolute -right-3 top-1/2 h-px w-6 -translate-y-1/2 bg-slate-200" /> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="instructions" className="bg-slate-100/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Instructions</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Important instructions</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {instructions.map((instruction) => (
              <Card key={instruction} className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-success-700">
                  <CircleChevronRight className="h-5 w-5" />
                </div>
                <p className="text-sm leading-6 text-slate-700">{instruction}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Frequently asked questions</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <summary className="cursor-pointer list-none text-left text-base font-medium text-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <span>{question}</span>
                  <span className="text-xl text-slate-500 group-open:rotate-45 transition-transform">+</span>
                </div>
              </summary>
              <p className="mt-4 text-sm leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
