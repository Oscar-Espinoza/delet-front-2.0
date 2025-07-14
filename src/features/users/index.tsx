import { useSearch } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { useUsersList } from './hooks/use-users'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertCircle } from '@tabler/icons-react'

export default function Users() {
  const search = useSearch({ strict: false }) as { company?: string }
  const { data: users = [], isLoading, error } = useUsersList({ 
    company: search.company 
  })

  return (
    <UsersProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {error ? (
            <Alert variant='destructive'>
              <IconAlertCircle className='h-4 w-4' />
              <AlertDescription>
                Failed to load users. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <UsersTable data={users} columns={columns} isLoading={isLoading} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
