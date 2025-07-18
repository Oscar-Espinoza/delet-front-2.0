import { format } from 'date-fns'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Key,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useBookingsContext } from '../context/use-bookings-context'

const statusColors: Record<string, string> = {
  scheduled: 'default',
  pending: 'secondary',
  active: 'default',
  attended: 'default',
  missed: 'destructive',
  cancelled: 'destructive',
  rescheduled: 'secondary',
  show: 'default',
  incomplete: 'secondary',
  archived: 'secondary',
}

export function BookingDetailsModal() {
  const {
    showDetailsModal,
    setShowDetailsModal,
    selectedBooking,
    setShowEditModal,
  } = useBookingsContext()

  if (!selectedBooking) return null

  const handleEdit = () => {
    setShowDetailsModal(false)
    setShowEditModal(true)
  }

  return (
    <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            View complete information about this booking.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Status, Access Code, and Time */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Badge
                variant={
                  statusColors[selectedBooking.status] as
                    | 'default'
                    | 'secondary'
                    | 'destructive'
                    | 'outline'
                }
              >
                {selectedBooking.status.charAt(0).toUpperCase() +
                  selectedBooking.status.slice(1)}
              </Badge>
              {selectedBooking.passCode && (
                <div className='text-muted-foreground flex items-center text-sm'>
                  <Key className='mr-1 h-4 w-4' />
                  <span className='font-mono'>{selectedBooking.passCode}</span>
                </div>
              )}
            </div>
            <div className='text-muted-foreground flex items-center text-sm'>
              <Calendar className='mr-1 h-4 w-4' />
              {format(new Date(selectedBooking.startTime * 1000), 'PPP')}
              <Clock className='mr-1 ml-3 h-4 w-4' />
              {format(new Date(selectedBooking.startTime * 1000), 'p')}
            </div>
          </div>

          <Separator />

          {/* Property Information */}
          <div className='space-y-2'>
            <h3 className='flex items-center font-semibold'>
              <MapPin className='mr-2 h-4 w-4' />
              Property
            </h3>
            <div className='ml-6 space-y-1'>
              <p className='text-sm'>{selectedBooking.property.address}</p>
              {selectedBooking.property.unitNumber && (
                <p className='text-muted-foreground text-sm'>
                  Unit: {selectedBooking.property.unitNumber}
                </p>
              )}
              {selectedBooking.property.city && (
                <p className='text-muted-foreground text-sm'>
                  {selectedBooking.property.city},{' '}
                  {selectedBooking.property.state}{' '}
                  {selectedBooking.property.zipCode}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className='space-y-2'>
            <h3 className='flex items-center font-semibold'>
              <User className='mr-2 h-4 w-4' />
              Contact
            </h3>
            <div className='ml-6 space-y-1'>
              <p className='text-sm font-medium'>
                {selectedBooking.contact.firstName}{' '}
                {selectedBooking.contact.lastName}
              </p>
              {selectedBooking.contact.email && (
                <p className='text-muted-foreground flex items-center text-sm'>
                  <Mail className='mr-2 h-3 w-3' />
                  {selectedBooking.contact.email}
                </p>
              )}
              {selectedBooking.contact.phone && (
                <p className='text-muted-foreground flex items-center text-sm'>
                  <Phone className='mr-2 h-3 w-3' />
                  {selectedBooking.contact.phone}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Agent Information */}
          <div className='space-y-2'>
            <h3 className='flex items-center font-semibold'>
              <User className='mr-2 h-4 w-4' />
              Agent
            </h3>
            <div className='ml-6 space-y-1'>
              <p className='text-sm font-medium'>
                {selectedBooking.user.firstName} {selectedBooking.user.lastName}
              </p>
              <p className='text-muted-foreground text-sm'>
                {selectedBooking.user.email}
              </p>
              {selectedBooking.user.company && (
                <p className='text-muted-foreground text-sm'>
                  {selectedBooking.user.company.name}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          {selectedBooking.notes && (
            <>
              <Separator />
              <div className='space-y-2'>
                <h3 className='flex items-center font-semibold'>
                  <FileText className='mr-2 h-4 w-4' />
                  Notes
                </h3>
                <p className='text-muted-foreground ml-6 text-sm'>
                  {selectedBooking.notes}
                </p>
              </div>
            </>
          )}

          {/* Outcome */}
          <Separator />
          <div className='space-y-2'>
            <h3 className='font-semibold'>Outcome</h3>
            <div className='ml-6'>
              {selectedBooking.outcome &&
              selectedBooking.outcome.trim() !== '' ? (
                <Badge variant='outline'>
                  {selectedBooking.outcome
                    .replace(/_/g, ' ')
                    .charAt(0)
                    .toUpperCase() +
                    selectedBooking.outcome.replace(/_/g, ' ').slice(1)}
                </Badge>
              ) : (
                <span className='text-muted-foreground text-sm'>
                  No outcome recorded
                </span>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <Separator />
          <div className='text-muted-foreground flex justify-between text-xs'>
            <span>
              Created: {format(new Date(selectedBooking.createdAt), 'PPp')}
            </span>
            <span>
              Updated: {format(new Date(selectedBooking.updatedAt), 'PPp')}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          <Button onClick={handleEdit}>Edit Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
