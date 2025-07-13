import { createFileRoute } from '@tanstack/react-router'
import Orders from '@/features/orders'

export const Route = createFileRoute('/_authenticated/orders/')({
  component: OrdersRoute,
  staticData: {
    title: 'Orders',
    breadcrumb: 'Orders',
    description: 'Manage customer orders and transactions'
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 2 // 2 minutes - orders change frequently
})

function OrdersRoute() {
  return <Orders />
}