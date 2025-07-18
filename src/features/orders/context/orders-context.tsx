import { createContext } from 'react'
import type { Order } from '../data/schema'

export interface OrdersContextType {
  placeOrderOpen: boolean
  setPlaceOrderOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  viewingOrder: Order | null
  setViewingOrder: (order: Order | null) => void
}

export const OrdersContext = createContext<OrdersContextType | null>(null)
