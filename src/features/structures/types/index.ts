import { z } from 'zod'

export enum StructureType {
  BUILDING = 'BUILDING',
  FLOOR = 'FLOOR',
  ROOM = 'ROOM',
  COMPLEX = 'COMPLEX',
  AREA = 'AREA',
}

export interface Address {
  street?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface User {
  _id: string
  email: string
  company?: {
    _id: string
    name: string
  }
}

export interface Company {
  _id: string
  name: string
}

export interface Property {
  _id: string
  shortAddress: string
  unit?: string
  city?: string
  state?: string
  zipCode?: string
  address?: string
}

export interface Hardware {
  _id: string
  name: string
}

export interface Structure {
  _id: string
  name?: string
  type: StructureType
  address?: Address
  parentStructure?: {
    _id: string
    name?: string
  }
  company?: Company
  user?: User
  properties?: Property[]
  hardware?: Hardware[]
  createdAt?: string
  updatedAt?: string
}

export interface StructuresResponse {
  structures: Structure[]
  totalCount: number
}

export interface StructureFilters {
  name?: string
  type?: StructureType
  city?: string
  state?: string
  userId?: string
}

export interface StructureSort {
  field: keyof Structure
  order: 'asc' | 'desc'
}

export const structureFormSchema = z.object({
  name: z.string().optional(),
  type: z.nativeEnum(StructureType),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  company: z.string().optional().nullable(),
  parentStructure: z.string().optional().nullable(),
  properties: z.array(z.string()).optional(),
  hardware: z.array(z.string()).optional(),
})

export type StructureFormData = z.infer<typeof structureFormSchema>

export type CreateStructureData = StructureFormData

export interface UpdateStructureData extends Partial<StructureFormData> {
  _id: string
  removedProperties?: string[]
  removedHardware?: string[]
}

export const formatAddress = (address?: Address): string => {
  if (!address) return '-'
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : '-'
}

export const getStructureTypeColor = (type: StructureType): string => {
  const colors: Record<StructureType, string> = {
    [StructureType.BUILDING]:
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    [StructureType.FLOOR]:
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    [StructureType.ROOM]:
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    [StructureType.COMPLEX]:
      'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    [StructureType.AREA]:
      'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  }
  return (
    colors[type] ||
    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  )
}
