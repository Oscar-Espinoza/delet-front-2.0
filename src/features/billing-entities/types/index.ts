import type { Address } from '@/types/common'

export interface BillingEntity {
  _id: string
  entityName: string
  entityType: 'individual' | 'business'
  email: string
  phone: string
  billingAddress: Address
  taxId?: string
  qbCustomerId?: string
  company: string
  user: string
  isActive: boolean
  metadata?: Record<string, unknown>
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateBillingEntityRequest {
  entityName: string
  entityType: 'individual' | 'business'
  email: string
  phone: string
  billingAddress: Address
  taxId?: string
  notes?: string
  company: string
}

export interface UpdateBillingEntityRequest {
  entityName?: string
  entityType?: 'individual' | 'business'
  email?: string
  phone?: string
  billingAddress?: Address
  taxId?: string
  notes?: string
}

export interface BillingEntityListResponse {
  billingEntities: BillingEntity[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetBillingEntitiesParams {
  page?: number
  limit?: number
  search?: string
  entityType?: 'individual' | 'business'
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
