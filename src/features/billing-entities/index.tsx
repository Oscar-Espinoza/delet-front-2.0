import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/billing-entities-columns'
import { BillingEntitiesDialogs } from './components/billing-entities-dialogs'
import { BillingEntitiesPrimaryButtons } from './components/billing-entities-primary-buttons'
import { BillingEntitiesTable } from './components/billing-entities-table'
import { BillingEntitiesProvider } from './context/billing-entities-context'
import {
  useBillingEntities,
  useBillingEntitiesByCompany,
} from './hooks/use-billing-entities'

export default function BillingEntities() {
  const search = useSearch({ strict: false }) as { company?: string }
  const [page, _setPage] = useState(1)
  const [limit] = useState(10)

  // Fetch billing entities data - use company-specific hook if company is selected
  const {
    data: companyEntities,
    isLoading: isLoadingCompany,
    error: errorCompany,
  } = useBillingEntitiesByCompany(search.company)
  const {
    data: allEntities,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useBillingEntities({
    page,
    limit,
  })

  // Use company-specific data if company is selected, otherwise use paginated data
  const billingEntities = search.company
    ? companyEntities || []
    : allEntities?.billingEntities || []
  const isLoading = search.company ? isLoadingCompany : isLoadingAll
  const error = search.company ? errorCompany : errorAll

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-lg font-semibold'>
            Error loading billing entities
          </h2>
          <p className='text-muted-foreground'>Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <BillingEntitiesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>
              Billing Entities
            </h2>
            <p className='text-muted-foreground'>
              Manage billing entities and payment information here.
            </p>
          </div>
          <BillingEntitiesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <BillingEntitiesTable
            data={billingEntities}
            columns={columns}
            isLoading={isLoading}
          />
        </div>
      </Main>

      <BillingEntitiesDialogs />
    </BillingEntitiesProvider>
  )
}
