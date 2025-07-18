import { useState } from 'react'
import type { ReactNode } from 'react'
import { OrdersContext } from './orders-context'
import type { Order } from '../data/schema'

interface OrdersProviderProps {
  children: ReactNode
}

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [placeOrderOpen, setPlaceOrderOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)

  return (
    <OrdersContext.Provider
      value={{
        placeOrderOpen,
        setPlaceOrderOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
        viewingOrder,
        setViewingOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}
