import { useState, useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { IconAlertCircle } from '@tabler/icons-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/orders-columns'
import { OrdersDialogs } from './components/orders-dialogs'
import { OrdersPrimaryButtons } from './components/orders-primary-buttons'
import { OrdersTable } from './components/orders-table'
import { OrdersProvider } from './context/orders-provider'
import { useOrders } from './hooks/use-orders'
import type { GetOrdersParams } from './types'

export default function Orders() {
  const search = useSearch({ strict: false }) as { company?: string }

  const [params, setParams] = useState<GetOrdersParams>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    company: search.company,
    isAdmin: true,
  })

  // Store last known page count to avoid showing "Page X of 1" during loading
  const [lastPageCount, setLastPageCount] = useState(1)

  const { data, isLoading, error } = useOrders(params)

  // Update last known page count when data loads
  useEffect(() => {
    if (data?.meta?.pagination?.totalPages) {
      setLastPageCount(data.meta.pagination.totalPages)
    }
  }, [data?.meta?.pagination?.totalPages])

  // Update params when company changes in URL
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      company: search.company,
      page: 1, // Reset to first page when company changes
      isAdmin: true,
    }))
  }, [search.company])

  return (
    <OrdersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <HeaderCompanyDropdown />
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
          {error ? (
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
              isLoading={isLoading}
              pageCount={data?.meta?.pagination?.totalPages || lastPageCount}
              pagination={{
                pageIndex: (params.page || 1) - 1,
                pageSize: params.pageSize || 10,
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
