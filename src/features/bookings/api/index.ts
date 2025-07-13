import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import type {
  Booking,
  BookingFilters,
  BookingFormData,
} from '../types'

// API endpoints
const BOOKINGS_ENDPOINT = '/api/booking'

// API functions
export const getBookings = async (
  filters: BookingFilters
): Promise<Booking[]> => {
  const params = new URLSearchParams()

  // Always include all parameters, even if empty
  params.append('companies', filters.companies || '')
  params.append('properties', filters.properties || '')
  params.append('agents', filters.agents || '')
  params.append('firstName', filters.firstName || '')
  params.append('lastName', filters.lastName || '')
  
  // These are required and should always have values
  if (filters.startTime)
    params.append('startTime', filters.startTime.toString())
  if (filters.endTime) 
    params.append('endTime', filters.endTime.toString())
    
  // Optional parameters
  if (filters.status) params.append('status', filters.status)
  if (filters.outcome) params.append('outcome', filters.outcome)

  return await apiClient.get(
    `${BOOKINGS_ENDPOINT}/admin/calendar?${params.toString()}`
  )
}

export const getBooking = async (id: string): Promise<Booking> => {
  return await apiClient.get(`${BOOKINGS_ENDPOINT}/${id}`)
}

export const createBooking = async (
  data: BookingFormData
): Promise<Booking> => {
  return await apiClient.post(BOOKINGS_ENDPOINT, {
    ...data,
    startTime: Math.floor(data.startTime.getTime() / 1000), // Convert to Unix timestamp
  })
}

export const updateBooking = async (
  id: string,
  data: Partial<BookingFormData>
): Promise<Booking> => {
  const payload = { ...data }
  if (data.startTime) {
    payload.startTime = Math.floor(data.startTime.getTime() / 1000) as unknown as Date
  }
  return await apiClient.patch(`${BOOKINGS_ENDPOINT}/${id}`, payload)
}

export const deleteBooking = async (id: string): Promise<void> => {
  await apiClient.delete(`${BOOKINGS_ENDPOINT}/${id}`)
}

// React Query hooks
export const useBookings = (filters: BookingFilters) => {
  return useQuery({
    queryKey: queryKeys.bookings.list(filters),
    queryFn: () => getBookings(filters),
  })
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => getBooking(id),
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
    },
  })
}

export const useUpdateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<BookingFormData>
    }) => updateBooking(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) })
    },
  })
}

export const useDeleteBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() })
      queryClient.removeQueries({ queryKey: queryKeys.bookings.detail(deletedId) })
    },
  })
}
