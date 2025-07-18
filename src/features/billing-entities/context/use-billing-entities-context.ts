import { useContext } from 'react'
import { BillingEntitiesContext } from './context'

export function useBillingEntitiesContext() {
  const context = useContext(BillingEntitiesContext)
  if (!context) {
    throw new Error(
      'useBillingEntitiesContext must be used within BillingEntitiesProvider'
    )
  }
  return context
}
