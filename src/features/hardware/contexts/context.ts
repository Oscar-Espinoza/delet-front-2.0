import { createContext } from 'react'
import { HardwareContextValue } from './types'

export const HardwareContext = createContext<HardwareContextValue | undefined>(undefined)