import {
  CalendarDays,
  CalendarRange,
  Calendar,
  CalendarClock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookingsContext } from '../../context/use-bookings-context'
import { type CalendarView } from '../../types'

export function ViewTypeButtons() {
  const {
    calendarView,
    setCalendarView,
    setSelectedDate,
    filters,
    setFilters,
  } = useBookingsContext()

  const handleViewChange = (view: CalendarView | 'today') => {
    if (view === 'today') {
      // Reset to today and switch to day view
      const today = new Date()
      setSelectedDate(today)
      setCalendarView('timeGridDay')

      // Update filters for today
      const start = new Date(today)
      start.setHours(0, 0, 0, 0)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)

      setFilters({
        ...filters,
        startTime: Math.floor(start.getTime() / 1000),
        endTime: Math.floor(end.getTime() / 1000),
      })
    } else {
      setCalendarView(view)

      // Update filters based on new view
      const date = new Date()
      let startTime: number
      let endTime: number

      switch (view) {
        case 'dayGridMonth': {
          const start = new Date(date.getFullYear(), date.getMonth(), 1)
          const end = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
            23,
            59,
            59
          )
          startTime = Math.floor(start.getTime() / 1000)
          endTime = Math.floor(end.getTime() / 1000)
          break
        }
        case 'timeGridWeek': {
          const start = new Date(date)
          start.setDate(date.getDate() - date.getDay())
          start.setHours(0, 0, 0, 0)

          const end = new Date(start)
          end.setDate(start.getDate() + 6)
          end.setHours(23, 59, 59, 999)

          startTime = Math.floor(start.getTime() / 1000)
          endTime = Math.floor(end.getTime() / 1000)
          break
        }
        case 'timeGridDay': {
          const start = new Date(date)
          start.setHours(0, 0, 0, 0)

          const end = new Date(date)
          end.setHours(23, 59, 59, 999)

          startTime = Math.floor(start.getTime() / 1000)
          endTime = Math.floor(end.getTime() / 1000)
          break
        }
      }

      setFilters({ ...filters, startTime, endTime })
    }
  }

  return (
    <div className='flex rounded-md shadow-sm' role='group'>
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => handleViewChange('today')}
        className='rounded-r-none'
      >
        <CalendarClock className='mr-1 h-4 w-4' />
        Today
      </Button>
      <Button
        type='button'
        variant={calendarView === 'timeGridDay' ? 'default' : 'outline'}
        size='sm'
        onClick={() => handleViewChange('timeGridDay')}
        className='rounded-none border-l-0'
      >
        <Calendar className='mr-1 h-4 w-4' />
        Day
      </Button>
      <Button
        type='button'
        variant={calendarView === 'timeGridWeek' ? 'default' : 'outline'}
        size='sm'
        onClick={() => handleViewChange('timeGridWeek')}
        className='rounded-none border-l-0'
      >
        <CalendarRange className='mr-1 h-4 w-4' />
        Week
      </Button>
      <Button
        type='button'
        variant={calendarView === 'dayGridMonth' ? 'default' : 'outline'}
        size='sm'
        onClick={() => handleViewChange('dayGridMonth')}
        className='rounded-l-none border-l-0'
      >
        <CalendarDays className='mr-1 h-4 w-4' />
        Month
      </Button>
    </div>
  )
}
