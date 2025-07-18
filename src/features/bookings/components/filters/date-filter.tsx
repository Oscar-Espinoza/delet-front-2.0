import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { MonthPicker } from '@/components/ui/monthpicker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useBookingsContext } from '../../context/use-bookings-context'

export function DateFilter() {
  const { selectedDate, setSelectedDate, filters, setFilters, calendarView } =
    useBookingsContext()

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    setSelectedDate(date)

    // Update filters based on calendar view
    let startTime: number
    let endTime: number

    switch (calendarView) {
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
        start.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
        start.setHours(0, 0, 0, 0)

        const end = new Date(start)
        end.setDate(start.getDate() + 6) // End of week (Saturday)
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
      default:
        return
    }

    setFilters({ ...filters, startTime, endTime })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {selectedDate ? (
            format(selectedDate, 'PPP')
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        {calendarView === 'dayGridMonth' ? (
          <MonthPicker
            selectedMonth={selectedDate}
            onMonthSelect={handleDateSelect}
          />
        ) : (
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
