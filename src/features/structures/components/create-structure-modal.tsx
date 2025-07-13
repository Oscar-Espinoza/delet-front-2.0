import { useState, useEffect } from 'react'
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
import { toast } from 'sonner'
import { useStructuresContext } from '../context/structures-context'
import { useCreateStructure, useStructures, structuresApi } from '../api'
import { structureFormSchema, StructureFormData, StructureType } from '../types'
import { getUsersList } from '@/features/users/api/users-api'
import { User } from '@/features/users/types'
import { hardwareApi } from '@/features/hardware/api/hardware-api'
import { Hardware } from '@/features/hardware/types/hardware'
import { MultiSelect } from '@/components/ui/multi-select'

interface Property {
  _id: string;
  shortAddress: string;
  unit?: string;
  city?: string;
  state?: string;
}

export function CreateStructureModal() {
  const { isCreateDialogOpen, setIsCreateDialogOpen } = useStructuresContext()
  const createStructure = useCreateStructure()
  const { data: structures = [] } = useStructures()
  const [users, setUsers] = useState<User[]>([])
  const [hardware, setHardware] = useState<Hardware[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingData, setLoadingData] = useState(false)

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
      user: '',
      parentStructure: null,
      properties: [],
      hardware: [],
    },
  })

  useEffect(() => {
    if (isCreateDialogOpen) {
      loadFormData()
    }
  }, [isCreateDialogOpen])

  const loadFormData = async () => {
    setLoadingData(true)
    try {
      const [usersData, hardwareData, propertiesData] = await Promise.all([
        getUsersList(),
        hardwareApi.list(),
        structuresApi.getProperties()
      ])
      setUsers(usersData)
      setHardware(hardwareData)
      setProperties(propertiesData)
    } catch (_error) {
      toast.error('Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (data: StructureFormData) => {
    try {
      await createStructure.mutateAsync(data)
      toast.success('Structure created successfully')
      form.reset()
      setIsCreateDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to create structure')
    }
  }

  const selectedType = form.watch('type')

  const getParentStructureOptions = () => {
    if (selectedType === StructureType.BUILDING || selectedType === StructureType.COMPLEX) {
      return structures.filter(s => s.type === StructureType.COMPLEX)
    }
    if (selectedType === StructureType.FLOOR) {
      return structures.filter(s => s.type === StructureType.BUILDING)
    }
    if (selectedType === StructureType.ROOM) {
      return structures.filter(s => s.type === StructureType.FLOOR || s.type === StructureType.BUILDING)
    }
    if (selectedType === StructureType.AREA) {
      return structures.filter(s =>
        s.type === StructureType.COMPLEX ||
        s.type === StructureType.BUILDING ||
        s.type === StructureType.FLOOR
      )
    }
    return []
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className='sm:max-w-[725px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create Structure</DialogTitle>
          <DialogDescription>
            Add a new structure to your system. Fill in the structure details below.
          </DialogDescription>
        </DialogHeader>
        {loadingData ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={StructureType.BUILDING}>Building</SelectItem>
                          <SelectItem value={StructureType.FLOOR}>Floor</SelectItem>
                          <SelectItem value={StructureType.ROOM}>Room</SelectItem>
                          <SelectItem value={StructureType.COMPLEX}>Complex</SelectItem>
                          <SelectItem value={StructureType.AREA}>Area</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='user'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select user' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.email} {user.company && typeof user.company === 'object' && `(${user.company.name})`}
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
                  name='parentStructure'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Structure</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
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
                            <SelectItem key={structure._id} value={structure._id}>
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
                  <h3 className='text-sm font-medium mb-2'>Address</h3>
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
                          options={properties.map(p => ({
                            label: `${p.shortAddress || 'Unknown'}${p.unit ? ` Unit ${p.unit}` : ''} - ${p.city || 'Unknown'}, ${p.state || 'Unknown'}`,
                            value: p._id
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
                      <FormLabel>Hardware</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={hardware.map(h => ({
                            label: h.name ?? 'Unnamed Hardware',
                            value: h._id
                          }))}
                          onValueChange={field.onChange}
                          value={field.value ?? []}
                          placeholder='Select hardware'
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
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={createStructure.isPending}>
                  {createStructure.isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Create Structure
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}