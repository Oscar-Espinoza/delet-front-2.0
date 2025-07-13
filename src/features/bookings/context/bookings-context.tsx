import { createContext, useContext, useState, type ReactNode } from 'react'
import { type CalendarView, type BookingFilters, type Booking } from '../types'

interface BookingsContextValue {
  // View state
  view: 'table' | 'calendar'
  setView: (view: 'table' | 'calendar') => void
  calendarView: CalendarView
  setCalendarView: (view: CalendarView) => void
  
  // Filter state
  filters: BookingFilters
  setFilters: (filters: BookingFilters) => void
  
  // Selected date for calendar
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  
  // Selected booking for details
  selectedBooking: Booking | null
  setSelectedBooking: (booking: Booking | null) => void
  
  // Modal states
  showCreateModal: boolean
  setShowCreateModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  showDetailsModal: boolean
  setShowDetailsModal: (show: boolean) => void
}

export const BookingsContext = createContext<BookingsContextValue | undefined>(undefined)

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'table' | 'calendar'>('calendar')
  const [calendarView, setCalendarView] = useState<CalendarView>('dayGridMonth')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  
  // Initialize filters with current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  
  const [filters, setFilters] = useState<BookingFilters>({
    startTime: Math.floor(startOfMonth.getTime() / 1000),
    endTime: Math.floor(endOfMonth.getTime() / 1000),
  })
  
  return (
    <BookingsContext.Provider
      value={{
        view,
        setView,
        calendarView,
        setCalendarView,
        filters,
        setFilters,
        selectedDate,
        setSelectedDate,
        selectedBooking,
        setSelectedBooking,
        showCreateModal,
        setShowCreateModal,
        showEditModal,
        setShowEditModal,
        showDetailsModal,
        setShowDetailsModal,
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

