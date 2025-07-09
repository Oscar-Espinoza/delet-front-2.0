import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/')({
  component: () => <OrdersRoute />,
})

import Orders from '@/features/orders'

function OrdersRoute() {
  return <Orders />
}