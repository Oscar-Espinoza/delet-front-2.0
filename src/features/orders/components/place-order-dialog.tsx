import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, Trash2Icon, InfoIcon, AlertTriangleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { AddressAutocomplete } from '@/components/AddressAutocomplete'
import { CompanySelect } from '@/components/form/company-select'
import { useBillingEntitiesByCompany } from '@/features/billing-entities/hooks/use-billing-entities'
import { orderPlacedSchema, type OrderPlacedFormValues } from '../data/schema'
import { usePlaceOrder } from '../hooks/use-orders'
import type { KitAllocationState, KitAllocationError } from '../types'
import {
  calculateKitAllocation,
  validateKitAllocation,
  redistributeKitsOnAddressRemoval,
  autoAssignKits,
  canRemoveAddress,
} from '../utils/kit-allocation'

const KIT_PRICE = 50

interface PlaceOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlaceOrderDialog({
  open,
  onOpenChange,
}: PlaceOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [kitAllocation, setKitAllocation] = useState<KitAllocationState>({
    totalKits: 1,
    assignedKits: 0,
    availableKits: 1,
  })
  const [allocationErrors, setAllocationErrors] = useState<
    KitAllocationError[]
  >([])
  const placeOrder = usePlaceOrder()

  const form = useForm<OrderPlacedFormValues>({
    resolver: zodResolver(orderPlacedSchema),
    defaultValues: {
      quantity: 1,
      companyId: '',
      addresses: [
        {
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
          },
          quantity: 1,
          assignedKits: 1,
        },
      ],
      provideShippingLater: false,
      notes: '',
      billingEntityId: undefined,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'addresses',
  })

  const totalKits = form.watch('quantity')
  const addresses = form.watch('addresses')
  const provideShippingLater = form.watch('provideShippingLater')
  const companyId = form.watch('companyId')

  // Fetch billing entities for the selected company
  const { data: billingEntities, isLoading: isLoadingBillingEntities } =
    useBillingEntitiesByCompany(companyId)

  useEffect(() => {
    const allocation = calculateKitAllocation(totalKits, addresses)
    setKitAllocation(allocation)

    const errors = validateKitAllocation(
      totalKits,
      addresses,
      provideShippingLater
    )
    setAllocationErrors(errors)
  }, [totalKits, addresses, provideShippingLater])

  // Clear billing entity when company changes
  useEffect(() => {
    if (companyId) {
      form.setValue('billingEntityId', undefined)
    }
  }, [companyId, form])

  const handleQuantityChange = (newQuantity: number) => {
    const currentAddresses = form.getValues('addresses')
    const currentAssigned = currentAddresses.reduce(
      (sum, addr) => sum + (addr.assignedKits || 0),
      0
    )

    // Don't allow setting quantity below currently assigned kits
    const finalQuantity = Math.max(newQuantity, currentAssigned)

    if (finalQuantity !== newQuantity && currentAssigned > 0) {
      toast.error(
        `Cannot reduce total kits below ${currentAssigned} (currently assigned amount)`
      )
    }

    form.setValue('quantity', finalQuantity)

    if (!provideShippingLater) {
      const updatedAddresses = autoAssignKits(finalQuantity, currentAddresses)
      form.setValue('addresses', updatedAddresses)
    }
  }

  const handleAssignedKitsChange = (
    addressIndex: number,
    assignedKits: number
  ) => {
    const currentAddresses = form.getValues('addresses')
    const updatedAddresses = [...currentAddresses]

    // Calculate how many kits are available for this address
    const otherAddressesAssigned = currentAddresses.reduce(
      (sum, addr, index) => {
        if (index === addressIndex) return sum
        return sum + (addr.assignedKits || 0)
      },
      0
    )
    const maxCanAssign = totalKits - otherAddressesAssigned

    updatedAddresses[addressIndex] = {
      ...updatedAddresses[addressIndex],
      assignedKits: Math.max(0, Math.min(assignedKits, maxCanAssign)),
    }
    form.setValue('addresses', updatedAddresses)
  }

  const handleRemoveAddress = (index: number) => {
    const currentAddresses = form.getValues('addresses')
    const { canRemove, reason } = canRemoveAddress(currentAddresses, index)

    if (!canRemove && reason) {
      toast.error(reason)
      return
    }

    const updatedAddresses = redistributeKitsOnAddressRemoval(
      currentAddresses,
      index
    )
    form.setValue('addresses', updatedAddresses)
    remove(index)
  }

  const onSubmit = async (data: OrderPlacedFormValues) => {
    setIsSubmitting(true)
    try {
      await placeOrder.mutateAsync({ data })
      form.reset()
      onOpenChange(false)
    } catch (_error) {
      // Handle error silently - mutation handles toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalQuantity = form
    .watch('addresses')
    .reduce((sum, addr) => sum + (addr.quantity || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
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
              render={({ field }) => {
                const currentAssigned = addresses.reduce(
                  (sum, addr) => sum + (addr.assignedKits || 0),
                  0
                )
                const minQuantity = Math.max(1, currentAssigned)

                return (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={minQuantity}
                        {...field}
                        onChange={(e) =>
                          handleQuantityChange(
                            parseInt(e.target.value) || minQuantity
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of kits in this order{' '}
                      {currentAssigned > 0 &&
                        `(minimum: ${currentAssigned} assigned)`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={form.control}
              name='companyId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <CompanySelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select company'
                    includeNone={false}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {!provideShippingLater && (
              <Card className='bg-muted/50'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base'>Kit Allocation</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Total Kits:</span>
                    <span className='font-medium'>
                      {kitAllocation.totalKits}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Assigned:</span>
                    <span className='font-medium'>
                      {kitAllocation.assignedKits}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Available:</span>
                    <span className='font-medium'>
                      {kitAllocation.availableKits}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {allocationErrors.length > 0 && !provideShippingLater && (
              <Alert variant='destructive'>
                <AlertTriangleIcon className='h-4 w-4' />
                <AlertDescription>
                  <div className='space-y-1'>
                    {allocationErrors.map((error, index) => (
                      <div key={index} className='text-sm'>
                        {error.message}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <FormLabel>Shipping Addresses</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={
                    !provideShippingLater && kitAllocation.availableKits <= 0
                  }
                  onClick={() => {
                    const kitsToAssign =
                      !provideShippingLater && kitAllocation.availableKits > 0
                        ? 1
                        : 0
                    append({
                      address: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: '',
                      },
                      quantity: 1,
                      assignedKits: kitsToAssign,
                    })
                  }}
                >
                  <PlusIcon className='mr-2 h-4 w-4' />
                  {!provideShippingLater && kitAllocation.availableKits <= 0
                    ? 'No Kits Available'
                    : 'Add Address'}
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className='space-y-4 rounded-lg border p-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 space-y-4'>
                      <FormField
                        control={form.control}
                        name={`addresses.${index}.address`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <AddressAutocomplete
                                value={field.value}
                                onChange={field.onChange}
                                placeholder='Search for an address...'
                                disabled={form.formState.isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!provideShippingLater && (
                        <FormField
                          control={form.control}
                          name={`addresses.${index}.assignedKits`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assigned Kits</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  min={0}
                                  disabled={
                                    kitAllocation.availableKits === 0 &&
                                    field.value === 0
                                  }
                                  {...field}
                                  onChange={(e) =>
                                    handleAssignedKitsChange(
                                      index,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription className='text-xs'>
                                Kits assigned to this address{' '}
                                {kitAllocation.availableKits > 0 &&
                                  `(${kitAllocation.availableKits} available)`}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveAddress(index)}
                        className='ml-2'
                      >
                        <Trash2Icon className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {totalQuantity > 0 && (
                <div className='text-muted-foreground text-sm'>
                  Total quantity across all addresses: {totalQuantity}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name='billingEntityId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill To</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!companyId || isLoadingBillingEntities}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !companyId
                              ? 'Select a company first'
                              : isLoadingBillingEntities
                                ? 'Loading billing entities...'
                                : 'Select billing entity'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {!companyId ? (
                          <SelectItem value='no-company' disabled>
                            Please select a company first
                          </SelectItem>
                        ) : isLoadingBillingEntities ? (
                          <SelectItem value='loading' disabled>
                            Loading billing entities...
                          </SelectItem>
                        ) : billingEntities?.length === 0 ? (
                          <SelectItem value='empty' disabled>
                            No billing entities available
                          </SelectItem>
                        ) : (
                          billingEntities?.map((entity) => (
                            <SelectItem key={entity._id} value={entity._id}>
                              {entity.entityName} ({entity.entityType})
                              {entity.email ? ` - ${entity.email}` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the entity that will be billed for this order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      Check this if shipping addresses will be provided later.
                      Kit allocation will be bypassed.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (checked) {
                          // Clear assigned kits when enabling provide shipping later
                          const currentAddresses = form.getValues('addresses')
                          const clearedAddresses = currentAddresses.map(
                            (addr) => ({
                              ...addr,
                              assignedKits: 0,
                            })
                          )
                          form.setValue('addresses', clearedAddresses)
                        }
                      }}
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

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Kits:</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Price per kit:</span>
                  <span>${KIT_PRICE.toFixed(2)}</span>
                </div>
                <div className='border-t pt-2'>
                  <div className='flex justify-between text-lg font-semibold'>
                    <span>Total:</span>
                    <span>${(totalQuantity * KIT_PRICE).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Alert>
              <InfoIcon className='h-4 w-4' />
              <AlertDescription className='space-y-2'>
                <p>
                  <strong>Billing Information:</strong>
                </p>
                <ul className='list-inside list-disc space-y-1 text-sm'>
                  <li>An invoice will be sent after placing this order</li>
                  <li>Payment will be charged in 5 days</li>
                  <li>Kits will be delivered within those 5 days</li>
                  <li>
                    You will be billed monthly on the same date each month
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className='flex justify-end space-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  isSubmitting ||
                  (allocationErrors.length > 0 && !provideShippingLater)
                }
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
