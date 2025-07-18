import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { Order } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

const KIT_PRICE = 50

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
    id: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      if (typeof user === 'string') {
        return <div>User ID: {user}</div>
      }
      const customerName =
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      return (
        <div>
          <div className='font-medium'>{customerName}</div>
          <div className='text-muted-foreground text-xs'>{user.email}</div>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      const user = row.original.user
      if (typeof user === 'string') {
        return user.toLowerCase().includes(value.toLowerCase())
      }
      const customerName =
        `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
      const searchValue = value.toLowerCase()
      return (
        customerName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
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
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quantity' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue('quantity')}</div>
    ),
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
    id: 'addresses',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Addresses' />
    ),
    cell: ({ row }) => {
      const deliveryAddresses = row.original.deliveryAddresses
      if (!deliveryAddresses || deliveryAddresses.length === 0) {
        return <span className='text-muted-foreground'>No addresses</span>
      }

      const count = deliveryAddresses.length
      return (
        <div className='text-center'>
          {count === 1 ? '1 address' : `${count} addresses`}
        </div>
      )
    },
  },
  {
    id: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => {
      const quantity = row.original.quantity
      const total = quantity * KIT_PRICE
      return <div className='text-right font-medium'>${total.toFixed(2)}</div>
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
          <div className='text-muted-foreground text-xs'>
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
