import { Main } from '@/components/layout/main'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { useKits } from './api'
import { KitsTable } from './components/kits-table'
import { CreateKitModal } from './components/create-kit-modal'
import { EditKitModal } from './components/edit-kit-modal'
import { ViewKitDialog } from './components/view-kit-dialog'
import { DeleteKitDialog } from './components/kits-dialogs'
import { KitsPrimaryButtons } from './components/kits-primary-buttons'
import { KitsProvider } from './context/kits-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertCircle } from '@tabler/icons-react'
import { useSearch } from '@tanstack/react-router'

export default function KitsPage() {
  const search = useSearch({ strict: false }) as { company?: string }
  const { data: kits = [], isLoading, error } = useKits(
    search.company ? { company: search.company } : undefined
  )
  return (
    <KitsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Kits</h2>
            <p className='text-muted-foreground'>
              Manage and organize your hardware kits.
            </p>
          </div>
          <KitsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {error ? (
            <Alert variant='destructive'>
              <IconAlertCircle className='h-4 w-4' />
              <AlertDescription>
                Failed to load kits. {error instanceof Error ? error.message : 'Please try again later.'}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <KitsTable data={kits} isLoading={isLoading} />
              <CreateKitModal />
              <EditKitModal />
              <ViewKitDialog />
              <DeleteKitDialog />
            </>
          )}
        </div>
      </Main>
    </KitsProvider>
  )
}