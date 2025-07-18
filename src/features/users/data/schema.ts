import { z } from 'zod'

const userRoleSchema = z.union([
  z.literal('agent'),
  z.literal('admin'),
  z.literal('org'),
  z.literal('superadmin'),
  z.literal('owner'),
  z.literal('leasingAgent'),
  z.literal('manager'),
])

const adminPanelRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('leasingAgent'),
  z.literal('admin'),
  z.literal(''),
  z.null(),
])

const companySchema = z.union([
  z.string(),
  z.object({
    _id: z.string(),
    name: z.string(),
  }),
])

const userSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: userRoleSchema,
  adminPanelRole: adminPanelRoleSchema.optional(),
  active: z.boolean(),
  pending: z.boolean(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  profileImage: z.string().optional(),
  description: z.string().optional(),
  company: companySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type User = z.infer<typeof userSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type UserStatus = 'active' | 'inactive' | 'pending'

export const userListSchema = z.array(userSchema)

// Helper function to determine user status from active/pending fields
export const getUserStatus = (user: User): UserStatus => {
  if (!user.active) return 'inactive'
  if (user.pending) return 'pending'
  return 'active'
}
