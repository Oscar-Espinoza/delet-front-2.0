import { useContext } from 'react'
import { HardwareContext } from './context'

export function useHardwareContext() {
  const context = useContext(HardwareContext)
  if (!context) {
    throw new Error('useHardwareContext must be used within HardwareProvider')
  }
  return context
}