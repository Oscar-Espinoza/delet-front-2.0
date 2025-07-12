import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useKitsContext } from '../context/kits-context'
import { useUpdateKit, useKit } from '../api'
import { kitFormSchema, KitFormData, KitState } from '../types'
import { CompanySelect } from '@/components/form/company-select'
import { hardwareApi } from '@/features/hardware/api/hardware-api'
import { Hardware } from '@/features/hardware/types/hardware'
import { MultiSelect } from '@/components/ui/multi-select'
import { structuresApi } from '@/features/structures/api'

interface Property {
  _id: string;
  shortAddress: string;
  unit?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export function EditKitModal() {
  const { isEditDialogOpen, setIsEditDialogOpen, selectedKit } = useKitsContext()
  const updateKit = useUpdateKit()
  const { data: kitDetails, isLoading: loadingKit } = useKit(selectedKit?._id || '')
  const [hardware, setHardware] = useState<Hardware[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const form = useForm<KitFormData>({
    resolver: zodResolver(kitFormSchema),
    defaultValues: {
      name: '',
      description: '',
      notes: '',
      tags: [],
      state: KitState.CHECKING_STOCK,
      shippingAddress: {
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      company: null,
      user: null,
      property: null,
      hardware: [],
    },
  })

  useEffect(() => {
    if (isEditDialogOpen && kitDetails) {
      loadFormData()
      form.reset({
        name: kitDetails.name || '',
        description: kitDetails.description || '',
        notes: kitDetails.notes || '',
        tags: kitDetails.tags || [],
        state: kitDetails.state,
        shippingAddress: {
          name: kitDetails.shippingAddress?.name || '',
          street: kitDetails.shippingAddress?.street || '',
          city: kitDetails.shippingAddress?.city || '',
          state: kitDetails.shippingAddress?.state || '',
          zipCode: kitDetails.shippingAddress?.zipCode || '',
          country: kitDetails.shippingAddress?.country || '',
        },
        company: kitDetails.company?._id || null,
        user: kitDetails.user?._id || null,
        property: kitDetails.property?._id || null,
        hardware: kitDetails.hardware?.map(h => h._id) || [],
      })
    }
  }, [isEditDialogOpen, kitDetails, form])

  const loadFormData = async () => {
    setLoadingData(true)
    try {
      const [hardwareData, propertiesData] = await Promise.all([
        hardwareApi.list(),
        structuresApi.getProperties()
      ])
      setHardware(hardwareData)
      setProperties(propertiesData)
    } catch (_error) {
      toast.error('Failed to load form data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (data: KitFormData) => {
    if (!selectedKit) return

    try {
      await updateKit.mutateAsync({
        _id: selectedKit._id,
        ...data,
      })

      toast.success('Kit updated successfully')
      setIsEditDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to update kit')
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const currentTags = form.getValues('tags')
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags')
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className='sm:max-w-[725px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Edit Kit</DialogTitle>
          <DialogDescription>
            Update the kit details below.
          </DialogDescription>
        </DialogHeader>
        {loadingData || loadingKit ? (
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
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter kit name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select state' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(KitState).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
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
                  name='description'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='Enter kit description' 
                          className='resize-none' 
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
                          placeholder='Enter notes' 
                          className='resize-none' 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='tags'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className='space-y-2'>
                          <Input
                            placeholder='Type a tag and press Enter'
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                          />
                          <div className='flex flex-wrap gap-2'>
                            {field.value.map((tag) => (
                              <Badge key={tag} variant='secondary'>
                                {tag}
                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='sm'
                                  className='ml-1 h-auto p-0'
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  <X className='h-3 w-3' />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </FormControl>
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
                  name='property'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                        value={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select property' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='none'>None</SelectItem>
                          {properties.map((property) => (
                            <SelectItem key={property._id} value={property._id}>
                              {property.shortAddress}
                              {property.unit && ` Unit ${property.unit}`}
                              {property.city && property.state && ` - ${property.city}, ${property.state}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='col-span-2'>
                  <h3 className='text-sm font-medium mb-2'>Shipping Address</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='shippingAddress.name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder='John Doe' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='shippingAddress.street'
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
                      name='shippingAddress.city'
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
                      name='shippingAddress.state'
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
                      name='shippingAddress.zipCode'
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

                    <FormField
                      control={form.control}
                      name='shippingAddress.country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder='USA' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name='hardware'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel>Hardware</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={hardware.map(h => ({
                            label: `${h.name} (${h.category})`,
                            value: h._id
                          }))}
                          onValueChange={field.onChange}
                          value={field.value}
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
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={updateKit.isPending}>
                  {updateKit.isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Update Kit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}