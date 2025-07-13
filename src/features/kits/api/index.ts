import { apiClient } from '@/lib/api-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Kit, CreateKitData, UpdateKitData, KitFilters } from '../types'
import { queryKeys } from '@/lib/query-keys'

// API functions
export const kitsApi = {
  // Get all kits with optional filters
  getKits: async (params?: KitFilters): Promise<Kit[]> => {
    const queryParams = new URLSearchParams()
    if (params?.company) {
      queryParams.append('companies', params.company)
    }
    const url = `/api/kits/admin/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get(url)
  },

  // Get single kit by ID
  getKit: async (id: string): Promise<Kit> => {
    return apiClient.get(`/api/kits/${id}`)
  },

  // Create new kit
  createKit: async (data: CreateKitData): Promise<Kit> => {
    return apiClient.post('/api/kits', data)
  },

  // Update existing kit
  updateKit: async ({ _id, ...data }: UpdateKitData): Promise<Kit> => {
    return apiClient.patch(`/api/kits/${_id}`, data)
  },

  // Delete kit
  deleteKit: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/kits/${id}`)
  },

  // Unassign kit from property
  unassignKit: async (id: string): Promise<void> => {
    return apiClient.patch(`/api/kits/unassign/${id}`, {})
  },
}

// React Query hooks
export const useKits = (filters?: KitFilters) => {
  return useQuery({
    queryKey: queryKeys.kits.list(filters),
    queryFn: () => kitsApi.getKits(filters),
  })
}

export const useKit = (id: string) => {
  return useQuery({
    queryKey: queryKeys.kits.detail(id),
    queryFn: () => kitsApi.getKit(id),
    enabled: !!id,
  })
}

export const useCreateKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: kitsApi.createKit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kits.all })
      toast.success('Kit created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create kit')
    },
  })
}

export const useUpdateKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: kitsApi.updateKit,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kits.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.kits.detail(variables._id) })
      toast.success('Kit updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update kit')
    },
  })
}

export const useDeleteKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: kitsApi.deleteKit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kits.all })
      toast.success('Kit deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete kit')
    },
  })
}

export const useUnassignKit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: kitsApi.unassignKit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kits.all })
      toast.success('Kit unassigned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unassign kit')
    },
  })
}