import { createContext } from 'react'
import { KitsContextType } from './types'

export const KitsContext = createContext<KitsContextType | undefined>(undefined)
