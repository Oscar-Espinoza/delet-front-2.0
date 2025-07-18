import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import LongText from '@/components/long-text'
import {
  Structure,
  StructureType,
  formatAddress,
  getStructureTypeColor,
} from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Structure>[] = [
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
      const name = row.getValue('name') as string | undefined
      return (
        <div className='flex items-center space-x-2'>
          <LongText className='max-w-48 font-medium'>
            {name || <span className='text-muted-foreground'>Unnamed</span>}
          </LongText>
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
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <Badge
          className={cn(
            'font-medium',
            getStructureTypeColor(type as StructureType)
          )}
        >
          {type}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => {
      const address = row.original.address
      return <div className='text-nowrap'>{formatAddress(address)}</div>
    },
    enableSorting: false,
  },
  {
    id: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User / Company' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div className='space-y-1'>
          <div className='text-sm'>{user?.email || '-'}</div>
          {user?.company && (
            <div className='text-muted-foreground text-xs'>
              {user.company.name}
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'parentStructure',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Parent Structure' />
    ),
    cell: ({ row }) => {
      const parent = row.original.parentStructure
      return (
        <div className='text-nowrap'>
          {parent?.name || <span className='text-muted-foreground'>-</span>}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'properties',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Properties' />
    ),
    cell: ({ row }) => {
      const count = row.original.properties?.length || 0
      return (
        <div className='text-center'>
          <Badge variant='secondary'>{count}</Badge>
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
