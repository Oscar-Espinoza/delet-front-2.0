import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Upload } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateLead } from '../api'
import { createLeadSchema, CreateLeadFormData, LEAD_STATUS, getStatusLabel } from '../types'

interface CreateLeadModalProps {
  open: boolean
  onClose: () => void
}

export function CreateLeadModal({ open, onClose }: CreateLeadModalProps) {
  const createLead = useCreateLead()
  const [documentPreviews, setDocumentPreviews] = useState<{
    idImage?: string
    document?: string
    documentBack?: string
    face?: string
  }>({})

  const form = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      tags: [],
      propertyIds: [],
      status: LEAD_STATUS.NONE,
    },
  })

  const handleSubmit = async (data: CreateLeadFormData) => {
    try {
      await createLead.mutateAsync(data)
      form.reset()
      setDocumentPreviews({})
      onClose()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleFileChange = (field: keyof typeof documentPreviews) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue(field as any, file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setDocumentPreviews(prev => ({
          ...prev,
          [field]: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[625px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
          <DialogDescription>
            Add a new lead to your system. Fill in the contact details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
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
                      <Input type='email' placeholder='john@example.com' {...field} />
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
                name='status'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LEAD_STATUS).map((status) => (
                          <SelectItem key={status} value={status}>
                            {getStatusLabel(status)}
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
                name='address'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='123 Main St, City, State 12345' {...field} />
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
                        placeholder='Add any additional notes about this lead...' 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Upload Fields */}
              <div className='col-span-2 space-y-4'>
                <h4 className='text-sm font-medium'>Documents (Optional)</h4>
                
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='idImage'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>ID Image</FormLabel>
                        <FormControl>
                          <div className='space-y-2'>
                            <Input
                              type='file'
                              accept='image/*'
                              onChange={handleFileChange('idImage')}
                              {...field}
                            />
                            {documentPreviews.idImage && (
                              <img 
                                src={documentPreviews.idImage} 
                                alt='ID preview' 
                                className='h-20 w-20 object-cover rounded'
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='face'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Face Photo</FormLabel>
                        <FormControl>
                          <div className='space-y-2'>
                            <Input
                              type='file'
                              accept='image/*'
                              onChange={handleFileChange('face')}
                              {...field}
                            />
                            {documentPreviews.face && (
                              <img 
                                src={documentPreviews.face} 
                                alt='Face preview' 
                                className='h-20 w-20 object-cover rounded'
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='document'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Document</FormLabel>
                        <FormControl>
                          <div className='space-y-2'>
                            <Input
                              type='file'
                              accept='image/*,.pdf'
                              onChange={handleFileChange('document')}
                              {...field}
                            />
                            {documentPreviews.document && (
                              <img 
                                src={documentPreviews.document} 
                                alt='Document preview' 
                                className='h-20 w-20 object-cover rounded'
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='documentBack'
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Document Back</FormLabel>
                        <FormControl>
                          <div className='space-y-2'>
                            <Input
                              type='file'
                              accept='image/*,.pdf'
                              onChange={handleFileChange('documentBack')}
                              {...field}
                            />
                            {documentPreviews.documentBack && (
                              <img 
                                src={documentPreviews.documentBack} 
                                alt='Document back preview' 
                                className='h-20 w-20 object-cover rounded'
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={createLead.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={createLead.isPending}>
                {createLead.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create Lead
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}