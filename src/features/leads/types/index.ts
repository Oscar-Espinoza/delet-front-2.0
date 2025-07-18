import { z } from 'zod'

// Lead status enum
export const LEAD_STATUS = {
  INTERESTED: 'interested',
  NOT_INTERESTED: 'not interested',
  RESCHEDULED: 'rescheduled',
  APPLICATION_SENT: 'application sent',
  APPLIED: 'applied',
  NEVER_ARRIVED: 'never arrived',
  NONE: '',
} as const

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS]

// Main Lead interface (matches API response)
export interface Lead {
  _id: string
  startTime: number
  status: string
  incomplete: boolean
  isVerified: boolean
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    company?: {
      _id: string
      name: string
    }
  }
  contact: {
    _id: string
    firstName: string
    lastName: string
    phone?: string
    email?: string
    idImage?: string
    document?: string
    documentBack?: string
    face?: string
    tags?: string[]
    notes?: string
    address?: string
    status?: LeadStatus
    verified?: boolean
    subscription?: boolean
  }
  property: {
    _id: string
    address: string
    shortAddress: string
    city: string
    state: string
    primaryImage?: string
    unit?: string
    images?: string[]
    user: string
  }
  createdAt: string
  updatedAt?: string
  lockVendor?: string
}

// Response interface for paginated leads
export interface LeadsResponse {
  total: number
  pages: number
  rowPerPage: number
  data: Lead[]
}

// Filter interface
export interface LeadFilters {
  search?: string
  status?: LeadStatus
  propertyIds?: string[]
  companiesIds?: string[]
  startTimeRange?: {
    start?: Date
    end?: Date
  }
  createdAtRange?: {
    start?: Date
    end?: Date
  }
  tabValue?: 'leads' | 'incomplete'
}

// Sort interface
export interface LeadSort {
  field: 'createdAt' | 'startTime' | 'firstName' | 'lastName' | 'status'
  order: 'asc' | 'desc'
}

// Form schemas with Zod
export const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  propertyIds: z.array(z.string()).optional(),
  status: z
    .enum([
      LEAD_STATUS.INTERESTED,
      LEAD_STATUS.NOT_INTERESTED,
      LEAD_STATUS.RESCHEDULED,
      LEAD_STATUS.APPLICATION_SENT,
      LEAD_STATUS.APPLIED,
      LEAD_STATUS.NEVER_ARRIVED,
      LEAD_STATUS.NONE,
    ])
    .optional(),
  idImage: z.instanceof(File).optional(),
  document: z.instanceof(File).optional(),
  documentBack: z.instanceof(File).optional(),
  face: z.instanceof(File).optional(),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  _id: z.string(),
})

// Type inference from schemas
export type CreateLeadFormData = z.infer<typeof createLeadSchema>
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>

// Helper type for table row selection
export interface LeadWithSelection extends Lead {
  isSelected?: boolean
}

// Type guards
export const isLeadComplete = (lead: Lead): boolean => !lead.incomplete
export const isLeadVerified = (lead: Lead): boolean => lead.isVerified

// Status helpers
export const getStatusColor = (status?: LeadStatus): string => {
  switch (status) {
    case LEAD_STATUS.INTERESTED:
      return 'text-green-600 bg-green-50'
    case LEAD_STATUS.NOT_INTERESTED:
      return 'text-red-600 bg-red-50'
    case LEAD_STATUS.RESCHEDULED:
      return 'text-yellow-600 bg-yellow-50'
    case LEAD_STATUS.APPLICATION_SENT:
      return 'text-blue-600 bg-blue-50'
    case LEAD_STATUS.APPLIED:
      return 'text-purple-600 bg-purple-50'
    case LEAD_STATUS.NEVER_ARRIVED:
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-400 bg-gray-50'
  }
}

export const getStatusLabel = (status?: LeadStatus): string => {
  switch (status) {
    case LEAD_STATUS.INTERESTED:
      return 'Interested'
    case LEAD_STATUS.NOT_INTERESTED:
      return 'Not Interested'
    case LEAD_STATUS.RESCHEDULED:
      return 'Rescheduled'
    case LEAD_STATUS.APPLICATION_SENT:
      return 'Application Sent'
    case LEAD_STATUS.APPLIED:
      return 'Applied'
    case LEAD_STATUS.NEVER_ARRIVED:
      return 'Never Arrived'
    default:
      return 'No Status'
  }
}
