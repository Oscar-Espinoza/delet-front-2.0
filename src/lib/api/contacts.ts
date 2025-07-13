import { apiClient } from '@/lib/api-client'

export interface ContactsParams {
  page?: number
  pageLimit?: number
  sort?: 'asc' | 'desc'
  tabValue?: 'leads' | 'incomplete'
  propertyIds?: string
  companiesIds?: string
  startTimeStartTimestamp?: string
  startTimeEndTimestamp?: string
  createdAtStartTimestamp?: string
  createdAtEndTimestamp?: string
  search?: string
}

export interface ContactsResponse {
  total: number
  pages: number
  rowPerPage: number
  data: ContactData[]
}

export interface ContactData {
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
    status?: string
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

export interface CreateContactData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  tags?: string[]
  propertyIds?: string[]
  status?: string
  idImage?: File
  document?: File
  documentBack?: File
  face?: File
}

export interface UpdateContactData extends Partial<CreateContactData> {
  _id: string
}

// Convert date strings to timestamps with proper time boundaries
const dateToTimestamp = (date: string | Date, endOfDay = false): string => {
  const d = new Date(date)
  if (endOfDay) {
    d.setHours(23, 59, 59, 999)
  } else {
    d.setHours(0, 0, 0, 0)
  }
  return d.getTime().toString()
}

// API functions
export const contactsApi = {
  // Get contacts (regular user endpoint)
  getContacts: async (params: ContactsParams): Promise<ContactsResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageLimit) queryParams.append('pageLimit', params.pageLimit.toString())
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.tabValue) queryParams.append('tabValue', params.tabValue)
    if (params.propertyIds) queryParams.append('propertyIds', params.propertyIds)
    if (params.companiesIds) queryParams.append('companiesIds', params.companiesIds)
    if (params.search) queryParams.append('search', params.search)
    
    // Handle date parameters
    if (params.startTimeStartTimestamp) {
      queryParams.append('startTimeStartTimestamp', params.startTimeStartTimestamp)
    }
    if (params.startTimeEndTimestamp) {
      queryParams.append('startTimeEndTimestamp', params.startTimeEndTimestamp)
    }
    if (params.createdAtStartTimestamp) {
      queryParams.append('createdAtStartTimestamp', params.createdAtStartTimestamp)
    }
    if (params.createdAtEndTimestamp) {
      queryParams.append('createdAtEndTimestamp', params.createdAtEndTimestamp)
    }
    
    return apiClient.get(`/api/contact?${queryParams.toString()}`)
  },

  // Get contacts (admin endpoint)
  getContactsAdmin: async (params: ContactsParams): Promise<ContactsResponse> => {
    const queryParams = new URLSearchParams()
    
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.pageLimit) queryParams.append('pageLimit', params.pageLimit.toString())
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.tabValue) queryParams.append('tabValue', params.tabValue)
    if (params.propertyIds) queryParams.append('propertyIds', params.propertyIds)
    if (params.companiesIds) queryParams.append('companiesIds', params.companiesIds)
    if (params.search) queryParams.append('search', params.search)
    
    // Handle date parameters
    if (params.startTimeStartTimestamp) {
      queryParams.append('startTimeStartTimestamp', params.startTimeStartTimestamp)
    }
    if (params.startTimeEndTimestamp) {
      queryParams.append('startTimeEndTimestamp', params.startTimeEndTimestamp)
    }
    if (params.createdAtStartTimestamp) {
      queryParams.append('createdAtStartTimestamp', params.createdAtStartTimestamp)
    }
    if (params.createdAtEndTimestamp) {
      queryParams.append('createdAtEndTimestamp', params.createdAtEndTimestamp)
    }
    
    return apiClient.get(`/api/contact/admin/list?${queryParams.toString()}`)
  },

  // Get single contact
  getContact: async (id: string): Promise<ContactData> => {
    return apiClient.get(`/api/contact/${id}`)
  },

  // Create contact
  createContact: async (data: CreateContactData): Promise<ContactData> => {
    const formData = new FormData()
    
    // Add text fields
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    if (data.email) formData.append('email', data.email)
    if (data.phone) formData.append('phone', data.phone)
    if (data.address) formData.append('address', data.address)
    if (data.notes) formData.append('notes', data.notes)
    if (data.status) formData.append('status', data.status)
    
    // Add arrays
    if (data.tags?.length) {
      data.tags.forEach(tag => formData.append('tags[]', tag))
    }
    if (data.propertyIds?.length) {
      data.propertyIds.forEach(id => formData.append('properties[]', id))
    }
    
    // Add files
    if (data.idImage) formData.append('idImage', data.idImage)
    if (data.document) formData.append('document', data.document)
    if (data.documentBack) formData.append('documentBack', data.documentBack)
    if (data.face) formData.append('face', data.face)
    
    return apiClient.postFormData('/api/contact/create', formData)
  },

  // Update contact
  updateContact: async ({ _id, ...data }: UpdateContactData): Promise<ContactData> => {
    const formData = new FormData()
    
    // Add text fields
    if (data.firstName) formData.append('firstName', data.firstName)
    if (data.lastName) formData.append('lastName', data.lastName)
    if (data.email !== undefined) formData.append('email', data.email || '')
    if (data.phone !== undefined) formData.append('phone', data.phone || '')
    if (data.address !== undefined) formData.append('address', data.address || '')
    if (data.notes !== undefined) formData.append('notes', data.notes || '')
    if (data.status !== undefined) formData.append('status', data.status || '')
    
    // Add arrays
    if (data.tags) {
      data.tags.forEach(tag => formData.append('tags[]', tag))
    }
    if (data.propertyIds) {
      data.propertyIds.forEach(id => formData.append('properties[]', id))
    }
    
    // Add files
    if (data.idImage) formData.append('idImage', data.idImage)
    if (data.document) formData.append('document', data.document)
    if (data.documentBack) formData.append('documentBack', data.documentBack)
    if (data.face) formData.append('face', data.face)
    
    return apiClient.patchFormData(`/api/contact/update/${_id}`, formData)
  },

  // Update contact status
  updateContactStatus: async (id: string, status: string): Promise<ContactData> => {
    return apiClient.patch(`/api/contact/${id}/status`, { status })
  },

  // Delete contact
  deleteContact: async (id: string): Promise<void> => {
    return apiClient.delete(`/api/contact/bookings/${id}`)
  },

  // Export to CSV
  exportContactsToCsv: async (params: ContactsParams, isAdmin = false): Promise<Blob> => {
    const queryParams = new URLSearchParams()
    
    if (params.propertyIds) queryParams.append('propertyIds', params.propertyIds)
    if (params.companiesIds) queryParams.append('companiesIds', params.companiesIds)
    if (params.search) queryParams.append('search', params.search)
    if (params.tabValue) queryParams.append('tabValue', params.tabValue)
    
    const endpoint = isAdmin ? '/api/contact/admin/toCsv' : '/api/contact/toCsv'
    
    const response = await apiClient.get(endpoint + '?' + queryParams.toString(), {
      responseType: 'blob'
    })
    
    return response as Blob
  },

  // Get contact count
  getContactCount: async (): Promise<{ count: number }> => {
    return apiClient.get('/api/contact/all-count')
  }
}

// Helper function to convert dates for API params
export const prepareContactsParams = (params: ContactsParams & {
  startTimeStartDate?: Date | string
  startTimeEndDate?: Date | string
  createdAtStartDate?: Date | string
  createdAtEndDate?: Date | string
}): ContactsParams => {
  const apiParams: ContactsParams = { ...params }
  
  // Convert dates to timestamps
  if (params.startTimeStartDate) {
    apiParams.startTimeStartTimestamp = dateToTimestamp(params.startTimeStartDate)
  }
  if (params.startTimeEndDate) {
    apiParams.startTimeEndTimestamp = dateToTimestamp(params.startTimeEndDate, true)
  }
  if (params.createdAtStartDate) {
    apiParams.createdAtStartTimestamp = dateToTimestamp(params.createdAtStartDate)
  }
  if (params.createdAtEndDate) {
    apiParams.createdAtEndTimestamp = dateToTimestamp(params.createdAtEndDate, true)
  }
  
  // Remove the date fields
  delete (apiParams as any).startTimeStartDate
  delete (apiParams as any).startTimeEndDate
  delete (apiParams as any).createdAtStartDate
  delete (apiParams as any).createdAtEndDate
  
  return apiParams
}