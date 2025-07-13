import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { Company } from '../types'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Company>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company Name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center space-x-2'>
        {row.original.logoUrl && (
          <img 
            src={row.original.logoUrl} 
            alt={row.getValue('name')} 
            className='h-8 w-8 rounded object-cover'
          />
        )}
        <LongText className='max-w-48 font-medium'>{row.getValue('name')}</LongText>
      </div>
    ),
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      return email ? (
        <a href={`mailto:${email}`} className='text-blue-600 hover:underline'>
          {email}
        </a>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      return phone ? (
        <div className='text-nowrap'>{phone}</div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
    enableSorting: false,
  },
  {
    id: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      const { address } = row.original
      if (!address || (!address.city && !address.state && !address.country)) {
        return <span className='text-muted-foreground'>-</span>
      }
      
      const parts = [address.city, address.state, address.country].filter(Boolean)
      return <LongText className='max-w-48'>{parts.join(', ')}</LongText>
    },
    filterFn: (row, _id, value) => {
      const { address } = row.original
      if (!address) return false
      
      const searchValue = value.toLowerCase()
      return (
        address.city?.toLowerCase().includes(searchValue) ||
        address.state?.toLowerCase().includes(searchValue) ||
        address.country?.toLowerCase().includes(searchValue) ||
        false
      )
    },
  },
  {
    accessorKey: 'units',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Units' />
    ),
    cell: ({ row }) => {
      const units = row.getValue('units') as string
      return units ? (
        <div className='text-center'>{units}</div>
      ) : (
        <span className='text-muted-foreground text-center'>-</span>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return description ? (
        <LongText className='max-w-64'>{description}</LongText>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]