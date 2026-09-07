import { describe, it, expect, beforeEach } from 'vitest'
import { mockAdminService } from '../services/mock/mockAdminService'

describe('mockAdminService', () => {
  beforeEach(() => {
    // reset by reloading module data would be ideal; here we rely on initial seed
  })

  it('should return applications and candidates', () => {
    const apps = mockAdminService.getApplications()
    const cands = mockAdminService.getCandidates()
    expect(Array.isArray(apps)).toBe(true)
    expect(Array.isArray(cands)).toBe(true)
  })

  it('should update application status and create audit log', () => {
    const apps = mockAdminService.getApplications()
    const id = apps[0].applicationNumber
    const res = mockAdminService.updateApplicationStatus(id, 'APPROVED', 'Approved in test', 'test-user')
    expect(res).toBe(true)
    const updated = mockAdminService.getApplicationById(id)
    expect(updated.status).toBe('APPROVED')
    const logs = mockAdminService.getAuditLogs()
    expect(logs.length).toBeGreaterThan(0)
    const found = logs.find((l) => l.applicationNumber === id && l.action.includes('STATUS_CHANGE'))
    expect(!!found).toBe(true)
  })

  it('should bulk update applications', () => {
    const apps = mockAdminService.getApplications()
    const ids = apps.slice(0, 2).map((a) => a.applicationNumber)
    const changed = mockAdminService.bulkUpdateApplications(ids, 'REJECTED', 'Bulk reject', 'test-user')
    expect(changed.length).toBeGreaterThan(0)
    const logs = mockAdminService.getAuditLogs()
    const any = logs.find((l) => ids.includes(l.applicationNumber) && l.action.includes('BULK_STATUS_CHANGE'))
    expect(!!any).toBe(true)
  })
})
