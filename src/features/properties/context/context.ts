import { createContext } from 'react'
import { PropertiesContextType } from './types'

export const PropertiesContext = createContext<
  PropertiesContextType | undefined
>(undefined)
