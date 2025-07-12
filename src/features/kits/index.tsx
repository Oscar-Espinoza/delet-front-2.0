import { Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useKits } from './api'
import { KitsTable } from './components/kits-table'
import { CreateKitModal } from './components/create-kit-modal'
import { EditKitModal } from './components/edit-kit-modal'
import { ViewKitDialog } from './components/view-kit-dialog'
import { DeleteKitDialog } from './components/kits-dialogs'
import { KitsPrimaryButtons } from './components/kits-primary-buttons'
import { KitsProvider } from './context/kits-context'

function KitsContent() {
  const { data: kits = [], isLoading, error } = useKits()

  if (error) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='text-center'>
          <p className='text-destructive'>Failed to load kits</p>
          <p className='text-sm text-muted-foreground mt-2'>
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  return (
    <>
      <KitsTable data={kits} />
      <CreateKitModal />
      <EditKitModal />
      <ViewKitDialog />
      <DeleteKitDialog />
    </>
  )
}

export default function KitsPage() {
  return (
    <KitsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Kits</h2>
            <p className='text-muted-foreground'>
              Manage and organize your hardware kits.
            </p>
          </div>
          <KitsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <KitsContent />
        </div>
      </Main>
    </KitsProvider>
  )
}