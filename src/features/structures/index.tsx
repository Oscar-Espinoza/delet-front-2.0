import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StructuresProvider } from './context/structures-context'
import { StructuresTable } from './components/structures-table'
import { StructuresDialogs } from './components/structures-dialogs'
import { StructuresPrimaryButtons } from './components/structures-primary-buttons'
import { useStructures } from './api'
import { Loader2 } from 'lucide-react'

function StructuresContent() {
  const { data: structures, isLoading, error } = useStructures()

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <p className='text-sm text-muted-foreground'>
          Failed to load structures. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <>
      <StructuresTable data={structures || []} />
      <StructuresDialogs />
    </>
  )
}

export default function StructuresPage() {
  return (
    <StructuresProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
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
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <StructuresContent />
        </div>
      </Main>

      <StructuresDialogs />
    </StructuresProvider>
  )
}