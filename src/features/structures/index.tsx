import { useSearch } from '@tanstack/react-router'
import { IconAlertCircle } from '@tabler/icons-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useStructures } from './api'
import { StructuresDialogs } from './components/structures-dialogs'
import { StructuresPrimaryButtons } from './components/structures-primary-buttons'
import { StructuresTable } from './components/structures-table'
import { StructuresProvider } from './context/structures-context'

export default function StructuresPage() {
  const search = useSearch({ strict: false }) as { company?: string }
  const { data: structures = [], isLoading, error } = useStructures()

  // Filter structures by company on the client side since backend doesn't support it yet
  const filteredStructures = search.company
    ? structures.filter(
        (structure) => structure.user?.company?._id === search.company
      )
    : structures

  return (
    <StructuresProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <HeaderCompanyDropdown />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Structures</h2>
            <p className='text-muted-foreground'>
              Manage buildings, floors, rooms, complexes, and areas
            </p>
          </div>
          <StructuresPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {error ? (
            <Alert variant='destructive'>
              <IconAlertCircle className='h-4 w-4' />
              <AlertDescription>
                Failed to load structures. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <StructuresTable data={filteredStructures} isLoading={isLoading} />
          )}
        </div>
      </Main>

      <StructuresDialogs />
    </StructuresProvider>
  )
}
