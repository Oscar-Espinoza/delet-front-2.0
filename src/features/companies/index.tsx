import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/companies-columns'
import { CompaniesDialogs } from './components/companies-dialogs'
import { CompaniesPrimaryButtons } from './components/companies-primary-buttons'
import { CompaniesTable } from './components/companies-table'
import CompaniesProvider from './context/companies-context'
import { useCompanies } from './api'

export default function Companies() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  // Fetch companies data with pagination
  const { data, isLoading, error } = useCompanies({
    page,
    limit,
    isAdmin: true, // Set to true for admin view
  })

  const companies = data?.companies || []
  const totalCount = data?.totalCount || 0

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold'>Error loading companies</h2>
          <p className='text-muted-foreground'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <CompaniesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Companies</h2>
            <p className='text-muted-foreground'>
              Manage your companies and their information here.
            </p>
          </div>
          <CompaniesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <CompaniesTable 
            data={companies} 
            columns={columns} 
            isLoading={isLoading}
          />
        </div>
      </Main>

      <CompaniesDialogs />
    </CompaniesProvider>
  )
}