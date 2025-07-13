import { createContext } from 'react'
import { CompaniesContextType } from './types'

export const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined)