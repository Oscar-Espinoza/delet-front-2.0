import { apiClient } from '@/lib/api-client'
import type { Hardware, HardwareFilters } from '../types/hardware'

export interface AugustLock {
  id: string
  name: string
}

export interface AugustSerialNumber {
  serialNumber: string
  LockID: string
}

export const hardwareApi = {
  list: async (filters?: HardwareFilters): Promise<Hardware[]> => {
    const params = new URLSearchParams({
      format: 'list',
    })

    if (filters?.category) {
      params.append('category', filters.category)
    }

    if (filters?.status) {
      params.append('status', filters.status)
    }

    if (filters?.operationalStatus) {
      params.append('operationalStatus', filters.operationalStatus)
    }

    if (filters?.search) {
      params.append('search', filters.search)
    }

    return apiClient.get<Hardware[]>(`/api/hardware?${params.toString()}`)
  },

  get: async (id: string): Promise<Hardware> => {
    return apiClient.get<Hardware>(`/api/hardware/${id}`)
  },

  create: async (data: Partial<Hardware>): Promise<Hardware> => {
    return apiClient.post<Hardware>('/api/hardware', data)
  },

  update: async (id: string, data: Partial<Hardware>): Promise<Hardware> => {
    return apiClient.patch<Hardware>(`/api/hardware/${id}`, data)
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/api/hardware/${id}`)
  },

  getLocksList: async (): Promise<AugustLock[]> => {
    return apiClient.get<AugustLock[]>('/api/lock/august-id')
  },

  getSNList: async (): Promise<AugustSerialNumber[]> => {
    return apiClient.get<AugustSerialNumber[]>('/api/lock/august-sn')
  },
}
