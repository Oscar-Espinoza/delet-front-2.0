import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import LongText from '@/components/long-text'
import { Kit, KitState, getKitStateColor } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Kit>[] = [
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
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return (
        <div className='flex items-center space-x-2'>
          <LongText className='max-w-48 font-medium'>{name}</LongText>
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
    accessorKey: 'state',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='State' />
    ),
    cell: ({ row }) => {
      const state = row.getValue('state') as KitState
      return (
        <Badge className={cn('font-medium', getKitStateColor(state))}>
          {state}
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
      const company = row.original.company || row.original.user?.company
      return (
        <div className='text-nowrap'>
          {company?.name || <span className='text-muted-foreground'>-</span>}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      if (!user) {
        return <span className='text-muted-foreground'>-</span>
      }
      return (
        <div className='space-y-1'>
          <div className='text-sm'>
            {user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.email}
          </div>
          <div className='text-muted-foreground text-xs'>{user.email}</div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'property',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Property' />
    ),
    cell: ({ row }) => {
      const property = row.original.property
      if (!property) {
        return <span className='text-muted-foreground'>-</span>
      }
      return (
        <div className='text-nowrap'>
          <div className='text-sm'>
            {property.shortAddress}
            {property.unit && ` Unit ${property.unit}`}
          </div>
          {property.city && property.state && (
            <div className='text-muted-foreground text-xs'>
              {property.city}, {property.state}
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'hardware',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hardware' />
    ),
    cell: ({ row }) => {
      const count = row.original.hardware?.length || 0
      return (
        <div className='text-center'>
          <Badge variant='secondary'>{count}</Badge>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'tags',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tags' />
    ),
    cell: ({ row }) => {
      const tags = row.original.tags || []
      if (tags.length === 0) {
        return <span className='text-muted-foreground'>-</span>
      }
      return (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant='outline' className='text-xs'>
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant='outline' className='text-xs'>
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: cn(
        'sticky md:table-cell right-0 z-10',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
  },
]
