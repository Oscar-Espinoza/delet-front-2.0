import { apiClient } from '@/lib/api-client'
import type { User, GetUsersListParams } from '../types'

export const getUsersList = async ({
  role = '',
  company = '',
  active = '',
}: GetUsersListParams = {}): Promise<User[]> => {
  try {
    const params = new URLSearchParams()
    
    if (role) params.append('role', role)
    if (company) params.append('company', company)
    if (active) params.append('active', active)
    
    const data = await apiClient.get<User[]>(
      `/api/users/admin/list${params.toString() ? `?${params.toString()}` : ''}`
    )
    
    // Ensure we always return an array and handle potential undefined fields
    if (!Array.isArray(data)) {
      return []
    }
    
    return data.map(user => ({
      ...user,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      jobTitle: user.jobTitle || '',
      profileImage: user.profileImage || '',
      description: user.description || '',
      adminPanelRole: user.adminPanelRole || '',
    }))
  } catch (error) {
    // Re-throw error for React Query to handle
    throw error
  }
}

export const getUser = async (userId: string): Promise<User> => {
  return apiClient.get<User>(`/api/users/${userId}`)
}

export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
  return apiClient.patch<User>(`/api/users/${userId}`, data)
}

export const deleteUser = async (userId: string): Promise<void> => {
  return apiClient.delete<void>(`/api/users/${userId}`)
}

export const inviteUser = async (data: {
  email: string
  role: string
  company?: string
}): Promise<User> => {
  return apiClient.post<User>('/api/users/invite', data)
}