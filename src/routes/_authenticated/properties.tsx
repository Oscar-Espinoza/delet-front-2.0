import { createFileRoute } from '@tanstack/react-router'
import { HeaderCompanyDropdown } from '@/components/header-company-dropdown'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import PropertiesFeature from '@/features/properties'

export const Route = createFileRoute('/_authenticated/properties')({
  component: Properties,
})

function Properties() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <HeaderCompanyDropdown />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <PropertiesFeature />
      </Main>
    </>
  )
}
