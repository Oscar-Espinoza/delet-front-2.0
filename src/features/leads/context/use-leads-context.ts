import { useContext } from 'react'
import { LeadsContext } from './context'

export function useLeadsContext() {
  const context = useContext(LeadsContext)
  if (!context) {
    throw new Error('useLeadsContext must be used within a LeadsProvider')
  }
  return context
}
