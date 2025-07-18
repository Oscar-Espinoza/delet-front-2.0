import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearch } from '@tanstack/react-router'
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
import { useBillingEntitiesContext } from '../context/use-billing-entities-context'
import { billingEntityFormSchema, BillingEntityFormData } from '../data/schema'
import { useCreateBillingEntity } from '../hooks/use-billing-entities'

export function CreateBillingEntityModal() {
  const { isCreateDialogOpen, setIsCreateDialogOpen } =
    useBillingEntitiesContext()
  const createBillingEntity = useCreateBillingEntity()
  const search = useSearch({ strict: false }) as { company?: string }

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
    },
  })

  const handleSubmit = async (data: BillingEntityFormData) => {
    if (!search.company) {
      toast.error('Please select a company first')
      return
    }

    try {
      await createBillingEntity.mutateAsync({
        ...data,
        company: search.company,
      })
      toast.success('Billing entity created successfully')
      form.reset()
      setIsCreateDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to create billing entity')
    }
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Create Billing Entity</DialogTitle>
          <DialogDescription>
            Add a new billing entity to your system. Fill in the entity details
            below.
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
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createBillingEntity.isPending}>
                {createBillingEntity.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Entity
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
