import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import LongText from '@/components/long-text'
import { BillingEntity } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<BillingEntity>[] = [
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
    accessorKey: 'entityName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Entity Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 font-medium'>
        {row.getValue('entityName')}
      </LongText>
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
    accessorKey: 'entityType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const entityType = row.getValue('entityType') as string
      return (
        <Badge variant={entityType === 'business' ? 'default' : 'secondary'}>
          {entityType === 'business' ? 'Business' : 'Individual'}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      const entityType = row.getValue('entityType') as string
      return value.includes(entityType)
    },
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
          <LongText className='max-w-48'>{email}</LongText>
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
    id: 'billingAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Billing Address' />
    ),
    cell: ({ row }) => {
      const { billingAddress } = row.original
      if (
        !billingAddress ||
        (!billingAddress.city &&
          !billingAddress.state &&
          !billingAddress.country)
      ) {
        return <span className='text-muted-foreground'>-</span>
      }

      const parts = [
        billingAddress.city,
        billingAddress.state,
        billingAddress.country,
      ].filter(Boolean)
      return <LongText className='max-w-48'>{parts.join(', ')}</LongText>
    },
    filterFn: (row, _id, value) => {
      const { billingAddress } = row.original
      if (!billingAddress) return false

      const searchValue = value.toLowerCase()
      return (
        billingAddress.city?.toLowerCase().includes(searchValue) ||
        billingAddress.state?.toLowerCase().includes(searchValue) ||
        billingAddress.country?.toLowerCase().includes(searchValue) ||
        false
      )
    },
  },
  {
    accessorKey: 'taxId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tax ID' />
    ),
    cell: ({ row }) => {
      const taxId = row.getValue('taxId') as string
      return taxId ? (
        <div className='text-nowrap'>{taxId}</div>
      ) : (
        <span className='text-muted-foreground'>-</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      const isActive = row.getValue('isActive') as boolean
      return value.includes(isActive ? 'active' : 'inactive')
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
