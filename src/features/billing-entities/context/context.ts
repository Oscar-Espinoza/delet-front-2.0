import { createContext } from 'react'
import { BillingEntitiesContextType } from './types'

export const BillingEntitiesContext = createContext<
  BillingEntitiesContextType | undefined
>(undefined)
