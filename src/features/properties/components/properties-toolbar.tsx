import { useState, useEffect } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/data-table'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { PROPERTY_STATUS, getStatusLabel } from '../types'

interface PropertiesToolbarProps<TData> {
  table: Table<TData>
  onSearchChange: (search: string) => void
  searchValue?: string
}

export function PropertiesToolbar<TData>({
  table,
  onSearchChange,
  searchValue = '',
}: PropertiesToolbarProps<TData>) {
  const [searchInput, setSearchInput] = useState(searchValue)
  const isFiltered = table.getState().columnFilters.length > 0 || searchValue

  const statusOptions = Object.entries(PROPERTY_STATUS).map(([, value]) => ({
    value,
    label: getStatusLabel(value),
  }))

  // Set default active status filter on mount
  useEffect(() => {
    const statusColumn = table.getColumn('status')
    if (statusColumn && !statusColumn.getFilterValue()) {
      statusColumn.setFilterValue([PROPERTY_STATUS.ACTIVE])
    }
  }, [table])

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(searchInput)
    }
  }

  const handleReset = () => {
    table.resetColumnFilters()
    setSearchInput('')
    onSearchChange('')
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* Search Input */}
        <div className='relative'>
          <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search properties by address...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className='h-8 w-[150px] pl-8 lg:w-[250px]'
          />
        </div>
        
        {/* Status Filter */}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='Status'
            options={statusOptions}
          />
        )}
        
        {/* Reset Button */}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={handleReset}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      
      <DataTableViewOptions table={table} />
    </div>
  )
}