import type { CalendarView, BookingFilters, Booking } from '../types'

export interface BookingsContextValue {
  view: 'table' | 'calendar'
  setView: (view: 'table' | 'calendar') => void
  calendarView: CalendarView
  setCalendarView: (view: CalendarView) => void
  filters: BookingFilters
  setFilters: (filters: BookingFilters) => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  selectedBooking: Booking | null
  setSelectedBooking: (booking: Booking | null) => void
  showCreateModal: boolean
  setShowCreateModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  showDetailsModal: boolean
  setShowDetailsModal: (show: boolean) => void
}
