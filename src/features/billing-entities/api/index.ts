import { apiClient } from '@/lib/api-client'
import type {
  BillingEntity,
  CreateBillingEntityRequest,
  UpdateBillingEntityRequest,
  BillingEntityListResponse,
  GetBillingEntitiesParams,
} from '../types'

/**
 * Get billing entities by company ID
 */
export const getBillingEntitiesByCompany = async (
  companyId: string
): Promise<BillingEntity[]> => {
  const response = await apiClient.get<{ data: BillingEntity[] }>(
    `/api/billing-entities/admin/company/${companyId}`
  )
  return response.data
}

/**
 * Get billing entities with pagination and filtering
 */
export const getBillingEntities = async (
  params: GetBillingEntitiesParams = {}
): Promise<BillingEntityListResponse> => {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.set('page', params.page.toString())
  if (params.limit) queryParams.set('limit', params.limit.toString())
  if (params.search) queryParams.set('search', params.search)
  if (params.entityType) queryParams.set('entityType', params.entityType)
  if (params.isActive !== undefined)
    queryParams.set('isActive', params.isActive.toString())
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)

  const url = `/api/billing-entities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return await apiClient.get<BillingEntityListResponse>(url)
}

/**
 * Get a single billing entity by ID
 */
export const getBillingEntity = async (id: string): Promise<BillingEntity> => {
  return await apiClient.get<BillingEntity>(`/api/billing-entities/${id}`)
}

/**
 * Create a new billing entity
 */
export const createBillingEntity = async (
  data: CreateBillingEntityRequest
): Promise<BillingEntity> => {
  return await apiClient.post<BillingEntity>('/api/billing-entities', data)
}

/**
 * Update an existing billing entity
 */
export const updateBillingEntity = async (
  id: string,
  data: UpdateBillingEntityRequest
): Promise<BillingEntity> => {
  return await apiClient.put<BillingEntity>(`/api/billing-entities/${id}`, data)
}

/**
 * Delete a billing entity
 */
export const deleteBillingEntity = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/billing-entities/${id}`)
}
