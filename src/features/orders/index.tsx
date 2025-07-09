import { useState } from 'react'
import { useOrders } from './hooks/use-orders'
import { OrdersTable } from './components/orders-table'
import { columns } from './components/orders-columns'
import { PlaceOrderDialog } from './components/place-order-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import type { GetOrdersParams } from './types'

export default function Orders() {
  const [placeOrderOpen, setPlaceOrderOpen] = useState(false)
  const [params, setParams] = useState<GetOrdersParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const { data, isLoading, error } = useOrders(params)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
            <p className='text-muted-foreground'>
              Manage and track all customer orders
            </p>
          </div>
          <Skeleton className='h-10 w-32' />
        </div>
        <div className='space-y-4'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <h3 className='text-lg font-semibold'>Error loading orders</h3>
          <p className='text-muted-foreground'>
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Orders</h1>
            <p className='text-muted-foreground'>
              Manage and track all customer orders
            </p>
          </div>
        </div>

        <OrdersTable
          columns={columns}
          data={data?.data || []}
          pageCount={data?.meta.pagination.totalPages}
          pagination={{
            pageIndex: (data?.meta.pagination.page || 1) - 1,
            pageSize: data?.meta.pagination.pageSize || 10,
          }}
          onPaginationChange={({ pageIndex, pageSize }) => {
            setParams((prev) => ({
              ...prev,
              page: pageIndex + 1,
              pageSize,
            }))
          }}
          onPlaceOrder={() => setPlaceOrderOpen(true)}
        />
      </div>

      <PlaceOrderDialog
        open={placeOrderOpen}
        onOpenChange={setPlaceOrderOpen}
      />
    </>
  )
}