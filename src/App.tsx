import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ApplicationEditPage } from './pages/candidate/ApplicationEditPage'
import { ApplicationHistoryPage } from './pages/candidate/ApplicationHistoryPage'
import { ApplicationPage } from './pages/candidate/ApplicationPage'
import { ApplicationReviewPage } from './pages/candidate/ApplicationReviewPage'
import { ApplicationViewPage } from './pages/candidate/ApplicationViewPage'
import { CandidateDashboardPage } from './pages/candidate/CandidateDashboardPage'
import { DocumentVerificationStatusPage } from './pages/candidate/DocumentVerificationStatusPage'
import { DocumentsPage } from './pages/candidate/DocumentsPage'
import { PaymentPage } from './pages/candidate/PaymentPage'
import { PaymentSuccessPage } from './pages/candidate/PaymentSuccessPage'
import { PaymentHistoryPage } from './pages/candidate/PaymentHistoryPage'
import { CancellationPage } from './pages/candidate/CancellationPage'
import { CancellationSuccessPage } from './pages/candidate/CancellationSuccessPage'
import { HallTicketPage } from './pages/candidate/HallTicketPage'
import { HallTicketPreviewPage } from './pages/candidate/HallTicketPreviewPage'
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage'
import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { RegistrationSuccessPage } from './pages/public/RegistrationSuccessPage'

// admin pages (lazy loaded)
const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })))
const AdminCandidatesPage = React.lazy(() => import('./pages/admin/AdminCandidatesPage').then((m) => ({ default: m.AdminCandidatesPage })))
const AdminApplicationsPage = React.lazy(() => import('./pages/admin/AdminApplicationsPage').then((m) => ({ default: m.AdminApplicationsPage })))
const AdminApplicationViewPage = React.lazy(() => import('./pages/admin/AdminApplicationViewPage').then((m) => ({ default: m.AdminApplicationViewPage })))
const AdminCandidateViewPage = React.lazy(() => import('./pages/admin/AdminCandidateViewPage').then((m) => ({ default: m.AdminCandidateViewPage })))
const AdminAuditLogsPage = React.lazy(() => import('./pages/admin/AdminAuditLogsPage').then((m) => ({ default: m.AdminAuditLogsPage })))
const AdminAuditLogDetailPage = React.lazy(() => import('./pages/admin/AdminAuditLogDetailPage').then((m) => ({ default: m.AdminAuditLogDetailPage })))
const AdminDocumentsPage = React.lazy(() => import('./pages/admin/AdminDocumentsPage').then((m) => ({ default: m.AdminDocumentsPage })))
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })))
import { RequireAdmin } from './components/admin/RequireAdmin'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
          <Route path="/candidate/application" element={<ApplicationPage />} />
          <Route path="/candidate/application/review" element={<ApplicationReviewPage />} />
          <Route path="/candidate/application/view" element={<ApplicationViewPage />} />
          <Route path="/candidate/application/edit" element={<ApplicationEditPage />} />
          <Route path="/candidate/application/history" element={<ApplicationHistoryPage />} />
          <Route path="/candidate/documents" element={<DocumentsPage />} />
          <Route path="/candidate/documents/status" element={<DocumentVerificationStatusPage />} />
          <Route path="/candidate/payment" element={<PaymentPage />} />
          <Route path="/candidate/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/candidate/payment/history" element={<PaymentHistoryPage />} />

          <Route path="/candidate/hall-ticket" element={<HallTicketPage />} />
          <Route path="/candidate/hall-ticket/preview" element={<HallTicketPreviewPage />} />

          <Route path="/candidate/cancellation" element={<CancellationPage />} />
          <Route path="/candidate/cancellation/success" element={<CancellationSuccessPage />} />

          {/* Admin routes (lazy) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
          <Route path="/admin/candidates" element={<RequireAdmin><AdminCandidatesPage /></RequireAdmin>} />
          <Route path="/admin/candidates/:id" element={<RequireAdmin><AdminCandidateViewPage /></RequireAdmin>} />
          <Route path="/admin/applications" element={<RequireAdmin><AdminApplicationsPage /></RequireAdmin>} />
          <Route path="/admin/applications/:id" element={<RequireAdmin><AdminApplicationViewPage /></RequireAdmin>} />
          <Route path="/admin/documents" element={<RequireAdmin><AdminDocumentsPage /></RequireAdmin>} />
          <Route path="/admin/audit-logs" element={<RequireAdmin><AdminAuditLogsPage /></RequireAdmin>} />
          <Route path="/admin/audit-logs/:id" element={<RequireAdmin><AdminAuditLogDetailPage /></RequireAdmin>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
