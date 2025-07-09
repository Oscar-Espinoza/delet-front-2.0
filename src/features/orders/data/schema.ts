import { z } from 'zod'
import type { OrderStatus, OrderType } from '../types'

const orderTypeSchema = z.enum(['purchase', 'service'])

const orderStatusSchema = z.enum([
  'waiting for payment information',
  'assembling kits',
  'complete',
  'paid',
  'cancelled',
  '',
])

const discountSchema = z.union([
  z.string(),
  z.object({
    _id: z.string(),
    code: z.string(),
    percentage: z.number(),
  }),
  z.null(),
])

const companySchema = z.union([
  z.string(),
  z.object({
    _id: z.string(),
    name: z.string(),
  }),
])

const userSchema = z.union([
  z.string(),
  z.object({
    _id: z.string(),
    email: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }),
])

export const orderSchema = z.object({
  _id: z.string(),
  user: userSchema,
  type: orderTypeSchema,
  discount: discountSchema.optional(),
  status: orderStatusSchema,
  notes: z.string().optional(),
  address: z.string().optional(),
  quantity: z.number(),
  createdAt: z.number(),
  company: companySchema,
})

export type Order = z.infer<typeof orderSchema>

export const orderListSchema = z.array(orderSchema)

export const orderPlacedSchema = z.object({
  quantity: z.number().min(1),
  addresses: z.array(
    z.object({
      address: z.string().min(1, 'Address is required'),
      quantity: z.number().min(1),
    })
  ),
  provideShippingLater: z.boolean(),
  notes: z.string().optional(),
})

export type OrderPlacedFormValues = z.infer<typeof orderPlacedSchema>

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const statusLabels: Record<OrderStatus, string> = {
    'waiting for payment information': 'Waiting for Payment',
    'assembling kits': 'Assembling Kits',
    'complete': 'Complete',
    'paid': 'Paid',
    'cancelled': 'Cancelled',
    '': 'Unknown',
  }
  return statusLabels[status] || status
}

export const getOrderTypeLabel = (type: OrderType): string => {
  const typeLabels: Record<OrderType, string> = {
    'purchase': 'Purchase',
    'service': 'Service',
  }
  return typeLabels[type] || type
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    'waiting for payment information': 'text-yellow-600 bg-yellow-50',
    'assembling kits': 'text-blue-600 bg-blue-50',
    'complete': 'text-green-600 bg-green-50',
    'paid': 'text-green-600 bg-green-50',
    'cancelled': 'text-red-600 bg-red-50',
    '': 'text-gray-600 bg-gray-50',
  }
  return statusColors[status] || 'text-gray-600 bg-gray-50'
}