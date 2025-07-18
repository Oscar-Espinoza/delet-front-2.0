import { createContext } from 'react'
import { BookingsContextValue } from './types'

export const BookingsContext = createContext<BookingsContextValue | undefined>(
  undefined
)
