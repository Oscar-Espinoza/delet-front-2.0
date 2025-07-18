import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useBookings } from '../api'
import { useBookingsContext } from '../context/use-bookings-context'

export function BookingsCalendar() {
  const {
    filters,
    selectedDate,
    calendarView,
    setSelectedBooking,
    setShowDetailsModal,
  } = useBookingsContext()
  const { data: bookings = [], isLoading } = useBookings(filters)

  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const getBookingsForDay = (day: Date) => {
      return bookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime * 1000)
        return isSameDay(bookingDate, day)
      })
    }

    return (
      <div className='p-4'>
        <div className='bg-muted grid grid-cols-7 gap-px overflow-hidden rounded-lg'>
          {weekDays.map((day) => (
            <div
              key={day}
              className='bg-background text-muted-foreground p-2 text-center text-sm font-medium'
            >
              {day}
            </div>
          ))}
          {days.map((day, idx) => {
            const dayBookings = getBookingsForDay(day)
            const isCurrentMonth = isSameMonth(day, selectedDate)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={idx}
                className={cn(
                  'bg-background min-h-[100px] border-t p-2',
                  !isCurrentMonth && 'text-muted-foreground bg-muted/50'
                )}
              >
                <div
                  className={cn(
                    'mb-1 text-sm font-medium',
                    isToday && 'text-primary'
                  )}
                >
                  {format(day, 'd')}
                </div>
                <ScrollArea className='h-[80px]'>
                  <div className='space-y-1'>
                    {dayBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking._id}
                        className='cursor-pointer'
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetailsModal(true)
                        }}
                      >
                        <Badge
                          variant={
                            booking.status === 'cancelled'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className='w-full justify-start truncate text-xs'
                        >
                          {format(new Date(booking.startTime * 1000), 'HH:mm')}{' '}
                          - {booking.contact.firstName}
                        </Badge>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className='text-muted-foreground text-center text-xs'>
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate)
    const weekEnd = endOfWeek(selectedDate)
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getBookingsForDayHour = (day: Date, hour: number) => {
      return bookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime * 1000)
        return isSameDay(bookingDate, day) && bookingDate.getHours() === hour
      })
    }

    return (
      <ScrollArea className='h-[600px]'>
        <div className='p-4'>
          <div className='bg-muted grid grid-cols-8 gap-px overflow-hidden rounded-lg'>
            <div className='bg-background p-2'></div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className='bg-background p-2 text-center text-sm font-medium'
              >
                <div>{format(day, 'EEE')}</div>
                <div
                  className={cn(
                    'text-lg',
                    isSameDay(day, new Date()) && 'text-primary font-bold'
                  )}
                >
                  {format(day, 'd')}
                </div>
              </div>
            ))}
            {hours.map((hour) => (
              <>
                <div
                  key={`hour-${hour}`}
                  className='bg-background text-muted-foreground border-t p-2 text-right text-sm'
                >
                  {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                </div>
                {days.map((day) => {
                  const hourBookings = getBookingsForDayHour(day, hour)
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className='bg-background min-h-[50px] border-t border-l p-1'
                    >
                      {hourBookings.map((booking) => (
                        <Badge
                          key={booking._id}
                          variant={
                            booking.status === 'cancelled'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className='mb-1 w-full cursor-pointer truncate text-xs'
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowDetailsModal(true)
                          }}
                        >
                          {booking.contact.firstName} {booking.contact.lastName}
                        </Badge>
                      ))}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </ScrollArea>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getBookingsForHour = (hour: number) => {
      return bookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime * 1000)
        return (
          isSameDay(bookingDate, selectedDate) &&
          bookingDate.getHours() === hour
        )
      })
    }

    return (
      <ScrollArea className='h-[600px]'>
        <div className='p-4'>
          <div className='space-y-px'>
            {hours.map((hour) => {
              const hourBookings = getBookingsForHour(hour)
              return (
                <div
                  key={hour}
                  className='grid grid-cols-12 gap-4 border-b p-2'
                >
                  <div className='text-muted-foreground col-span-1 text-right text-sm'>
                    {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                  </div>
                  <div className='col-span-11 min-h-[50px]'>
                    {hourBookings.map((booking) => (
                      <Badge
                        key={booking._id}
                        variant={
                          booking.status === 'cancelled'
                            ? 'destructive'
                            : 'default'
                        }
                        className='mr-2 mb-2 cursor-pointer'
                        onClick={() => {
                          setSelectedBooking(booking)
                          setShowDetailsModal(true)
                        }}
                      >
                        {format(new Date(booking.startTime * 1000), 'HH:mm')} -
                        {booking.contact.firstName} {booking.contact.lastName} -
                        {booking.property.address}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    )
  }

  if (isLoading) {
    return (
      <div className='flex h-[600px] items-center justify-center'>
        <div className='text-muted-foreground'>Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className='bg-background rounded-lg border'>
      {calendarView === 'dayGridMonth' && renderMonthView()}
      {calendarView === 'timeGridWeek' && renderWeekView()}
      {calendarView === 'timeGridDay' && renderDayView()}
    </div>
  )
}
