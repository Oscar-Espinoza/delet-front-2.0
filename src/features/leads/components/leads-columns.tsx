import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from '@/components/data-table'
import { Lead, getStatusColor, getStatusLabel } from '../types'
import { CheckCircle2, XCircle, Calendar, User, MapPin } from 'lucide-react'

export const columns: ColumnDef<Lead>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'contact.firstName',
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const firstName = row.original.contact.firstName
      const lastName = row.original.contact.lastName
      const fullName = `${firstName} ${lastName}`.trim()

      return (
        <div className='flex items-center space-x-2'>
          <div className='flex flex-col'>
            <LongText className='max-w-48 font-medium'>{fullName}</LongText>
            {row.original.contact.email && (
              <span className='text-xs text-muted-foreground'>{row.original.contact.email}</span>
            )}
          </div>
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'contact.phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      const phone = row.original.contact.phone
      return phone ? (
        <a href={`tel:${phone}`} className='text-blue-600 hover:underline'>
          {phone}
        </a>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'property',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Property' />
    ),
    cell: ({ row }) => {
      const property = row.original.property
      return property ? (
        <div className='flex items-center space-x-2'>
          <MapPin className='h-4 w-4 text-muted-foreground' />
          <div>
            <LongText className='max-w-48 text-sm'>{property.shortAddress || property.address}</LongText>
            {property.unit && (
              <span className='text-xs text-muted-foreground'>Unit {property.unit}</span>
            )}
          </div>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'contact.status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.contact.status
      return (
        <Badge
          variant='secondary'
          className={cn('text-xs', getStatusColor(status))}
        >
          {getStatusLabel(status)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Showing Date' />
    ),
    cell: ({ row }) => {
      const startTime = row.getValue('startTime') as number
      return startTime ? (
        <div className='flex items-center space-x-2'>
          <Calendar className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>{format(new Date(startTime), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Agent' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      return user ? (
        <div className='flex items-center space-x-2'>
          <User className='h-4 w-4 text-muted-foreground' />
          <div className='flex flex-col'>
            <span className='text-sm'>{`${user.firstName} ${user.lastName}`}</span>
            {user.company && (
              <span className='text-xs text-muted-foreground'>{user.company.name}</span>
            )}
          </div>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'incomplete',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Complete' />
    ),
    cell: ({ row }) => {
      const incomplete = row.getValue('incomplete') as boolean
      return (
        <div className='flex items-center'>
          {!incomplete ? (
            <CheckCircle2 className='h-5 w-5 text-green-600' />
          ) : (
            <XCircle className='h-5 w-5 text-muted-foreground' />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'isVerified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Verified' />
    ),
    cell: ({ row }) => {
      const isVerified = row.getValue('isVerified') as boolean
      return (
        <div className='flex items-center'>
          {isVerified ? (
            <Badge variant='secondary' className='bg-green-50 text-green-700'>
              Verified
            </Badge>
          ) : (
            <Badge variant='secondary' className='bg-gray-50 text-gray-700'>
              Unverified
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return (
        <span className='text-sm text-muted-foreground'>
          {format(new Date(createdAt), 'MMM dd, yyyy')}
        </span>
      )
    },
  },
]