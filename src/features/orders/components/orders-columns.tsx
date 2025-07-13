import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import LongText from '@/components/long-text'
import { 
  Order, 
  getOrderStatusColor, 
  getOrderStatusLabel, 
  getOrderTypeLabel 
} from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import type { OrderStatus, OrderType } from '../types'

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: '_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Order ID' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-xs'>{row.getValue('_id')}</div>
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
    id: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      if (typeof user === 'string') {
        return <div>User ID: {user}</div>
      }
      const customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      return (
        <div>
          <div className='font-medium'>{customerName}</div>
          <div className='text-xs text-muted-foreground'>{user.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge variant='outline' className='capitalize'>
          {getOrderTypeLabel(type as OrderType)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('quantity')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge 
          variant='outline' 
          className={cn('capitalize', getOrderStatusColor(status as OrderStatus))}
        >
          {getOrderStatusLabel(status as OrderStatus)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const company = row.original.company
      const companyName = typeof company === 'object' ? company.name : 'N/A'
      return <div className='w-fit text-nowrap'>{companyName}</div>
    },
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => {
      const address = row.getValue('address') as string
      return address ? (
        <LongText className='max-w-48'>{address}</LongText>
      ) : (
        <span className='text-muted-foreground'>No address</span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue('createdAt') as number
      const date = new Date(timestamp * 1000)
      return (
        <div className='text-nowrap'>
          {format(date, 'MMM dd, yyyy')}
          <div className='text-xs text-muted-foreground'>
            {format(date, 'h:mm a')}
          </div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]