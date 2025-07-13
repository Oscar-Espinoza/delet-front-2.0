import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import { useOrdersContext } from '../context/use-orders-context'

export function OrdersPrimaryButtons() {
  const { setPlaceOrderOpen } = useOrdersContext()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setPlaceOrderOpen(true)}>
        <IconPlus className='mr-2 h-4 w-4' />
        Place Order
      </Button>
    </div>
  )
}