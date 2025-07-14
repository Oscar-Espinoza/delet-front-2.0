import { useState, useEffect, type ReactNode } from 'react'
import { useSearch } from '@tanstack/react-router'
import { type CalendarView, type BookingFilters, type Booking } from '../types'
import { BookingsContext } from './context'

export function BookingsProvider({ children }: { children: ReactNode }) {
  // Get company from URL search params
  const urlSearch = useSearch({ strict: false }) as { company?: string }
  
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
    companies: urlSearch.company || undefined,
  })
  
  // Update filters when URL company changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      companies: urlSearch.company || undefined,
    }))
  }, [urlSearch.company])
  
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