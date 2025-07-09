import { apiClient } from '@/lib/api-client'
import type { Order, OrderPlacedFormValues } from '../data/schema'
import type { GetOrdersParams, GetOrdersResponse, OrderPlaced } from '../types'

export const ordersApi = {
  getOrders: async (params: GetOrdersParams = {}): Promise<GetOrdersResponse> => {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      company,
      user,
      type,
      status,
      createdAtFrom,
      createdAtTo,
      isAdmin,
    } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      sortBy,
      sortOrder,
    })

    if (search) queryParams.append('search', search)
    if (company) queryParams.append('company', company)
    if (user) queryParams.append('user', user)
    if (type) queryParams.append('type', type)
    if (status) queryParams.append('status', status)
    if (createdAtFrom) queryParams.append('createdAtFrom', createdAtFrom)
    if (createdAtTo) queryParams.append('createdAtTo', createdAtTo)

    const endpoint = isAdmin ? '/api/order/admin/query' : '/api/order/query'
    return apiClient.get<GetOrdersResponse>(`${endpoint}?${queryParams.toString()}`)
  },

  getOrder: async (id: string, isAdmin = false): Promise<Order> => {
    const endpoint = isAdmin ? `/api/order/admin/${id}` : `/api/order/${id}`
    return apiClient.get<Order>(endpoint)
  },

  placeOrder: async (orderData: OrderPlacedFormValues, isAdmin = false): Promise<Order> => {
    const endpoint = isAdmin ? '/api/order/admin/place' : '/api/order/place'
    const payload: OrderPlaced = {
      quantity: orderData.quantity,
      addresses: orderData.addresses,
      provideShippingLater: orderData.provideShippingLater,
      notes: orderData.notes || '',
    }
    return apiClient.post<Order>(endpoint, payload)
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    isAdmin = false
  ): Promise<Order> => {
    const endpoint = isAdmin ? `/api/order/admin/${id}/status` : `/api/order/${id}/status`
    return apiClient.patch<Order>(endpoint, { status })
  },

  updateOrder: async (
    id: string,
    data: Partial<Order>,
    isAdmin = false
  ): Promise<Order> => {
    const endpoint = isAdmin ? `/api/order/admin/${id}` : `/api/order/${id}`
    return apiClient.patch<Order>(endpoint, data)
  },

  cancelOrder: async (id: string, isAdmin = false): Promise<Order> => {
    const endpoint = isAdmin ? `/api/order/admin/${id}/cancel` : `/api/order/${id}/cancel`
    return apiClient.post<Order>(endpoint)
  },

  deleteOrder: async (id: string, isAdmin = false): Promise<void> => {
    const endpoint = isAdmin ? `/api/order/admin/${id}` : `/api/order/${id}`
    return apiClient.delete<void>(endpoint)
  },

  exportOrders: async (params: GetOrdersParams = {}, format = 'csv'): Promise<Blob> => {
    const queryParams = new URLSearchParams(params as any)
    queryParams.append('format', format)
    
    const response = await apiClient.get<Blob>(
      `/api/order/export?${queryParams.toString()}`,
      { responseType: 'blob' }
    )
    return response
  },
}