// Zod schema for form validation
import { z } from 'zod'

export interface Contact {
  _id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export interface Property {
  _id: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  unitNumber?: string
}

export interface Company {
  _id: string
  name: string
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  company?: Company
}

export type BookingStatus =
  | 'active'
  | 'archived'
  | 'attended'
  | 'cancelled'
  | 'incomplete'
  | 'missed'
  | 'pending'
  | 'rescheduled'
  | 'scheduled'
  | 'show'

export type BookingOutcome =
  | ''
  | 'interested'
  | 'not interested'
  | 'send application'
  | 'follow up sent'
  | 'applied'

export interface Booking {
  _id: string
  status: BookingStatus
  outcome?: BookingOutcome
  passCode?: string
  startTime: number // Unix timestamp in seconds
  property: Property
  contact: Contact
  user: User
  notes?: string
  parentBooking?: string
  createdAt: string
  updatedAt: string
  isVerified?: boolean
}

// Booking filters for API requests
export interface BookingFilters {
  startTime?: number
  endTime?: number
  companies?: string
  properties?: string
  agents?: string
  firstName?: string
  lastName?: string
  status?: BookingStatus
  outcome?: BookingOutcome
}

export interface BookingFormData {
  propertyId: string
  contactId: string
  startTime: Date
  status: BookingStatus
  notes?: string
}

export const bookingFormSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  contactId: z.string().min(1, 'Contact is required'),
  startTime: z.date({
    required_error: 'Start time is required',
  }),
  status: z.enum([
    'active',
    'archived',
    'attended',
    'cancelled',
    'incomplete',
    'missed',
    'pending',
    'rescheduled',
    'scheduled',
    'show',
  ] as const),
  notes: z.string().optional(),
})

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  extendedProps: {
    booking: Booking
    contactName: string
  }
  className?: string
}
