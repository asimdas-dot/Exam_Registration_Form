import { adminApplications, adminCandidates } from '../../mock/admin/adminData'

type Listener = () => void

const STORAGE_PREFIX = 'exam_admin_'

function readJSON(key: string) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function writeJSON(key: string, v: any) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(v))
  } catch (e) {
    // ignore
  }
}

let applications: any[] = readJSON('applications') || adminApplications.map((a) => ({ ...a }))
let candidates: any[] = readJSON('candidates') || adminCandidates.map((c) => ({ ...c }))
let auditLogs: Array<any> = readJSON('auditLogs') || []

const listeners: Listener[] = []

function persist() {
  writeJSON('applications', applications)
  writeJSON('candidates', candidates)
  writeJSON('auditLogs', auditLogs)
}

import { realtimeService } from '../realtimeService'

function addAuditEntry(entry: { action: string; applicationNumber?: string; by?: string; note?: string }) {
  const e = { id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, timestamp: new Date().toISOString(), ...entry }
  auditLogs.unshift(e)
  persist()
  listeners.forEach((l) => l())
  try {
    realtimeService.publish('audit:entry', e)
  } catch (e) {
    // ignore
  }
}

export const mockAdminService = {
  getApplications: () => applications.slice(),
  getCandidates: () => candidates.slice(),
  getApplicationById: (id: string) => applications.find((a) => a.applicationNumber === id) || null,
  getCandidateByApp: (id: string) => candidates.find((c) => c.applicationNumber === id) || null,
  syncApplicationsFromCandidates: (records: any[]) => {
    const synced = records
      .filter((candidate) => candidate?.applicationNumber)
      .map((candidate) => {
        const existing = applications.find((application) => application.applicationNumber === candidate.applicationNumber)
        return {
          ...existing,
          applicationNumber: candidate.applicationNumber,
          candidateName: candidate.name || candidate.personal?.fullName || 'Unnamed candidate',
          exam: candidate.exam?.name || candidate.exam?.examName || existing?.exam || 'Not selected',
          paymentStatus: candidate.paymentStatus || existing?.paymentStatus || 'Pending',
          documentStatus: candidate.documentStatus || existing?.documentStatus || 'Pending',
          status: candidate.status || existing?.status || 'SUBMITTED',
          submittedAt: candidate.updatedAt || candidate.registrationDate || candidate.createdAt || existing?.submittedAt || '',
        }
      })
    applications = synced
    candidates = records
    persist()
    listeners.forEach((listener) => listener())
    return applications.slice()
  },
  updateApplicationStatus: (id: string, status: string, adminRemark?: string, by = 'admin') => {
    const idx = applications.findIndex((a) => a.applicationNumber === id)
    if (idx === -1) return false
    const prev = applications[idx].status
    applications[idx] = { ...applications[idx], status, adminRemark, lastUpdated: new Date().toISOString() }
    // also update candidate status if present
    const cidx = candidates.findIndex((c) => c.applicationNumber === id)
    if (cidx !== -1) candidates[cidx] = { ...candidates[cidx], status }
    addAuditEntry({ action: `STATUS_CHANGE:${prev}->${status}`, applicationNumber: id, by, note: adminRemark })
    try { realtimeService.publish('application:status', { applicationNumber: id, status, adminRemark, by }) } catch (e) {}
    persist()
    listeners.forEach((l) => l())
    return true
  },
  bulkUpdateApplications: (ids: string[], status: string, adminRemark?: string, by = 'admin') => {
    const changed: string[] = []
    ids.forEach((id) => {
      const idx = applications.findIndex((a) => a.applicationNumber === id)
      if (idx !== -1) {
        const prev = applications[idx].status
        applications[idx] = { ...applications[idx], status, adminRemark, lastUpdated: new Date().toISOString() }
        const cidx = candidates.findIndex((c) => c.applicationNumber === id)
        if (cidx !== -1) candidates[cidx] = { ...candidates[cidx], status }
        addAuditEntry({ action: `BULK_STATUS_CHANGE:${prev}->${status}`, applicationNumber: id, by, note: adminRemark })
        try { realtimeService.publish('application:bulk_status', { applicationNumber: id, status, adminRemark, by }) } catch (e) {}
        changed.push(id)
      }
    })
    if (changed.length) {
      persist()
      listeners.forEach((l) => l())
    }
    return changed
  },
  clearApplications: () => {
    applications = []
    persist()
    listeners.forEach((l) => l())
  },
  // New: list uploaded documents (scans localStorage keys starting with 'doc_upload_')
  getUploadedDocuments: () => {
    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith('doc_upload_')) keys.push(k)
      }
      return keys.map((k) => {
        const raw = localStorage.getItem(k)
        const parsed = raw ? JSON.parse(raw) : null
        return { key: k, record: parsed }
      })
    } catch (e) {
      return []
    }
  },
  approveDocument: (storageKey: string, by = 'admin') => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return false
      const parsed = JSON.parse(raw)
      parsed.status = 'approved'
      parsed.adminRemark = parsed.adminRemark || ''
      parsed.adminActionBy = by
      parsed.adminActionAt = new Date().toISOString()
      localStorage.setItem(storageKey, JSON.stringify(parsed))
      addAuditEntry({ action: `DOC_APPROVED:${storageKey}`, applicationNumber: parsed.applicationNumber || undefined, by, note: `Approved ${storageKey}` })
      try { realtimeService.publish('document:approved', { key: storageKey, record: parsed }) } catch (e) {}
      listeners.forEach((l) => l())
      return true
    } catch (e) {
      return false
    }
  },
  rejectDocument: (storageKey: string, reason?: string, by = 'admin') => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return false
      const parsed = JSON.parse(raw)
      parsed.status = 'rejected'
      parsed.adminRemark = reason || ''
      parsed.adminActionBy = by
      parsed.adminActionAt = new Date().toISOString()
      localStorage.setItem(storageKey, JSON.stringify(parsed))
      addAuditEntry({ action: `DOC_REJECTED:${storageKey}`, applicationNumber: parsed.applicationNumber || undefined, by, note: reason })
      try { realtimeService.publish('document:rejected', { key: storageKey, record: parsed, reason }) } catch (e) {}
      listeners.forEach((l) => l())
      return true
    } catch (e) {
      return false
    }
  },
  // Set an admin remark/note on an uploaded document without changing status
  setDocumentRemark: (storageKey: string, remark: string, by = 'admin') => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return false
      const parsed = JSON.parse(raw)
      parsed.adminRemark = remark
      parsed.adminActionBy = by
      parsed.adminActionAt = new Date().toISOString()
      localStorage.setItem(storageKey, JSON.stringify(parsed))
      addAuditEntry({ action: `DOC_REMARK:${storageKey}`, applicationNumber: parsed.applicationNumber || undefined, by, note: remark })
      try { realtimeService.publish('document:remark', { key: storageKey, record: parsed, remark }) } catch (e) {}
      listeners.forEach((l) => l())
      return true
    } catch (e) {
      return false
    }
  },
  // Bulk document actions
  bulkApproveDocuments: (keys: string[], by = 'admin') => {
    const changed: string[] = []
    keys.forEach((k) => {
      const ok = mockAdminService.approveDocument(k, by)
      if (ok) changed.push(k)
    })
    return changed
  },
  bulkRejectDocuments: (keys: string[], reason?: string, by = 'admin') => {
    const changed: string[] = []
    keys.forEach((k) => {
      const ok = mockAdminService.rejectDocument(k, reason, by)
      if (ok) changed.push(k)
    })
    return changed
  },
  getAuditLogs: () => auditLogs.slice(),
  resetToSeed: () => {
    applications = adminApplications.map((a) => ({ ...a }))
    candidates = adminCandidates.map((c) => ({ ...c }))
    auditLogs = []
    persist()
    listeners.forEach((l) => l())
  },
  subscribe: (cb: Listener) => {
    listeners.push(cb)
    return () => {
      const i = listeners.indexOf(cb)
      if (i !== -1) listeners.splice(i, 1)
    }
  },
}
