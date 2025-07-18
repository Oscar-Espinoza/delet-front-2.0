import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { useCreateCompany } from '../api'
import { useCompaniesContext } from '../context/use-companies-context'
import { companyFormSchema, CompanyFormData } from '../types'

export function CreateCompanyModal() {
  const { isCreateDialogOpen, setIsCreateDialogOpen } = useCompaniesContext()
  const createCompany = useCreateCompany()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [idImagePreview, setIdImagePreview] = useState<string | null>(null)

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      units: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      phone: '',
      email: '',
      description: '',
      users: '',
    },
  })

  const handleSubmit = async (data: CompanyFormData) => {
    try {
      await createCompany.mutateAsync(data)
      toast.success('Company created successfully')
      form.reset()
      setLogoPreview(null)
      setIdImagePreview(null)
      setIsCreateDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to create company')
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('logo', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('idImage', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Create Company</DialogTitle>
          <DialogDescription>
            Add a new company to your system. Fill in the company details below.
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
                  <FormItem className='col-span-2'>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter company name' {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='company@example.com'
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='+1 (555) 000-0000' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='units'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units</FormLabel>
                    <FormControl>
                      <Input placeholder='Number of units' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='users'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Users</FormLabel>
                    <FormControl>
                      <Input placeholder='Users information' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='col-span-2'>
                <FormLabel>ID Image</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleIdImageChange}
                  />
                </FormControl>
                {idImagePreview && (
                  <img
                    src={idImagePreview}
                    alt='ID Image preview'
                    className='mt-2 h-20 w-20 rounded object-cover'
                  />
                )}
                <FormMessage />
              </FormItem>

              <div className='col-span-2'>
                <FormLabel>Address</FormLabel>
                <div className='mt-2 grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='address.street'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormControl>
                          <Input placeholder='Street address' {...field} />
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
                        <FormControl>
                          <Input placeholder='City' {...field} />
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
                        <FormControl>
                          <Input placeholder='State/Province' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.postalCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Postal code' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='address.country'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder='Country' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter company description'
                        className='resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className='col-span-2'>
                <FormLabel>Company Logo</FormLabel>
                <FormControl>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleLogoChange}
                  />
                </FormControl>
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt='Logo preview'
                    className='mt-2 h-20 w-20 rounded object-cover'
                  />
                )}
                <FormMessage />
              </FormItem>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createCompany.isPending}>
                {createCompany.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Company
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
