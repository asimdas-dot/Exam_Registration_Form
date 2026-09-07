import React from 'react'
import { Navigate } from 'react-router-dom'
import { mockAuthService } from '../../services/mock/mockAuthService'

export const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (!mockAuthService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
