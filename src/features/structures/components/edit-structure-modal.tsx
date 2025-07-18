import { useState, useEffect } from 'react'
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
import { MultiSelect } from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CompanySelect } from '@/components/form/company-select'
import { hardwareApi } from '@/features/hardware/api/hardware-api'
import { Hardware } from '@/features/hardware/types/hardware'
import {
  useUpdateStructure,
  useStructures,
  useStructure,
  structuresApi,
} from '../api'
import { useStructuresContext } from '../context/structures-context'
import { structureFormSchema, StructureFormData, StructureType } from '../types'

interface Property {
  _id: string
  shortAddress: string
  unit?: string
  city?: string
  state?: string
  zipCode?: string
}

export function EditStructureModal() {
  const { isEditDialogOpen, setIsEditDialogOpen, selectedStructure } =
    useStructuresContext()
  const updateStructure = useUpdateStructure()
  const { data: structures = [] } = useStructures()
  const { data: structureDetails, isLoading: loadingStructure } = useStructure(
    selectedStructure?._id || ''
  )
  const [hardware, setHardware] = useState<Hardware[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [originalProperties, setOriginalProperties] = useState<string[]>([])
  const [originalHardware, setOriginalHardware] = useState<string[]>([])

  const form = useForm<StructureFormData>({
    resolver: zodResolver(structureFormSchema),
    defaultValues: {
      name: '',
      type: StructureType.BUILDING,
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      company: null,
      parentStructure: null,
      properties: [],
      hardware: [],
    },
  })

  useEffect(() => {
    if (isEditDialogOpen && structureDetails) {
      loadFormData()
      const propertyIds = structureDetails.properties?.map((p) => p._id) || []
      const hardwareIds = structureDetails.hardware?.map((h) => h._id) || []

      setOriginalProperties(propertyIds)
      setOriginalHardware(hardwareIds)

      form.reset({
        name: structureDetails.name || '',
        type: structureDetails.type,
        address: {
          street: structureDetails.address?.street || '',
          city: structureDetails.address?.city || '',
          state: structureDetails.address?.state || '',
          zipCode: structureDetails.address?.zipCode || '',
        },
        company: structureDetails.company?._id || null,
        parentStructure: structureDetails.parentStructure?._id || null,
        properties: propertyIds,
        hardware: hardwareIds,
      })
    }
  }, [isEditDialogOpen, structureDetails, form])

  // Watch for property selection changes and auto-populate address
  const selectedProperties = form.watch('properties')
  useEffect(() => {
    if (selectedProperties && selectedProperties.length > 0) {
      const firstPropertyId = selectedProperties[0]
      const firstProperty = properties.find((p) => p._id === firstPropertyId)
      if (firstProperty) {
        form.setValue('address', {
          street: firstProperty.shortAddress || '',
          city: firstProperty.city || '',
          state: firstProperty.state || '',
          zipCode: firstProperty.zipCode || '',
        })
      }
    }
  }, [selectedProperties, properties, form])

  const loadFormData = async () => {
    setLoadingData(true)
    try {
      const [hardwareData, propertiesData] = await Promise.all([
        hardwareApi.list(),
        structuresApi.getProperties(),
      ])
      // Filter hardware to only include lockboxes
      const lockboxes = hardwareData.filter(
        (hardware) => hardware.category === 'lockbox'
      )
      setHardware(lockboxes)
      setProperties(propertiesData)
    } catch (_error) {
      toast.error('Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (data: StructureFormData) => {
    if (!selectedStructure) return

    try {
      const currentProperties = data.properties || []
      const currentHardware = data.hardware || []

      const removedProperties = originalProperties.filter(
        (id) => !currentProperties.includes(id)
      )
      const removedHardware = originalHardware.filter(
        (id) => !currentHardware.includes(id)
      )

      await updateStructure.mutateAsync({
        _id: selectedStructure._id,
        ...data,
        removedProperties,
        removedHardware,
      })

      toast.success('Structure updated successfully')
      setIsEditDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to update structure')
    }
  }

  const selectedType = form.watch('type')

  const getParentStructureOptions = () => {
    const filteredStructures = structures.filter(
      (s) => s._id !== selectedStructure?._id
    )

    if (
      selectedType === StructureType.BUILDING ||
      selectedType === StructureType.COMPLEX
    ) {
      return filteredStructures.filter((s) => s.type === StructureType.COMPLEX)
    }
    if (selectedType === StructureType.FLOOR) {
      return filteredStructures.filter((s) => s.type === StructureType.BUILDING)
    }
    if (selectedType === StructureType.ROOM) {
      return filteredStructures.filter(
        (s) =>
          s.type === StructureType.FLOOR || s.type === StructureType.BUILDING
      )
    }
    if (selectedType === StructureType.AREA) {
      return filteredStructures.filter(
        (s) =>
          s.type === StructureType.COMPLEX ||
          s.type === StructureType.BUILDING ||
          s.type === StructureType.FLOOR
      )
    }
    return []
  }

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[725px]'>
        <DialogHeader>
          <DialogTitle>Edit Structure</DialogTitle>
          <DialogDescription>
            Update the structure details below.
          </DialogDescription>
        </DialogHeader>
        {loadingData || loadingStructure ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter structure name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={StructureType.BUILDING}>
                            Building
                          </SelectItem>
                          <SelectItem value={StructureType.FLOOR}>
                            Floor
                          </SelectItem>
                          <SelectItem value={StructureType.ROOM}>
                            Room
                          </SelectItem>
                          <SelectItem value={StructureType.COMPLEX}>
                            Complex
                          </SelectItem>
                          <SelectItem value={StructureType.AREA}>
                            Area
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='company'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <CompanySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select company'
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='parentStructure'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Structure</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === 'none' ? null : value)
                        }
                        value={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select parent structure' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='none'>None</SelectItem>
                          {getParentStructureOptions().map((structure) => (
                            <SelectItem
                              key={structure._id}
                              value={structure._id}
                            >
                              {structure.name || 'Unnamed'} ({structure.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='col-span-2'>
                  <h3 className='mb-2 text-sm font-medium'>Address</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='address.street'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder='123 Main St' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address.city'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder='New York' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address.state'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder='NY' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='address.zipCode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder='10001' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='properties'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Properties</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={properties.map((p) => ({
                            label: `${p.shortAddress || 'Unknown'}${p.unit ? ` Unit ${p.unit}` : ''} - ${p.city || 'Unknown'}, ${p.state || 'Unknown'}`,
                            value: p._id,
                          }))}
                          onValueChange={field.onChange}
                          value={field.value ?? []}
                          placeholder='Select properties'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='hardware'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Lockboxes</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={hardware.map((h) => ({
                            label: h.name ?? 'Unnamed Lockbox',
                            value: h._id,
                          }))}
                          onValueChange={field.onChange}
                          value={field.value ?? []}
                          placeholder='Select lockboxes'
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
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={updateStructure.isPending}>
                  {updateStructure.isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Update Structure
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
