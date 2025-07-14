import { z } from 'zod'

// Property status enum
export const PROPERTY_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  ARCHIVED: 'archived',
  INACTIVE: 'inactive'
} as const

export type PropertyStatus = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS]

// Property type enum
export const PROPERTY_TYPE = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  CONDO: 'condo',
  TOWNHOUSE: 'townhouse',
  OTHER: 'other'
} as const

export type PropertyType = typeof PROPERTY_TYPE[keyof typeof PROPERTY_TYPE]

// Main Property interface (matches API response)
export interface Property {
  _id: string
  address?: string
  shortAddress?: string
  street?: string
  unit?: string
  city?: string
  state?: string
  zipCode?: string
  propertyType?: string
  category?: string
  status: PropertyStatus
  price?: number
  isManaged: boolean
  redirectUrl?: string
  primaryImage?: string
  images?: string[]
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    org?: string
    company?: {
      _id?: string
      name: string
    }
  }
  leadsCount?: number
  redirectCount?: number
  listedDate?: string
  createdAt: string
  updatedAt?: string
  kit?: {
    _id?: string
    device_id?: string
    name?: string
  } | null
}

// Response interface for paginated properties
export interface PropertiesResponse {
  totalPages: number
  element_per_page: number
  properties: Property[]
}

// Filter interface
export interface PropertyFilters {
  search?: string
  status?: string[]
  type?: string[]
  companiesIds?: string[]
  classification?: string[]
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Sort interface
export interface PropertySort {
  field: 'createdAt' | 'price' | 'leads' | 'listedDate' | 'status'
  order: 'asc' | 'desc'
}

// Form schemas with Zod
export const createPropertySchema = z.object({
  shortAddress: z.string().optional(),
  street: z.string().min(1, 'Street is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
  type: z.enum([
    PROPERTY_TYPE.HOUSE,
    PROPERTY_TYPE.APARTMENT,
    PROPERTY_TYPE.CONDO,
    PROPERTY_TYPE.TOWNHOUSE,
    PROPERTY_TYPE.OTHER
  ]),
  status: z.enum([
    PROPERTY_STATUS.ACTIVE,
    PROPERTY_STATUS.PENDING,
    PROPERTY_STATUS.ARCHIVED,
    PROPERTY_STATUS.INACTIVE
  ]).default(PROPERTY_STATUS.PENDING),
  price: z.number().optional(),
  isManaged: z.boolean().default(false),
  redirectUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  company: z.string().optional(),
  kit: z.string().optional(),
  primaryImage: z.instanceof(File).optional(),
  images: z.array(z.instanceof(File)).optional()
})

export const updatePropertySchema = createPropertySchema.partial().extend({
  _id: z.string()
})

// Type inference from schemas
export type CreatePropertyFormData = z.infer<typeof createPropertySchema>
export type UpdatePropertyFormData = z.infer<typeof updatePropertySchema>

// Helper type for table row selection
export interface PropertyWithSelection extends Property {
  isSelected?: boolean
}

// Address formatter helper
export const formatAddress = (property: {
  shortAddress?: string
  street?: string
  unit?: string
  city?: string
  state?: string
  zipCode?: string
}): string => {
  // If shortAddress exists, use it
  if (property.shortAddress) {
    return property.shortAddress
  }

  // Otherwise, build from components
  const parts: string[] = []
  
  if (property.street) {
    parts.push(property.street)
  }
  
  if (property.unit) {
    parts.push(`Unit ${property.unit}`)
  }
  
  const cityStateZip: string[] = []
  if (property.city) cityStateZip.push(property.city)
  if (property.state) cityStateZip.push(property.state)
  if (property.zipCode) cityStateZip.push(property.zipCode)
  
  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(', '))
  }
  
  return parts.join(', ')
}

// Status helpers
export const getStatusColor = (status: PropertyStatus): string => {
  switch (status) {
    case PROPERTY_STATUS.ACTIVE:
      return 'text-green-600 bg-green-50'
    case PROPERTY_STATUS.PENDING:
      return 'text-yellow-600 bg-yellow-50'
    case PROPERTY_STATUS.ARCHIVED:
      return 'text-gray-600 bg-gray-50'
    case PROPERTY_STATUS.INACTIVE:
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-400 bg-gray-50'
  }
}

export const getStatusLabel = (status: PropertyStatus): string => {
  switch (status) {
    case PROPERTY_STATUS.ACTIVE:
      return 'Active'
    case PROPERTY_STATUS.PENDING:
      return 'Pending'
    case PROPERTY_STATUS.ARCHIVED:
      return 'Archived'
    case PROPERTY_STATUS.INACTIVE:
      return 'Inactive'
    default:
      return 'Unknown'
  }
}

// Type helpers
export const getTypeLabel = (type: PropertyType): string => {
  switch (type) {
    case PROPERTY_TYPE.HOUSE:
      return 'House'
    case PROPERTY_TYPE.APARTMENT:
      return 'Apartment'
    case PROPERTY_TYPE.CONDO:
      return 'Condo'
    case PROPERTY_TYPE.TOWNHOUSE:
      return 'Townhouse'
    case PROPERTY_TYPE.OTHER:
      return 'Other'
    default:
      return 'Unknown'
  }
}