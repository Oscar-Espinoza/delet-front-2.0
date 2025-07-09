import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, Trash2Icon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { usePlaceOrder } from '../hooks/use-orders'
import { orderPlacedSchema, type OrderPlacedFormValues } from '../data/schema'

interface PlaceOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlaceOrderDialog({ open, onOpenChange }: PlaceOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const placeOrder = usePlaceOrder()

  const form = useForm<OrderPlacedFormValues>({
    resolver: zodResolver(orderPlacedSchema),
    defaultValues: {
      quantity: 1,
      addresses: [{ address: '', quantity: 1 }],
      provideShippingLater: false,
      notes: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  })

  const onSubmit = async (data: OrderPlacedFormValues) => {
    setIsSubmitting(true)
    try {
      await placeOrder.mutateAsync({ data })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to place order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalQuantity = form.watch('addresses').reduce(
    (sum, addr) => sum + (addr.quantity || 0),
    0
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Place New Order</DialogTitle>
          <DialogDescription>
            Fill out the form below to place a new order.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Total number of items in this order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <FormLabel>Shipping Addresses</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ address: '', quantity: 1 })}
                >
                  <PlusIcon className='mr-2 h-4 w-4' />
                  Add Address
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className='space-y-4 p-4 border rounded-lg'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 space-y-4'>
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.address`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address {index + 1}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Enter shipping address'
                                className='min-h-[80px]'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`addresses.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity for this address</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                min={1}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => remove(index)}
                        className='ml-2'
                      >
                        <Trash2Icon className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {totalQuantity > 0 && (
                <div className='text-sm text-muted-foreground'>
                  Total quantity across all addresses: {totalQuantity}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name='provideShippingLater'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Provide shipping later
                    </FormLabel>
                    <FormDescription>
                      Check this if shipping addresses will be provided later
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Any additional notes for this order'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes or special instructions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end space-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}