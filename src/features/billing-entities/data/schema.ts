import { z } from 'zod'

// Address validation schema
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
})

// Entity type validation
const entityTypeSchema = z.enum(['individual', 'business'], {
  errorMap: () => ({
    message: 'Entity type must be either individual or business',
  }),
})

// Base billing entity schema
export const billingEntitySchema = z.object({
  entityName: z.string().min(1, 'Entity name is required').trim(),
  entityType: entityTypeSchema,
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  billingAddress: addressSchema,
  taxId: z.string().optional(),
  notes: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
})

// Create billing entity schema (no ID fields)
export const createBillingEntitySchema = billingEntitySchema

// Update billing entity schema (all fields optional except ID)
export const updateBillingEntitySchema = billingEntitySchema.partial().extend({
  _id: z.string().min(1, 'ID is required'),
})

// Form schema for create/edit dialogs
export const billingEntityFormSchema = billingEntitySchema

// Type exports
export type BillingEntityFormData = z.infer<typeof billingEntityFormSchema>
export type CreateBillingEntityData = z.infer<typeof createBillingEntitySchema>
export type UpdateBillingEntityData = z.infer<typeof updateBillingEntitySchema>
export type AddressData = z.infer<typeof addressSchema>
