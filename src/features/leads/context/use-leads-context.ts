import React from 'react'
import { LeadsContext } from './leads-context'

export const useLeadsContext = () => {
  const context = React.useContext(LeadsContext)
  if (!context) {
    throw new Error('useLeadsContext must be used within LeadsProvider')
  }
  return context
}