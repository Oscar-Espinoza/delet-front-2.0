import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LeadsProvider } from './context/leads-provider'
import { LeadsTable } from './components/leads-table'
import { LeadsPrimaryButtons } from './components/leads-primary-buttons'
import { LeadsDialogs } from './components/leads-dialogs'
import { columns } from './components/leads-columns'
import { useLeads } from './api'
import { LeadFilters, LeadSort } from './types'

export default function LeadsPage() {
  // Get auth state to determine if admin
  const isAdmin = true // TODO: Get from auth context
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  
  // Search state
  const [search, setSearch] = useState('')

  // Filters state
  const [filters, setFilters] = useState<LeadFilters>({
    tabValue: 'leads',
    search: '',
  })
  
  // Sort state
  const [sort, _setSort] = useState<LeadSort>({
    field: 'createdAt',
    order: 'desc',
  })

  // Fetch leads data
  const { data, isLoading } = useLeads({
    page,
    limit,
    filters,
    sort,
    isAdmin,
  })

  // Handle pagination change
  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    setPage(pagination.pageIndex + 1)
    setLimit(pagination.pageSize)
  }
  
  // Handle search submit (on Enter key)
  const handleSearchSubmit = () => {
    setFilters(prev => ({ ...prev, search }))
    setPage(1) // Reset to first page when searching
  }
  
  // Handle search clear
  const handleSearchClear = () => {
    setSearch('')
    setFilters(prev => ({ ...prev, search: '' }))
    setPage(1)
  }

  return (
    <LeadsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Leads</h2>
            <p className='text-muted-foreground'>
              Manage your leads and track their status
            </p>
          </div>
          <LeadsPrimaryButtons filters={filters} isAdmin={isAdmin} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <LeadsTable
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
            pageCount={data?.pages}
            pagination={{
              pageIndex: page - 1,
              pageSize: limit,
            }}
            onPaginationChange={handlePaginationChange}
            searchValue={search}
            onSearchChange={setSearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchClear={handleSearchClear}
          />
        </div>
      </Main>
      
      <LeadsDialogs />
    </LeadsProvider>
  )
}