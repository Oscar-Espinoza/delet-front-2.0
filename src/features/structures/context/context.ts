import { createContext } from 'react'
import { StructuresContextType } from './types'

export const StructuresContext = createContext<StructuresContextType | undefined>(undefined)