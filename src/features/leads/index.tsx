import { useState, useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLeads } from './api'
import { columns } from './components/leads-columns'
import { LeadsDialogs } from './components/leads-dialogs'
import { LeadsPrimaryButtons } from './components/leads-primary-buttons'
import { LeadsTable } from './components/leads-table'
import { LeadsProvider } from './context/leads-provider'
import { LeadFilters, LeadSort } from './types'

export default function LeadsPage() {
  // Get auth state to determine if admin
  const isAdmin = true // TODO: Get from auth context

  // Get company from URL search params
  const urlSearch = useSearch({ strict: false }) as { company?: string }

  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Search state
  const [search, setSearch] = useState('')

  // Filters state
  const [filters, setFilters] = useState<LeadFilters>({
    tabValue: 'leads',
    search: '',
    companiesIds: urlSearch.company ? [urlSearch.company] : undefined,
  })

  // Sort state
  const [sort, _setSort] = useState<LeadSort>({
    field: 'createdAt',
    order: 'desc',
  })

  // Store last known page count to avoid showing "Page X of 1" during loading
  const [lastPageCount, setLastPageCount] = useState(1)

  // Fetch leads data
  const { data, isLoading } = useLeads({
    page,
    limit,
    filters,
    sort,
    isAdmin,
  })

  // Update last known page count when data loads
  useEffect(() => {
    if (data?.pages) {
      setLastPageCount(data.pages)
    }
  }, [data?.pages])

  // Update filters when URL company changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      companiesIds: urlSearch.company ? [urlSearch.company] : undefined,
    }))
    setPage(1) // Reset to first page when company changes
  }, [urlSearch.company])

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number
    pageSize: number
  }) => {
    setPage(pagination.pageIndex + 1)
    setLimit(pagination.pageSize)
  }

  // Handle search submit (on Enter key)
  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, search }))
    setPage(1) // Reset to first page when searching
  }

  // Handle search clear
  const handleSearchClear = () => {
    setSearch('')
    setFilters((prev) => ({ ...prev, search: '' }))
    setPage(1)
  }

  return (
    <LeadsProvider>
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
            pageCount={data?.pages || lastPageCount}
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
