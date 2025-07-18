import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import {
  Building2,
  Link,
  Calendar,
  DollarSign,
  Users,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import LongText from '@/components/long-text'
import {
  Property,
  PropertyStatus,
  formatAddress,
  getStatusColor,
  getStatusLabel,
} from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Property>[] = [
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
    accessorKey: 'isManaged',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Managed' />
    ),
    cell: ({ row }) => {
      const isManaged = row.getValue('isManaged') as boolean
      return (
        <div className='flex items-center justify-center'>
          {isManaged ? (
            <Check className='h-4 w-4 text-green-600' />
          ) : (
            <X className='text-muted-foreground/50 h-4 w-4' />
          )}
        </div>
      )
    },
  },
  {
    id: 'details',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Details' />
    ),
    cell: ({ row }) => {
      const property = row.original
      const address = formatAddress(property)

      return (
        <div className='flex items-start space-x-3'>
          {/* Images column */}
          <div className='flex-shrink-0'>
            {property.primaryImage ? (
              <img
                src={property.primaryImage}
                alt={address}
                className='h-16 w-16 rounded-md object-cover'
              />
            ) : (
              <div className='bg-muted flex h-16 w-16 items-center justify-center rounded-md'>
                <Building2 className='text-muted-foreground h-6 w-6' />
              </div>
            )}
          </div>

          {/* Address details column */}
          <div className='flex flex-col space-y-1'>
            <LongText className='max-w-xs font-medium'>{address}</LongText>
            {property.propertyType && (
              <span className='text-muted-foreground text-xs capitalize'>
                {property.propertyType}
              </span>
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user.company.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const company = row.original.user?.company
      return company?.name ? (
        <Badge variant='outline' className='font-normal'>
          {company.name}
        </Badge>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'redirectUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Redirect URL' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('redirectUrl') as string | undefined
      return url ? (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center space-x-1 text-blue-600 hover:underline'
        >
          <Link className='h-3 w-3' />
          <span className='max-w-[200px] truncate text-sm'>{url}</span>
        </a>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number | undefined
      return price ? (
        <div className='flex items-center space-x-1'>
          <DollarSign className='text-muted-foreground h-3 w-3' />
          <span className='font-medium'>{price.toLocaleString()}</span>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'leadsCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Leads' />
    ),
    cell: ({ row }) => {
      const leads = row.getValue('leadsCount') as number | undefined
      return (
        <div className='flex items-center space-x-1'>
          <Users className='text-muted-foreground h-3 w-3' />
          <span className='font-medium'>{leads || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'listedDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Listed Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('listedDate') as string | undefined
      return date ? (
        <div className='flex items-center space-x-1'>
          <Calendar className='text-muted-foreground h-3 w-3' />
          <span className='text-sm'>
            {format(new Date(date), 'MMM d, yyyy')}
          </span>
        </div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as PropertyStatus
      return (
        <Badge className={cn('font-normal', getStatusColor(status))}>
          {getStatusLabel(status)}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
  // Hidden columns for filtering
  {
    accessorKey: 'propertyType',
    enableHiding: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'user.company._id',
    id: 'company',
    enableHiding: true,
    enableColumnFilter: true,
  },
]
