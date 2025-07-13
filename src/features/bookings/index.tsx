import { BookingsProvider } from './context/bookings-context'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DateFilter } from './components/filters/date-filter'
import { PropertiesFilter } from './components/filters/properties-filter'
import { AgentsFilter } from './components/filters/agents-filter'
import { ViewTypeButtons } from './components/filters/view-type-buttons'
import { BookingsCalendar } from './components/bookings-calendar'
import { CreateBookingModal } from './components/create-booking-modal'
import { EditBookingModal } from './components/edit-booking-modal'
import { BookingDetailsModal } from './components/booking-details-modal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useBookingsContext } from './context/use-bookings-context'

function BookingsContent() {
  const { setShowCreateModal } = useBookingsContext()

  return (
    <>
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
            <h2 className='text-2xl font-bold tracking-tight'>Bookings Calendar</h2>
            <p className='text-muted-foreground'>
              View and manage all property showings and appointments
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className='mr-2 h-4 w-4' />
            New Booking
          </Button>
        </div>
        
        <div className='mb-4 flex flex-wrap items-center gap-2'>
          <DateFilter />
          <PropertiesFilter />
          <AgentsFilter />
          <div className='ml-auto'>
            <ViewTypeButtons />
          </div>
        </div>
        
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <BookingsCalendar />
        </div>
      </Main>
      
      {/* Modals */}
      <CreateBookingModal />
      <EditBookingModal />
      <BookingDetailsModal />
    </>
  )
}

export default function BookingsPage() {
  return (
    <BookingsProvider>
      <BookingsContent />
    </BookingsProvider>
  )
}