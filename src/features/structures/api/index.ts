import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import {
  Structure,
  StructureFilters,
  StructureSort,
  CreateStructureData,
  UpdateStructureData,
} from '../types'

interface Property {
  _id: string
  shortAddress: string
  unit?: string
  city?: string
  state?: string
  zipCode?: string
}

interface GetStructuresParams {
  page?: number
  limit?: number
  filters?: StructureFilters
  sort?: StructureSort
}

// API functions
export const structuresApi = {
  getStructures: async (_params?: GetStructuresParams): Promise<Structure[]> => {
    // The backend returns array directly, not paginated response
    return apiClient.get('/api/structure/admin')
  },

  getStructure: async (structureId: string): Promise<Structure> => {
    return apiClient.get(`/api/structure/admin/${structureId}`)
  },

  createStructure: async (
    data: CreateStructureData
  ): Promise<{ id: string }> => {
    return apiClient.post('/api/structure/admin', data)
  },

  updateStructure: async ({
    _id,
    ...data
  }: UpdateStructureData): Promise<void> => {
    return apiClient.patch(`/api/admin/structure/update/${_id}`, {
      ...data,
      _id,
    })
  },

  getUserStructures: async (userId: string): Promise<Structure[]> => {
    return apiClient.get(`/api/structure/user/${userId}`)
  },

  getProperties: async (): Promise<Property[]> => {
    // The backend expects a POST request with pagination params
    const response = await apiClient.post('/api/property/admin/search', {
      page: 0,
      limit: 1000, // Get all properties
      filters: {},
      select: ['_id', 'shortAddress', 'unit', 'city', 'state', 'zipCode']
    })
    return response.properties || []
  },
}

// React Query hooks
export const useStructures = (params?: GetStructuresParams) => {
  return useQuery({
    queryKey: ['structures', params],
    queryFn: () => structuresApi.getStructures(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useStructure = (structureId: string) => {
  return useQuery({
    queryKey: ['structure', structureId],
    queryFn: () => structuresApi.getStructure(structureId),
    enabled: !!structureId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUserStructures = (userId: string) => {
  return useQuery({
    queryKey: ['userStructures', userId],
    queryFn: () => structuresApi.getUserStructures(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateStructure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: structuresApi.createStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] })
      queryClient.invalidateQueries({ queryKey: ['userStructures'] })
    },
  })
}

export const useUpdateStructure = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: structuresApi.updateStructure,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['structures'] })
      queryClient.invalidateQueries({ queryKey: ['structure', variables._id] })
      queryClient.invalidateQueries({ queryKey: ['userStructures'] })
    },
  })
}
