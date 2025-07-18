import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/query-keys'
import { extractErrorMessage } from '@/lib/error-utils'
import {
  getBillingEntitiesByCompany,
  getBillingEntities,
  getBillingEntity,
  createBillingEntity,
  updateBillingEntity,
  deleteBillingEntity,
} from '../api'
import type {
  BillingEntity,
  CreateBillingEntityRequest,
  UpdateBillingEntityRequest,
  GetBillingEntitiesParams,
  BillingEntityListResponse,
} from '../types'


/**
 * Hook to fetch billing entities for a specific company
 */
export const useBillingEntitiesByCompany = (companyId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.billingEntities.byCompany(companyId || ''),
    queryFn: () => {
      if (!companyId) throw new Error('Company ID is required')
      return getBillingEntitiesByCompany(companyId)
    },
    enabled: Boolean(companyId),
  })
}

/**
 * Hook to fetch billing entities with pagination
 */
export const useBillingEntities = (params: GetBillingEntitiesParams = {}) => {
  return useQuery({
    queryKey: queryKeys.billingEntities.list(params),
    queryFn: () => getBillingEntities(params),
  })
}

/**
 * Hook to fetch a single billing entity
 */
export const useBillingEntity = (id: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.billingEntities.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Billing entity ID is required')
      return getBillingEntity(id)
    },
    enabled: Boolean(id),
  })
}

/**
 * Hook to create a new billing entity
 */
export const useCreateBillingEntity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBillingEntityRequest) => createBillingEntity(data),
    onSuccess: (newEntity) => {
      // Invalidate company queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: queryKeys.billingEntities.byCompany(newEntity.company),
      })

      // Invalidate all billing entity queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.billingEntities.all,
      })

      toast.success('Billing entity created successfully')
    },
    onError: (error) => {
      // Extract and show the actual error message from API
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage)
    },
  })
}

/**
 * Hook to update a billing entity with optimistic updates
 */
export const useUpdateBillingEntity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      _id,
      ...data
    }: { _id: string } & UpdateBillingEntityRequest) =>
      updateBillingEntity(_id, data),
    onMutate: async ({ _id, ...data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.billingEntities.detail(_id),
      })

      // Snapshot the previous value
      const previousEntity = queryClient.getQueryData<BillingEntity>(
        queryKeys.billingEntities.detail(_id)
      )

      // Optimistically update the cache
      if (previousEntity) {
        queryClient.setQueryData<BillingEntity>(
          queryKeys.billingEntities.detail(_id),
          { ...previousEntity, ...data }
        )
      }

      // Update company list if entity exists in cache
      const companyQueries = queryClient.getQueriesData({
        queryKey: queryKeys.billingEntities.all,
      })

      companyQueries.forEach(([queryKey, cachedData]) => {
        if (cachedData) {
          // Handle both array format and response object format
          if (Array.isArray(cachedData)) {
            // Direct array format (from getBillingEntitiesByCompany)
            const updatedEntities = cachedData.map((entity) =>
              entity._id === _id ? { ...entity, ...data } : entity
            )
            queryClient.setQueryData(queryKey, updatedEntities)
          } else if (
            cachedData &&
            typeof cachedData === 'object' &&
            'billingEntities' in cachedData &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Array.isArray((cachedData as any).billingEntities)
          ) {
            // Response object format (from getBillingEntities)
            const responseData = cachedData as BillingEntityListResponse
            const updatedEntities = responseData.billingEntities.map((entity: BillingEntity) =>
              entity._id === _id ? { ...entity, ...data } : entity
            )
            queryClient.setQueryData(queryKey, {
              ...cachedData,
              billingEntities: updatedEntities,
            })
          }
        }
      })

      return { previousEntity }
    },
    onError: (error, { _id }, context) => {
      // Roll back optimistic update on error
      if (context?.previousEntity) {
        queryClient.setQueryData(
          queryKeys.billingEntities.detail(_id),
          context.previousEntity
        )
      }

      // Extract and show the actual error message from API
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage)
    },
    onSuccess: (data) => {
      // Invalidate queries after successful update
      queryClient.invalidateQueries({
        queryKey: queryKeys.billingEntities.detail(data._id),
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.billingEntities.byCompany(data.company),
      })
      toast.success('Billing entity updated successfully')
    },
  })
}

/**
 * Hook to delete a billing entity
 */
export const useDeleteBillingEntity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBillingEntity(id),
    onError: (error) => {
      // Extract and show the actual error message from API
      const errorMessage = extractErrorMessage(error)
      toast.error(errorMessage)
    },
    onSuccess: () => {
      // Invalidate all billing entity queries after successful deletion
      queryClient.invalidateQueries({
        queryKey: queryKeys.billingEntities.all,
      })
      toast.success('Billing entity deleted successfully')
    },
  })
}
