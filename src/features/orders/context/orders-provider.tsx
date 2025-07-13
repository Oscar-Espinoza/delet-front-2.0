import { useState } from 'react'
import type { ReactNode } from 'react'
import { OrdersContext } from './orders-context'

interface OrdersProviderProps {
  children: ReactNode
}

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [placeOrderOpen, setPlaceOrderOpen] = useState(false)

  return (
    <OrdersContext.Provider
      value={{
        placeOrderOpen,
        setPlaceOrderOpen,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}