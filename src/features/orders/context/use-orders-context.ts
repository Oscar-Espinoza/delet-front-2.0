import { useContext } from 'react'
import { OrdersContext } from './orders-context'

export function useOrdersContext() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrdersContext must be used within an OrdersProvider')
  }
  return context
}
