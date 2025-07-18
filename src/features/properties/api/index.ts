import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import type {
  Property,
  PropertiesResponse,
  PropertyFilters,
  CreatePropertyFormData,
  UpdatePropertyFormData,
} from '../types'

// API functions
export const propertiesApi = {
  // Get all properties with filters (admin search)
  getProperties: async (
    filters?: PropertyFilters
  ): Promise<PropertiesResponse> => {
    const requestBody = {
      page: filters?.page ? filters.page - 1 : 0, // Backend uses 0-based pagination
      limit: filters?.limit || 10,
      filters: {} as Record<string, unknown>,
      sort: {} as Record<string, number>,
      select: [],
    }

    // Build filters object
    if (filters?.search) {
      requestBody.filters.search = filters.search
    }
    if (filters?.status && filters.status.length > 0) {
      requestBody.filters.status = filters.status
    }
    if (filters?.type && filters.type.length > 0) {
      requestBody.filters.propertyType = filters.type
    }
    if (filters?.companiesIds && filters.companiesIds.length > 0) {
      requestBody.filters.companies = filters.companiesIds
    }
    if (filters?.classification && filters.classification.length > 0) {
      requestBody.filters.classification = filters.classification
    }

    // Build sort object
    if (filters?.sortBy) {
      requestBody.sort[filters.sortBy] = filters.sortOrder === 'desc' ? -1 : 1
    }

    const response = await apiClient.post<PropertiesResponse>(
      '/api/property/admin/search',
      requestBody
    )
    return response
  },

  // Get single property
  getProperty: async (id: string): Promise<Property> => {
    const response = await apiClient.get<Property>(`/api/property/${id}`)
    return response
  },

  // Create property
  createProperty: async (data: CreatePropertyFormData): Promise<Property> => {
    const formData = new FormData()

    // Add text fields
    if (data.shortAddress) formData.append('shortAddress', data.shortAddress)
    if (data.street) formData.append('street', data.street)
    if (data.unit) formData.append('unit', data.unit)
    if (data.city) formData.append('city', data.city)
    if (data.state) formData.append('state', data.state)
    if (data.zipCode) formData.append('zipCode', data.zipCode)
    formData.append('type', data.type)
    formData.append('status', data.status)
    if (data.price) formData.append('price', data.price.toString())
    formData.append('isManaged', data.isManaged.toString())
    if (data.redirectUrl) formData.append('redirectUrl', data.redirectUrl)
    if (data.company) formData.append('company', data.company)
    if (data.kit) formData.append('kit', data.kit)

    // Add image files
    if (data.primaryImage) {
      formData.append('primaryImage', data.primaryImage)
    }
    if (data.images?.length) {
      data.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    const response = await apiClient.post<Property>('/api/property', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Update property
  updateProperty: async ({
    _id,
    ...data
  }: UpdatePropertyFormData): Promise<Property> => {
    const formData = new FormData()

    // Add text fields
    if (data.shortAddress !== undefined)
      formData.append('shortAddress', data.shortAddress || '')
    if (data.street !== undefined) formData.append('street', data.street)
    if (data.unit !== undefined) formData.append('unit', data.unit || '')
    if (data.city !== undefined) formData.append('city', data.city)
    if (data.state !== undefined) formData.append('state', data.state)
    if (data.zipCode !== undefined) formData.append('zipCode', data.zipCode)
    if (data.type !== undefined) formData.append('type', data.type)
    if (data.status !== undefined) formData.append('status', data.status)
    if (data.price !== undefined)
      formData.append('price', data.price.toString())
    if (data.isManaged !== undefined)
      formData.append('isManaged', data.isManaged.toString())
    if (data.redirectUrl !== undefined)
      formData.append('redirectUrl', data.redirectUrl || '')
    if (data.company !== undefined)
      formData.append('company', data.company || '')
    if (data.kit !== undefined) formData.append('kit', data.kit || '')

    // Add image files
    if (data.primaryImage) {
      formData.append('primaryImage', data.primaryImage)
    }
    if (data.images?.length) {
      data.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    const response = await apiClient.put<Property>(
      `/api/property/${_id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response
  },

  // Update property status
  updatePropertyStatus: async (
    id: string,
    status: string
  ): Promise<Property> => {
    const response = await apiClient.patch<Property>(
      `/api/property/status/${id}/${status}`,
      {}
    )
    return response
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/api/property/${id}`)
  },

  // Archive property
  archiveProperty: async (id: string): Promise<Property> => {
    const response = await apiClient.post<Property>(
      `/api/property/${id}/archive`
    )
    return response
  },

  // Restore property
  restoreProperty: async (id: string): Promise<Property> => {
    const response = await apiClient.post<Property>(
      `/api/property/${id}/restore`
    )
    return response
  },

  // Duplicate property
  duplicateProperty: async (id: string): Promise<Property> => {
    const response = await apiClient.post<Property>(
      `/api/property/${id}/duplicate`
    )
    return response
  },

  // Assign property to user
  assignProperty: async (id: string, userId: string): Promise<Property> => {
    const response = await apiClient.post<Property>(
      `/api/property/${id}/assign`,
      { userId }
    )
    return response
  },

  // Update property management status
  updateManagement: async (
    id: string,
    isManaged: boolean
  ): Promise<Property> => {
    const response = await apiClient.patch<Property>(
      `/api/property/update-management/${id}`,
      { isManaged }
    )
    return response
  },
}

// React Query hooks
export const useProperties = (filters?: PropertyFilters) => {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => propertiesApi.getProperties(filters),
  })
}

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => propertiesApi.getProperty(id),
    enabled: !!id,
  })
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: propertiesApi.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property created successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to create property'
          : 'Failed to create property'
      toast.error(message)
    },
  })
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: propertiesApi.updateProperty,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      queryClient.setQueryData(queryKeys.properties.detail(data._id), data)
      toast.success('Property updated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to update property'
          : 'Failed to update property'
      toast.error(message)
    },
  })
}

export const useUpdatePropertyStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      propertiesApi.updatePropertyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property status updated')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to update status'
          : 'Failed to update status'
      toast.error(message)
    },
  })
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: propertiesApi.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property deleted successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to delete property'
          : 'Failed to delete property'
      toast.error(message)
    },
  })
}

export const useArchiveProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: propertiesApi.archiveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property archived successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to archive property'
          : 'Failed to archive property'
      toast.error(message)
    },
  })
}

export const useRestoreProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: propertiesApi.restoreProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property restored successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to restore property'
          : 'Failed to restore property'
      toast.error(message)
    },
  })
}

export const useDuplicateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: propertiesApi.duplicateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property duplicated successfully')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || 'Failed to duplicate property'
          : 'Failed to duplicate property'
      toast.error(message)
    },
  })
}

export const useUpdateManagement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isManaged }: { id: string; isManaged: boolean }) =>
      propertiesApi.updateManagement(id, isManaged),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      toast.success('Property management status updated')
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            'Failed to update management status'
          : 'Failed to update management status'
      toast.error(message)
    },
  })
}
