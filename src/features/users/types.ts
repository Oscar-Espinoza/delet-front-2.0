export type UserRole = 
  | 'agent'
  | 'admin'
  | 'org'
  | 'superadmin'
  | 'owner'
  | 'leasingAgent'
  | 'manager'

export type AdminPanelRole = 
  | 'superadmin'
  | 'leasingAgent'
  | 'admin'
  | null
  | ''

export interface Company {
  _id: string
  name: string
  // Add other company fields as needed
}

export interface Subscription {
  _id: string
  // Add subscription fields as needed
}

export interface User {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
  adminPanelRole?: AdminPanelRole
  active: boolean
  pending: boolean
  phone?: string
  jobTitle?: string
  profileImage?: string
  description?: string
  company: Company | string // Can be populated or just ID
  subscriptions?: Subscription[]
  org?: User | string // Reference to another user
  adminId?: User | string // Reference to another user
  createdAt: string
  updatedAt: string
}

export interface GetUsersListParams {
  role?: string
  company?: string
  active?: string
}

export interface GetUsersListResponse {
  data: User[]
  // Add pagination info if API returns it
}