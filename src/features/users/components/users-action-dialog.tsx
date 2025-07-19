'use client'

import { z } from 'zod'
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
import { CompanySelect } from '@/components/form/company-select'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { useUpdateUser, useCreateUser } from '../api/users-api'
import { User } from '../data/schema'
import { useCurrentUser } from '../hooks/use-current-user'

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required.' }),
    lastName: z.string().min(1, { message: 'Last Name is required.' }),
    phone: z.string().optional(),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Email is invalid.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: 'Role is required.' }),
    adminPanelRole: z.union([z.string(), z.null()]).optional(),
    company: z.string().nullable().optional(),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
    isSuperAdmin: z.boolean().optional(),
  })
  .superRefine(
    (
      { isEdit, password, confirmPassword, isSuperAdmin, phone, company },
      ctx
    ) => {
      // Password validation: required for create mode, or for edit mode if user is superadmin
      const shouldValidatePassword =
        !isEdit || (isEdit && isSuperAdmin && password !== '')

      if (shouldValidatePassword) {
        if (password === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password is required.',
            path: ['password'],
          })
        }

        if (password.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must be at least 8 characters long.',
            path: ['password'],
          })
        }

        if (!password.match(/[a-z]/)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must contain at least one lowercase letter.',
            path: ['password'],
          })
        }

        if (!password.match(/\d/)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must contain at least one number.',
            path: ['password'],
          })
        }

        if (password !== confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords don't match.",
            path: ['confirmPassword'],
          })
        }
      }

      // Phone validation
      if (phone) {
        const phoneRegex =
          /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
        if (!phoneRegex.test(phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please enter a valid phone number.',
            path: ['phone'],
          })
        }

        // Remove all non-digits and check length
        const digitsOnly = phone.replace(/\D/g, '')
        if (digitsOnly.length !== 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Phone number must be 10 digits.',
            path: ['phone'],
          })
        }
      }

      // Company validation for create mode
      if (!isEdit && !company) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company is required.',
          path: ['company'],
        })
      }
    }
  )
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const updateUser = useUpdateUser()
  const createUser = useCreateUser()
  const { data: currentUser } = useCurrentUser()
  const isSuperAdmin = currentUser?.adminPanelRole === 'superadmin'

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          company:
            typeof currentRow.company === 'object'
              ? currentRow.company._id
              : currentRow.company,
          password: '',
          confirmPassword: '',
          isEdit,
          isSuperAdmin,
        }
      : {
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          adminPanelRole: '',
          company: null,
          phone: '',
          password: '',
          confirmPassword: '',
          isEdit,
          isSuperAdmin,
        },
  })

  const onSubmit = async (values: UserForm) => {
    try {
      if (isEdit && currentRow) {
        // Prepare update data
        const updateData: Partial<User> & { password?: string } = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone || '',
          role: values.role as User['role'],
          adminPanelRole: (values.adminPanelRole ||
            '') as User['adminPanelRole'],
          company: values.company || undefined,
          active: currentRow.active, // Preserve existing active state
        }

        // Only include password if it was changed and user is superadmin
        if (isSuperAdmin && values.password && values.password.trim() !== '') {
          updateData.password = values.password
        }

        await updateUser.mutateAsync({
          userId: currentRow._id,
          data: updateData,
        })

        toast.success('User updated successfully')
      } else {
        // Create user logic
        const createData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone || '',
          email: values.email,
          password: values.password,
          role: values.role,
          adminPanelRole: values.adminPanelRole || '',
          company: values.company || undefined,
        }

        await createUser.mutateAsync(createData)
        toast.success('User created successfully')
      }

      form.reset()
      onOpenChange(false)
    } catch (_error) {
      toast.error(isEdit ? 'Failed to update user' : 'Failed to create user')
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                      className='col-span-4'
                      items={[
                        { label: 'Owner', value: 'owner' },
                        { label: 'Manager', value: 'manager' },
                        { label: 'Agent', value: 'agent' },
                      ]}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='adminPanelRole'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Admin Panel Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value || undefined}
                      onValueChange={field.onChange}
                      placeholder='Select admin role'
                      className='col-span-4'
                      items={[
                        { label: 'Superadmin', value: 'superadmin' },
                        { label: 'Admin', value: 'admin' },
                        { label: 'Leasing Agent', value: 'leasingAgent' },
                      ]}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='company'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Company
                    </FormLabel>
                    <div className='col-span-4'>
                      <FormControl>
                        <CompanySelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder='Company...'
                        />
                      </FormControl>
                    </div>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {(!isEdit || isSuperAdmin) && (
                <>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder='e.g., S3cur3P@ssw0rd'
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            disabled={!isPasswordTouched}
                            placeholder='e.g., S3cur3P@ssw0rd'
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='user-form'
            disabled={updateUser.isPending || createUser.isPending}
          >
            {(updateUser.isPending || createUser.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {isEdit ? 'Save changes' : 'Create user'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
