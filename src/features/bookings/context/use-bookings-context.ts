import { useContext } from 'react'
import { BookingsContext } from './context'

export function useBookingsContext() {
  const context = useContext(BookingsContext)
  if (!context) {
    throw new Error('useBookingsContext must be used within BookingsProvider')
  }
  return context
}
