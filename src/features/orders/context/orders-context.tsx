import { createContext } from 'react'

export interface OrdersContextType {
  placeOrderOpen: boolean
  setPlaceOrderOpen: (open: boolean) => void
}

export const OrdersContext = createContext<OrdersContextType | null>(null)