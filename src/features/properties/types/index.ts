import { z } from 'zod'

// Property status enum
export const PROPERTY_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  ARCHIVED: 'archived',
  INACTIVE: 'inactive',
} as const

export type PropertyStatus =
  (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS]

// Property type enum
export const PROPERTY_TYPE = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  CONDO: 'condo',
  TOWNHOUSE: 'townhouse',
  OTHER: 'other',
} as const

export type PropertyType = (typeof PROPERTY_TYPE)[keyof typeof PROPERTY_TYPE]

// Property category enum
export const PROPERTY_CATEGORY = {
  RENT: 'rent',
  SALE: 'sale',
} as const

export type PropertyCategory =
  (typeof PROPERTY_CATEGORY)[keyof typeof PROPERTY_CATEGORY]

// Property classification enum
export const PROPERTY_CLASSIFICATION = {
  CONDOMINIUM: 'condominium',
  SINGLE_FAMILY: 'singleFamily',
  MULTI_FAMILY: 'multiFamily',
  VACATION_RENTAL: 'vacationRental',
  OTHER: 'other',
} as const

export type PropertyClassification =
  (typeof PROPERTY_CLASSIFICATION)[keyof typeof PROPERTY_CLASSIFICATION]

// Parking type enum
export const PARKING_TYPE = {
  STREET_STANDARD: 'streetStandard',
  STREET_PERMIT: 'streetPermit',
  GARAGE: 'garage',
  CARPORT: 'carport',
  DRIVEWAY: 'driveway',
  LOT: 'lot',
  NONE: 'none',
} as const

export type ParkingType = (typeof PARKING_TYPE)[keyof typeof PARKING_TYPE]

// Utility responsibility enum
export const UTILITY_RESPONSIBILITY = {
  TENANT: 'tenant',
  LANDLORD: 'landlord',
  SHARED: 'shared',
} as const

export type UtilityResponsibility =
  (typeof UTILITY_RESPONSIBILITY)[keyof typeof UTILITY_RESPONSIBILITY]

// ID verification profile enum
export const ID_VERIFICATION_PROFILE = {
  NONE: 'none',
  BASIC: 'basic',
  ENHANCED: 'enhanced',
} as const

export type IdVerificationProfile =
  (typeof ID_VERIFICATION_PROFILE)[keyof typeof ID_VERIFICATION_PROFILE]

// Nested interfaces
export interface GoogleMapCoordinates {
  latitude: number | null
  longitude: number | null
}

export interface AmenitiesAndFeatures {
  floorPlanHighlights: string[]
  kitchenFeatures: string[]
  buildingFeatures: string[]
}

export interface Utilities {
  water: UtilityResponsibility
  electricity: UtilityResponsibility
  gas: UtilityResponsibility
  trash: UtilityResponsibility
  sewage: UtilityResponsibility
  notes: string
}

export interface Parking {
  type: ParkingType
  spacesNumber: string
  monthlyCostPerSpace: string
  included: boolean
  notes: string
  tandem: string[]
}

export interface PetPolicy {
  allowed: boolean
  weight: string
  maxAllowed: string
}

export interface Pets {
  allowed: boolean
  dogs: PetPolicy
  cats: PetPolicy
  deposit: string
  monthlyPetRent: string
  notes: string
}

export interface RentalApplication {
  url: string
  fee: string
  instructions: string
  enable: boolean
}

export interface ContactPerson {
  firstName: string
  lastName: string
  phone: string
  email: string
  contactInformation: boolean
  onSite?: boolean
}

export interface PropertyAccessCodes {
  buildingCode: string
  elevatorCode: string
  instructions: string
  enable: boolean
}

export interface IdVerification {
  active: boolean
  frontbackID: boolean
  requireFace: boolean
  profile: IdVerificationProfile
}

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
  category?: PropertyCategory
  classification?: PropertyClassification
  status: PropertyStatus
  price?: number
  deposit?: number
  isManaged: boolean
  redirectUrl?: string
  primaryImage?: string
  images?: string[]
  instructionsFiles?: string[]
  
  // Property details
  sqft?: number
  bedrooms?: number
  bathrooms?: number
  yearBuilt?: number
  lot?: number
  description?: string
  dateAvailableTs?: Date | null
  leaseTermOptions?: string
  
  // Location
  googleMap?: GoogleMapCoordinates
  
  // Features
  amenitiesAndFeatures?: AmenitiesAndFeatures
  utilities?: Utilities
  parking?: Parking
  pets?: Pets
  
  // Contacts
  leasingAgent?: ContactPerson
  propertyManager?: ContactPerson
  maintenanceManager?: ContactPerson
  
  // Access & Security
  propertyAccessCodes?: PropertyAccessCodes
  idVerification?: IdVerification
  doorUnlockLink?: boolean
  rentalApplicationForm?: RentalApplication
  
  // User/Company info
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    org?: string
    company?: {
      _id?: string
      name: string
    }
  }
  userId?: string
  userEmail?: string
  userPhone?: string
  organizationId?: string
  qrCodeId?: string
  
  // Metrics
  leadsCount?: number
  redirectCount?: number
  listedDate?: string
  createdAt: string
  updatedAt?: string
  
  // Hardware
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

// Zod schemas for nested structures
const googleMapSchema = z.object({
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
})

const amenitiesAndFeaturesSchema = z.object({
  floorPlanHighlights: z.array(z.string()).default([]),
  kitchenFeatures: z.array(z.string()).default([]),
  buildingFeatures: z.array(z.string()).default([]),
})

const utilitiesSchema = z.object({
  water: z.enum(['tenant', 'landlord', 'shared']).default('tenant'),
  electricity: z.enum(['tenant', 'landlord', 'shared']).default('tenant'),
  gas: z.enum(['tenant', 'landlord', 'shared']).default('tenant'),
  trash: z.enum(['tenant', 'landlord', 'shared']).default('tenant'),
  sewage: z.enum(['tenant', 'landlord', 'shared']).default('tenant'),
  notes: z.string().default(''),
})

const parkingSchema = z.object({
  type: z.enum([
    'streetStandard',
    'streetPermit',
    'garage',
    'carport',
    'driveway',
    'lot',
    'none',
  ]).default('streetStandard'),
  spacesNumber: z.string().default(''),
  monthlyCostPerSpace: z.string().default(''),
  included: z.boolean().default(false),
  notes: z.string().default(''),
  tandem: z.array(z.string()).default([]),
})

const petPolicySchema = z.object({
  allowed: z.boolean().default(false),
  weight: z.string().default(''),
  maxAllowed: z.string().default(''),
})

const petsSchema = z.object({
  allowed: z.boolean().default(false),
  dogs: petPolicySchema,
  cats: petPolicySchema,
  deposit: z.string().default(''),
  monthlyPetRent: z.string().default(''),
  notes: z.string().default(''),
})

const contactPersonSchema = z.object({
  firstName: z.string().default(''),
  lastName: z.string().default(''),
  phone: z.string().default(''),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  contactInformation: z.boolean().default(false),
  onSite: z.boolean().optional(),
})

const propertyAccessCodesSchema = z.object({
  buildingCode: z.string().default(''),
  elevatorCode: z.string().default(''),
  instructions: z.string().default(''),
  enable: z.boolean().default(false),
})

const idVerificationSchema = z.object({
  active: z.boolean().default(false),
  frontbackID: z.boolean().default(true),
  requireFace: z.boolean().default(false),
  profile: z.enum(['none', 'basic', 'enhanced']).default('none'),
})

const rentalApplicationSchema = z.object({
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  fee: z.string().default(''),
  instructions: z.string().default(''),
  enable: z.boolean().default(false),
})

// Form schemas with Zod
export const createPropertySchema = z.object({
  // Basic info
  shortAddress: z.string().optional(),
  type: z.enum([
    PROPERTY_TYPE.HOUSE,
    PROPERTY_TYPE.APARTMENT,
    PROPERTY_TYPE.CONDO,
    PROPERTY_TYPE.TOWNHOUSE,
    PROPERTY_TYPE.OTHER,
  ]),
  classification: z.enum([
    PROPERTY_CLASSIFICATION.CONDOMINIUM,
    PROPERTY_CLASSIFICATION.SINGLE_FAMILY,
    PROPERTY_CLASSIFICATION.MULTI_FAMILY,
    PROPERTY_CLASSIFICATION.VACATION_RENTAL,
    PROPERTY_CLASSIFICATION.OTHER,
  ]).optional(),
  category: z.enum([
    PROPERTY_CATEGORY.RENT,
    PROPERTY_CATEGORY.SALE,
  ]).default(PROPERTY_CATEGORY.RENT),
  status: z
    .enum([
      PROPERTY_STATUS.ACTIVE,
      PROPERTY_STATUS.PENDING,
      PROPERTY_STATUS.ARCHIVED,
      PROPERTY_STATUS.INACTIVE,
    ])
    .default(PROPERTY_STATUS.PENDING),
  price: z.number().optional(),
  deposit: z.number().optional(),
  dateAvailableTs: z.date().nullable().optional(),
  leaseTermOptions: z.string().optional(),
  
  // Details
  sqft: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  yearBuilt: z.number().optional(),
  lot: z.number().optional(),
  description: z.string().optional(),
  
  // Location
  street: z.string().min(1, 'Street is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Valid zip code is required'),
  googleMap: googleMapSchema.optional(),
  
  // Features
  amenitiesAndFeatures: amenitiesAndFeaturesSchema.optional(),
  utilities: utilitiesSchema.optional(),
  parking: parkingSchema.optional(),
  pets: petsSchema.optional(),
  
  // Images & Files
  primaryImage: z.instanceof(File).optional(),
  images: z.array(z.instanceof(File)).optional(),
  instructionsFiles: z.array(z.instanceof(File)).optional(),
  
  // Management
  company: z.string().optional(),
  kit: z.string().optional(),
  leasingAgent: contactPersonSchema.optional(),
  propertyManager: contactPersonSchema.optional(),
  maintenanceManager: contactPersonSchema.optional(),
  
  // Access & Security
  propertyAccessCodes: propertyAccessCodesSchema.optional(),
  idVerification: idVerificationSchema.optional(),
  doorUnlockLink: z.boolean().default(false),
  redirectUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  rentalApplicationForm: rentalApplicationSchema.optional(),
  
  // Other
  isManaged: z.boolean().default(false),
  userEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  userPhone: z.string().optional(),
})

export const updatePropertySchema = createPropertySchema.partial().extend({
  _id: z.string(),
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

// Category helpers
export const getCategoryLabel = (category: PropertyCategory): string => {
  switch (category) {
    case PROPERTY_CATEGORY.RENT:
      return 'For Rent'
    case PROPERTY_CATEGORY.SALE:
      return 'For Sale'
    default:
      return 'Unknown'
  }
}

// Classification helpers
export const getClassificationLabel = (
  classification: PropertyClassification
): string => {
  switch (classification) {
    case PROPERTY_CLASSIFICATION.CONDOMINIUM:
      return 'Condominium'
    case PROPERTY_CLASSIFICATION.SINGLE_FAMILY:
      return 'Single Family'
    case PROPERTY_CLASSIFICATION.MULTI_FAMILY:
      return 'Multi Family'
    case PROPERTY_CLASSIFICATION.VACATION_RENTAL:
      return 'Vacation Rental'
    case PROPERTY_CLASSIFICATION.OTHER:
      return 'Other'
    default:
      return 'Unknown'
  }
}

// Parking type helpers
export const getParkingTypeLabel = (type: ParkingType): string => {
  switch (type) {
    case PARKING_TYPE.STREET_STANDARD:
      return 'Street Parking (Standard)'
    case PARKING_TYPE.STREET_PERMIT:
      return 'Street Parking (Permit Required)'
    case PARKING_TYPE.GARAGE:
      return 'Garage'
    case PARKING_TYPE.CARPORT:
      return 'Carport'
    case PARKING_TYPE.DRIVEWAY:
      return 'Driveway'
    case PARKING_TYPE.LOT:
      return 'Parking Lot'
    case PARKING_TYPE.NONE:
      return 'No Parking'
    default:
      return 'Unknown'
  }
}

// Utility responsibility helpers
export const getUtilityResponsibilityLabel = (
  responsibility: UtilityResponsibility
): string => {
  switch (responsibility) {
    case UTILITY_RESPONSIBILITY.TENANT:
      return 'Tenant'
    case UTILITY_RESPONSIBILITY.LANDLORD:
      return 'Landlord'
    case UTILITY_RESPONSIBILITY.SHARED:
      return 'Shared'
    default:
      return 'Unknown'
  }
}
