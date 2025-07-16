import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import type { User, GetUsersListParams } from '../types'

export const getUsersList = async ({
  role = '',
  company = '',
  active = '',
}: GetUsersListParams = {}): Promise<User[]> => {
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

  return data.map((user) => ({
    ...user,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    jobTitle: user.jobTitle || '',
    profileImage: user.profileImage || '',
    description: user.description || '',
    adminPanelRole: user.adminPanelRole || '',
  }))
}

export const getUser = async (userId: string): Promise<User> => {
  return apiClient.get<User>(`/api/users/${userId}`)
}

interface UpdateUserData {
  lastName: string
  firstName: string
  phone: string
  email: string
  adminPanelRole: string
  active: string
  role: string
  id: string
  company?: string | null
  password?: string
}

export const updateUser = async (
  userId: string,
  data: Partial<User> & { password?: string }
): Promise<User> => {
  // Transform data to match API expectations
  const requestData: UpdateUserData = {
    id: userId,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    phone: data.phone || '',
    email: data.email || '',
    adminPanelRole: data.adminPanelRole || '',
    active: String(data.active !== false), // Convert boolean to string
    role: data.role || '',
    company: data.company || undefined,
  }

  // Only include password if it's provided and not empty
  if (data.password && data.password.trim() !== '') {
    requestData.password = data.password
  }

  return apiClient.post<User>(`/api/users/admin/${userId}`, requestData)
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

// Mutation hook for updating users
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: Partial<User> & { password?: string }
    }) => updateUser(userId, data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}
