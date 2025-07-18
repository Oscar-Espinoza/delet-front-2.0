import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/query-keys'
import { ordersApi } from '../api/orders-api'
import type { OrderPlacedFormValues, Order } from '../data/schema'
import type { GetOrdersParams } from '../types'

export const useOrders = (params: GetOrdersParams = {}) => {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.getOrders(params),
  })
}

export const useOrder = (id: string, isAdmin = false) => {
  return useQuery({
    queryKey: [...queryKeys.orders.detail(id), { isAdmin }],
    queryFn: () => ordersApi.getOrder(id, isAdmin),
    enabled: !!id,
  })
}

export const usePlaceOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      isAdmin,
    }: {
      data: OrderPlacedFormValues
      isAdmin?: boolean
    }) => ordersApi.placeOrder(data, isAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      toast.success('Order placed successfully')
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to place order')
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      isAdmin,
    }: {
      id: string
      status: string
      isAdmin?: boolean
    }) => ordersApi.updateOrderStatus(id, status, isAdmin),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      })
      toast.success('Order status updated')
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(
        err.response?.data?.message || 'Failed to update order status'
      )
    },
  })
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
      isAdmin,
    }: {
      id: string
      data: Partial<Order>
      isAdmin?: boolean
    }) => ordersApi.updateOrder(id, data, isAdmin),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      })
      toast.success('Order updated successfully')
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to update order')
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isAdmin }: { id: string; isAdmin?: boolean }) =>
      ordersApi.cancelOrder(id, isAdmin),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.detail(variables.id),
      })
      toast.success('Order cancelled')
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    },
  })
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isAdmin }: { id: string; isAdmin?: boolean }) =>
      ordersApi.deleteOrder(id, isAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      toast.success('Order deleted')
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to delete order')
    },
  })
}

export const useExportOrders = () => {
  return useMutation({
    mutationFn: ({
      params,
      format,
    }: {
      params: GetOrdersParams
      format?: string
    }) => ordersApi.exportOrders(params, format),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Orders exported successfully')
    },
    onError: (error) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to export orders')
    },
  })
}
