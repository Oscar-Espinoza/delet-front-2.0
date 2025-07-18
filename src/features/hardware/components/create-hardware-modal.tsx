import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
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
import { useHardwareContext } from '../contexts/use-hardware-context'
import {
  useCreateHardware,
  useAugustLocks,
  useAugustSerialNumbers,
} from '../hooks/use-hardware'
import type {
  Hardware,
  HardwareCategory,
  HardwareStatus,
} from '../types/hardware'
import {
  hardwareFormSchema,
  type HardwareFormData,
} from '../types/hardware-form'

const categoryOptions: { value: HardwareCategory; label: string }[] = [
  { value: 'router', label: 'Router' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'camera', label: 'Camera' },
  { value: 'lock', label: 'Lock' },
  { value: 'lockbox', label: 'Lockbox' },
  { value: 'keypad', label: 'Keypad' },
  { value: 'hub', label: 'Hub' },
  { value: 'sensor', label: 'Sensor' },
]

const statusOptions: { value: HardwareStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
]

export function CreateHardwareModal() {
  const { isCreateDialogOpen, setIsCreateDialogOpen } = useHardwareContext()
  const createHardware = useCreateHardware()
  const augustLocks = useAugustLocks()
  const augustSerialNumbers = useAugustSerialNumbers()

  const form = useForm<HardwareFormData>({
    resolver: zodResolver(hardwareFormSchema),
    defaultValues: {
      name: '',
      description: '',
      notes: '',
      inventoryId: '',
      tags: [],
      status: 'active',
      make: 'ezvizdirect',
    },
  })

  const handleSubmit = async (data: HardwareFormData) => {
    try {
      // Transform form data to match API structure
      const payload: Partial<Hardware> = {
        name: data.name,
        description: data.description,
        notes: data.notes,
        inventoryId: data.inventoryId,
        tags: data.tags,
        category: data.category,
        status: data.status,
        model: data.model,
        serial: data.serial,
        make: data.make,
      }

      // Add category-specific fields based on the selected category
      if (data.category === 'router' && (data.routerId || data.routerStatus)) {
        payload.router = {
          id: data.routerId,
          status: data.routerStatus || 'unknown',
        }
      }

      if (data.category === 'lock' && (data.lockId || data.lockVendor)) {
        payload.lock = {
          id: data.lockId,
          vendor: data.lockVendor,
        }
      }

      if (
        data.category === 'lockbox' &&
        (data.lockboxId || data.lockboxVendor)
      ) {
        payload.lockbox = {
          id: data.lockboxId,
          vendor: data.lockboxVendor,
        }
      }

      if (data.category === 'hub' && data.hubLockId) {
        payload.hub = {
          lockId: data.hubLockId,
        }
      }

      if (data.category === 'sensor' && data.sensorLockId) {
        payload.sensor = {
          lockId: data.sensorLockId,
        }
      }

      if (data.category === 'keypad' && (data.keypadId || data.keypadVendor)) {
        payload.keypad = {
          id: data.keypadId,
          vendor: data.keypadVendor,
        }
      }

      if (data.category === 'tablet' && data.tabletDropin) {
        payload.tablet = {
          dropin: data.tabletDropin,
        }
      }

      if (data.category === 'camera' && data.cameraFirmware) {
        payload.cameraFirmware = data.cameraFirmware
      }

      await createHardware.mutateAsync(payload)
      form.reset()
      setIsCreateDialogOpen(false)
    } catch (_error) {
      // Error is already handled by the mutation's onError callback
    }
  }

  const selectedCategory = form.watch('category')
  const selectedLockVendor = form.watch('lockVendor')

  // Fetch August lock data when category is lock and vendor is august or yale
  useEffect(() => {
    if (
      selectedCategory === 'lock' &&
      (selectedLockVendor === 'august' || selectedLockVendor === 'yale')
    ) {
      augustLocks.refetch()
      augustSerialNumbers.refetch()
    }
  }, [selectedCategory, selectedLockVendor, augustLocks, augustSerialNumbers])

  // Handle lock selection and auto-populate name and serial
  const handleLockSelection = (lockId: string) => {
    const selectedLock = augustLocks.data?.find((lock) => lock.id === lockId)
    const matchingSerial = augustSerialNumbers.data?.find(
      (serial) => serial.LockID === lockId
    )

    if (selectedLock) {
      // Update name field
      form.setValue('name', selectedLock.name, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      // Update lockId field
      form.setValue('lockId', lockId, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      // Update serial field
      const serialValue = matchingSerial ? matchingSerial.serialNumber : ''

      form.setValue('serial', serialValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      // Trigger form validation to ensure UI updates
      form.trigger(['name', 'serial', 'lockId'])
    }
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Add Hardware</DialogTitle>
          <DialogDescription>
            Create a new hardware device in the system.
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter hardware name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name='inventoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory ID</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter inventory ID' {...field} />
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
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter model' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='serial'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter serial number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter hardware description'
                        className='resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
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
                        placeholder='Add any additional notes'
                        className='resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category-specific fields */}
              {selectedCategory === 'router' && (
                <>
                  <FormField
                    control={form.control}
                    name='routerId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Router ID</FormLabel>
                        <FormControl>
                          <Input placeholder='Enter router ID' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='routerStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Router Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='online'>Online</SelectItem>
                            <SelectItem value='offline'>Offline</SelectItem>
                            <SelectItem value='unknown'>Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {selectedCategory === 'lock' && (
                <>
                  <FormField
                    control={form.control}
                    name='lockVendor'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lock Vendor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select vendor' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='august'>August</SelectItem>
                            <SelectItem value='switchbot'>SwitchBot</SelectItem>
                            <SelectItem value='yale'>Yale</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedLockVendor === 'august' ||
                  selectedLockVendor === 'yale' ? (
                    <FormField
                      control={form.control}
                      name='lockId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Lock</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Only handle selection if both data sets are loaded
                              if (
                                !augustLocks.isLoading &&
                                !augustSerialNumbers.isLoading &&
                                augustLocks.data &&
                                augustSerialNumbers.data
                              ) {
                                handleLockSelection(value)
                              }
                            }}
                            defaultValue={field.value}
                            disabled={
                              augustLocks.isLoading ||
                              augustSerialNumbers.isLoading
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    augustLocks.isLoading
                                      ? 'Loading locks...'
                                      : 'Select lock'
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {augustLocks.isError && (
                                <SelectItem value='' disabled>
                                  Error loading locks
                                </SelectItem>
                              )}
                              {augustLocks.data?.map((lock) => (
                                <SelectItem key={lock.id} value={lock.id}>
                                  {lock.name}
                                </SelectItem>
                              ))}
                              {augustLocks.data?.length === 0 && (
                                <SelectItem value='' disabled>
                                  No locks available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name='lockId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lock ID</FormLabel>
                          <FormControl>
                            <Input placeholder='Enter lock ID' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              {selectedCategory === 'camera' && (
                <FormField
                  control={form.control}
                  name='cameraFirmware'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Camera Firmware</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select firmware' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='v1'>Version 1</SelectItem>
                          <SelectItem value='v2'>Version 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createHardware.isPending}>
                {createHardware.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Hardware
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
