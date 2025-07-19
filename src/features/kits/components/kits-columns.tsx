import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import LongText from '@/components/long-text'
import { Kit } from '../types'
import { DataTableRowActions } from './data-table-row-actions'
import { HardwareStatusCell } from './hardware-status-cell'

export const columns: ColumnDef<Kit>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return (
        <div className='flex items-center space-x-2'>
          <LongText className='max-w-28 font-medium'>{name}</LongText>
        </div>
      )
    },
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-0 md:table-cell'
      ),
    },
    enableHiding: false,
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
      <DataTableColumnHeader column={column} title='Hardware Status' />
    ),
    cell: ({ row }) => {
      const hardware = row.original.hardware || []
      if (hardware.length === 0) {
        return <span className='text-muted-foreground'>No hardware</span>
      }
      return <HardwareStatusCell hardware={hardware} />
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
