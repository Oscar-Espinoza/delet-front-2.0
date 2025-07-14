import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { HardwareProvider } from './contexts/hardware-context'
import { HardwareTable } from './components/hardware-table'
import { HardwareDialogs } from './components/hardware-dialogs'
import { useHardwareList } from './hooks/use-hardware'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertCircle } from '@tabler/icons-react'

function HardwarePage() {
  const { data: hardware = [], isLoading, error } = useHardwareList()

  return (
    <HardwareProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <HeaderCompanyDropdown />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Hardware Management</h2>
            <p className="text-muted-foreground">
              Manage and monitor all hardware devices
            </p>
          </div>
        </div>
        
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {error ? (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load hardware. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <HardwareTable data={hardware} isLoading={isLoading} />
          )}
        </div>
      </Main>

      <HardwareDialogs />
    </HardwareProvider>
  )
}

export default HardwarePage