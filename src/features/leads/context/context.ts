import { createContext } from 'react'
import { LeadsContextType } from './types'

export const LeadsContext = createContext<LeadsContextType | undefined>(
  undefined
)
