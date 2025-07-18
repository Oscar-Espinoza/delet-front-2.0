import { useOrdersContext } from '../context/use-orders-context'
import { PlaceOrderDialog } from './place-order-dialog'
import { ViewOrderDialog } from './view-order-dialog'

export function OrdersDialogs() {
  const { placeOrderOpen, setPlaceOrderOpen } = useOrdersContext()

  return (
    <>
      <PlaceOrderDialog
        open={placeOrderOpen}
        onOpenChange={setPlaceOrderOpen}
      />
      <ViewOrderDialog />
    </>
  )
}
