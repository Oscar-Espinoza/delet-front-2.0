import { useEffect } from 'react'
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
import { AddressAutocomplete } from '@/components/AddressAutocomplete'
import { CompanySelect } from '@/components/form/company-select'
import { useBillingEntitiesContext } from '../context/use-billing-entities-context'
import { billingEntityFormSchema, BillingEntityFormData } from '../data/schema'
import { useUpdateBillingEntity } from '../hooks/use-billing-entities'

export function EditBillingEntityModal() {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingEntity,
    setEditingEntity,
  } = useBillingEntitiesContext()
  const updateBillingEntity = useUpdateBillingEntity()

  const form = useForm<BillingEntityFormData>({
    resolver: zodResolver(billingEntityFormSchema),
    defaultValues: {
      entityName: '',
      entityType: 'individual',
      email: '',
      phone: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      taxId: '',
      notes: '',
      company: '',
    },
  })

  useEffect(() => {
    if (editingEntity) {
      form.reset({
        entityName: editingEntity.entityName || '',
        entityType: editingEntity.entityType || 'individual',
        email: editingEntity.email || '',
        phone: editingEntity.phone || '',
        billingAddress: {
          street: editingEntity.billingAddress?.street || '',
          city: editingEntity.billingAddress?.city || '',
          state: editingEntity.billingAddress?.state || '',
          zipCode: editingEntity.billingAddress?.zipCode || '',
          country: editingEntity.billingAddress?.country || '',
        },
        taxId: editingEntity.taxId || '',
        notes: editingEntity.notes || '',
        company: editingEntity.company || '',
      })
    }
  }, [editingEntity, form])

  const handleSubmit = async (data: BillingEntityFormData) => {
    if (!editingEntity) return

    if (!data.company) {
      toast.error('Please select a company')
      return
    }

    try {
      await updateBillingEntity.mutateAsync({
        _id: editingEntity._id,
        ...data,
      })

      // Success handling is now done in the hook
      form.reset()
      setIsEditDialogOpen(false)
      setEditingEntity(null)
    } catch (error) {
      // Error handling is now done in the hook with more detail
    }
  }

  const handleClose = () => {
    setIsEditDialogOpen(false)
    setEditingEntity(null)
    form.reset()
  }

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Edit Billing Entity</DialogTitle>
          <DialogDescription>
            Update the billing entity information. Make your changes and save.
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
                name='entityName'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Entity Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter entity name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='entityType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select entity type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='individual'>Individual</SelectItem>
                        <SelectItem value='business'>Business</SelectItem>
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
                    <FormLabel>Company *</FormLabel>
                    <FormControl>
                      <CompanySelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select company'
                        includeNone={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='taxId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter tax ID' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='entity@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder='+1 (555) 000-0000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='billingAddress'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Billing Address *</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Start typing an address...'
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
                        placeholder='Additional notes about this billing entity...'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateBillingEntity.isPending}>
                {updateBillingEntity.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
