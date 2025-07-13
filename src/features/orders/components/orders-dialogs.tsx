import { PlaceOrderDialog } from './place-order-dialog'
import { useOrdersContext } from '../context/use-orders-context'

export function OrdersDialogs() {
  const { placeOrderOpen, setPlaceOrderOpen } = useOrdersContext()

  return (
    <>
      <PlaceOrderDialog
        open={placeOrderOpen}
        onOpenChange={setPlaceOrderOpen}
      />
    </>
  )
}