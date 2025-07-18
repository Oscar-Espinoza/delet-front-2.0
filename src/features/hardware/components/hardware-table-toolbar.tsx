import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useHardwareContext } from '../contexts/hardware-context'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface HardwareTableToolbarProps<TData> {
  table: Table<TData>
}

const categoryOptions = [
  { value: 'router', label: 'Router' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'camera', label: 'Camera' },
  { value: 'lock', label: 'Lock' },
  { value: 'lockbox', label: 'Lockbox' },
  { value: 'keypad', label: 'Keypad' },
  { value: 'hub', label: 'Hub' },
  { value: 'sensor', label: 'Sensor' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
]

const operationalStatusOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'unknown', label: 'Unknown' },
]

export function HardwareTableToolbar<TData>({
  table,
}: HardwareTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { setIsCreateDialogOpen } = useHardwareContext()

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Search hardware...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title='Category'
            options={categoryOptions}
          />
        )}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={statusOptions}
          />
        )}
        {table.getColumn('operationalStatus') && (
          <DataTableFacetedFilter
            column={table.getColumn('operationalStatus')}
            title='Operational'
            options={operationalStatusOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <DataTableViewOptions table={table} />
        <Button
          size='sm'
          className='h-8'
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <IconPlus className='mr-2 h-4 w-4' />
          Add Hardware
        </Button>
      </div>
    </div>
  )
}
