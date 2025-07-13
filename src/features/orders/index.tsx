import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useOrders } from './hooks/use-orders'
import { OrdersTable } from './components/orders-table'
import { columns } from './components/orders-columns'
import { OrdersPrimaryButtons } from './components/orders-primary-buttons'
import { OrdersDialogs } from './components/orders-dialogs'
import { OrdersProvider } from './context/orders-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertCircle } from '@tabler/icons-react'
import type { GetOrdersParams } from './types'

export default function Orders() {
  const [params, setParams] = useState<GetOrdersParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const { data, isLoading, error } = useOrders(params)

  return (
    <OrdersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
            <p className='text-muted-foreground'>
              Manage and track all customer orders
            </p>
          </div>
          <OrdersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div className='space-y-3'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-64 w-full' />
            </div>
          ) : error ? (
            <Alert variant='destructive'>
              <IconAlertCircle className='h-4 w-4' />
              <AlertDescription>
                Failed to load orders. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
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
            />
          )}
        </div>
      </Main>

      <OrdersDialogs />
    </OrdersProvider>
  )
}