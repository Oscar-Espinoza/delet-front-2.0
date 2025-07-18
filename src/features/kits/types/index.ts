import { z } from 'zod'

// Kit State enum matching backend
export enum KitState {
  CHECKING_STOCK = 'checking stock',
  AWAITING_STOCK = 'awaiting stock',
  ASSEMBLING_KIT = 'assembling kit',
  READY_TO_SHIP = 'ready to ship',
  SHIPPED = 'shipped',
  AWAITING_CONFIRMATION = 'awaiting confirmation',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

// Shipping Address interface
export interface ShippingAddress {
  name?: string
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

// User interface for kit relationships
export interface KitUser {
  _id: string
  firstName?: string
  lastName?: string
  email: string
  company?: {
    _id: string
    name: string
  }
}

// Company interface
export interface KitCompany {
  _id: string
  name: string
}

// Property interface
export interface KitProperty {
  _id: string
  shortAddress: string
  unit?: string
  city?: string
  state?: string
  zipCode?: string
}

// Billing Entity interface
export interface KitBillingEntity {
  _id: string
  entityName: string
}

// Hardware interface
export interface KitHardware {
  _id: string
  name: string
  category?: string
  notes?: string
}

// Main Kit interface
export interface Kit {
  _id: string
  name: string
  description?: string
  notes?: string
  tags?: string[]
  state: KitState
  shippingAddress?: ShippingAddress
  billingEntity?: KitBillingEntity
  assignedDate?: number
  user?: KitUser
  company?: KitCompany
  property?: KitProperty
  hardware?: KitHardware[]
  order?: {
    _id: string
    orderNumber?: string
  }
  shipment?: {
    _id: string
    trackingUrl?: string
  }
  device_id?: string
  createdAt?: string
  updatedAt?: string
}

// Kit filters interface
export interface KitFilters {
  name?: string
  state?: KitState
  company?: string
  user?: string
}

// Form schemas
export const shippingAddressSchema = z.object({
  name: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

export const kitFormSchema = z.object({
  name: z.string().min(1, 'Kit name is required'),
  description: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  state: z.nativeEnum(KitState).optional(),
  shippingAddress: shippingAddressSchema.optional(),
  company: z.string().optional().nullable(),
  user: z.string().optional().nullable(),
  property: z.string().optional().nullable(),
  hardware: z.array(z.string()).optional(),
})

export type KitFormData = z.infer<typeof kitFormSchema>

export type CreateKitData = KitFormData

export interface UpdateKitData extends Partial<KitFormData> {
  _id: string
}

// Helper functions
export const getKitStateColor = (state: KitState): string => {
  const colors: Record<KitState, string> = {
    [KitState.CHECKING_STOCK]:
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    [KitState.AWAITING_STOCK]:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    [KitState.ASSEMBLING_KIT]:
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    [KitState.READY_TO_SHIP]:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    [KitState.SHIPPED]:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    [KitState.AWAITING_CONFIRMATION]:
      'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    [KitState.CONFIRMED]:
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    [KitState.CANCELLED]:
      'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    [KitState.RETURNED]:
      'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  }
  return (
    colors[state] ||
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  )
}

export const formatShippingAddress = (address?: ShippingAddress): string => {
  if (!address) return '-'
  const parts = [
    address.name,
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : '-'
}
