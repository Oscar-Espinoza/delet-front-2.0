import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  contactsApi, 
  ContactsParams, 
  ContactData,
  CreateContactData,
  UpdateContactData,
  prepareContactsParams
} from '@/lib/api/contacts'
import { Lead, LeadsResponse, LeadFilters, LeadSort } from '../types'

// Convert ContactData to Lead type (they're the same, just aliased for clarity)
type _LeadData = ContactData
type CreateLeadData = CreateContactData
type UpdateLeadData = UpdateContactData

interface GetLeadsParams {
  page: number
  limit: number
  filters?: LeadFilters
  sort?: LeadSort
  isAdmin?: boolean
}

// Helper to convert our filter format to API format
const convertFiltersToApiParams = (
  params: GetLeadsParams
): ContactsParams => {
  const { page, limit, filters, sort } = params
  
  const apiParams: ContactsParams & {
    startTimeStartDate?: Date
    startTimeEndDate?: Date
    createdAtStartDate?: Date
    createdAtEndDate?: Date
  } = {
    page,
    pageLimit: limit,
    sort: sort?.order || 'desc',
    tabValue: filters?.tabValue || 'leads',
  }

  if (filters?.search) {
    apiParams.search = filters.search
  }

  if (filters?.propertyIds?.length) {
    apiParams.propertyIds = filters.propertyIds.join(',')
  }

  if (filters?.companiesIds?.length) {
    apiParams.companiesIds = filters.companiesIds.join(',')
  }

  if (filters?.startTimeRange?.start) {
    apiParams.startTimeStartDate = filters.startTimeRange.start
  }

  if (filters?.startTimeRange?.end) {
    apiParams.startTimeEndDate = filters.startTimeRange.end
  }

  if (filters?.createdAtRange?.start) {
    apiParams.createdAtStartDate = filters.createdAtRange.start
  }

  if (filters?.createdAtRange?.end) {
    apiParams.createdAtEndDate = filters.createdAtRange.end
  }

  // Convert dates to timestamps
  return prepareContactsParams(apiParams)
}

// API wrapper functions
const leadsApi = {
  getLeads: async (params: GetLeadsParams): Promise<LeadsResponse> => {
    const apiParams = convertFiltersToApiParams(params)
    const response = params.isAdmin 
      ? await contactsApi.getContactsAdmin(apiParams)
      : await contactsApi.getContacts(apiParams)
    
    // The response is already in the correct format
    return response as LeadsResponse
  },

  getLead: async (leadId: string): Promise<Lead> => {
    const response = await contactsApi.getContact(leadId)
    return response as Lead
  },

  createLead: async (data: CreateLeadData): Promise<Lead> => {
    const response = await contactsApi.createContact(data)
    return response as Lead
  },

  updateLead: async (data: UpdateLeadData): Promise<Lead> => {
    const response = await contactsApi.updateContact(data)
    return response as Lead
  },

  updateLeadStatus: async ({ id, status }: { id: string; status: string }): Promise<Lead> => {
    const response = await contactsApi.updateContactStatus(id, status)
    return response as Lead
  },

  deleteLead: async (id: string): Promise<void> => {
    return contactsApi.deleteContact(id)
  },

  exportLeads: async (params: GetLeadsParams): Promise<Blob> => {
    const apiParams = convertFiltersToApiParams(params)
    return contactsApi.exportContactsToCsv(apiParams, params.isAdmin)
  }
}

// React Query hooks
export const useLeads = (params: GetLeadsParams) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsApi.getLeads(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useLead = (leadId: string) => {
  return useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => leadsApi.getLead(leadId),
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create lead')
    },
  })
}

export const useUpdateLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsApi.updateLead,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', data._id] })
      toast.success('Lead updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update lead')
    },
  })
}

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsApi.updateLeadStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', data._id] })
      toast.success('Lead status updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update lead status')
    },
  })
}

export const useDeleteLead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      toast.success('Lead deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete lead')
    },
  })
}

export const useExportLeads = () => {
  return useMutation({
    mutationFn: leadsApi.exportLeads,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Leads exported successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export leads')
    },
  })
}

// Custom hook for lead count
export const useLeadCount = () => {
  return useQuery({
    queryKey: ['leadCount'],
    queryFn: () => contactsApi.getContactCount(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export { leadsApi }