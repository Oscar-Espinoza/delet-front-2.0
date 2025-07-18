import type { Address } from '@/types/common'
import type { Order } from './data/schema'

export interface OrderAddress {
  address: Address
  quantity: number
  assignedKits?: number
}

export interface OrderPlaced {
  quantity: number
  addresses: OrderAddress[]
  provideShippingLater: boolean
  notes: string
  billingEntityId?: string
}

export interface KitAllocationState {
  totalKits: number
  availableKits: number
  assignedKits: number
}

export interface KitAllocationError {
  addressIndex?: number
  message: string
  type: 'over_allocation' | 'invalid_quantity' | 'missing_allocation'
}

export interface GetOrdersParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  company?: string
  user?: string
  type?: OrderType
  status?: OrderStatus
  createdAtFrom?: string
  createdAtTo?: string
  isAdmin?: boolean
}

export interface GetOrdersResponse {
  data: Order[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      totalCount: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
    sorting: {
      sortBy: string
      sortOrder: 'asc' | 'desc'
    }
    filters: {
      company?: string
      user?: string
      type?: string
      status?: string
      createdAtFrom?: string
      createdAtTo?: string
      search?: string
    }
  }
}

export type OrderType = 'purchase' | 'service'

export type OrderStatus =
  | 'waiting for payment information'
  | 'assembling kits'
  | 'complete'
  | 'paid'
  | 'cancelled'
  | ''
