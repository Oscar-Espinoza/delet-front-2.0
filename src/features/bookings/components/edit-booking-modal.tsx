import { useEffect } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateBooking } from '../api'
import { useBookingsContext } from '../context/use-bookings-context'
import { bookingFormSchema, BookingFormData, BookingStatus } from '../types'

// Mock data - replace with actual API calls
const mockProperties = [
  { _id: '1', address: '123 Main St, Apt 4B' },
  { _id: '2', address: '456 Oak Ave, Unit 2' },
  { _id: '3', address: '789 Pine Rd, Suite 100' },
]

const mockContacts = [
  { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
  { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
  { _id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
]

const bookingStatuses: { value: BookingStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'attended', label: 'Attended' },
  { value: 'missed', label: 'Missed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rescheduled', label: 'Rescheduled' },
  { value: 'show', label: 'Show' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'archived', label: 'Archived' },
]

export function EditBookingModal() {
  const { showEditModal, setShowEditModal, selectedBooking } =
    useBookingsContext()
  const updateBooking = useUpdateBooking()

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertyId: '',
      contactId: '',
      startTime: new Date(),
      status: 'scheduled',
      notes: '',
    },
  })

  useEffect(() => {
    if (selectedBooking) {
      form.reset({
        propertyId: selectedBooking.property._id,
        contactId: selectedBooking.contact._id,
        startTime: new Date(selectedBooking.startTime * 1000),
        status: selectedBooking.status,
        notes: selectedBooking.notes || '',
      })
    }
  }, [selectedBooking, form])

  const handleSubmit = async (data: BookingFormData) => {
    if (!selectedBooking) return

    try {
      await updateBooking.mutateAsync({
        id: selectedBooking._id,
        data,
      })
      toast.success('Booking updated successfully')
      setShowEditModal(false)
    } catch (_error) {
      toast.error('Failed to update booking')
    }
  }

  if (!selectedBooking) return null

  return (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Update the booking details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='propertyId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a property' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProperties.map((property) => (
                          <SelectItem key={property._id} value={property._id}>
                            {property.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contactId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a contact' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockContacts.map((contact) => (
                          <SelectItem key={contact._id} value={contact._id}>
                            {contact.firstName} {contact.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time *</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        value={
                          field.value
                            ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                            : ''
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookingStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Add any additional notes about this booking'
                        className='resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={updateBooking.isPending}>
                {updateBooking.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Update Booking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
