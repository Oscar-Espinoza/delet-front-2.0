/**
 * Advanced Table Example
 * 
 * This example demonstrates how to use the shared table utilities
 * with advanced features like faceted filters, server-side pagination,
 * and custom toolbar components.
 */

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { 
  DataTable, 
  DataTableColumnHeader,
  DataTableFacetedFilter,
  useDataTable,
  useTableFilters,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Plus } from 'lucide-react'

// Example data type
interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

// Status options for faceted filter
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

// Role options for faceted filter
const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Guest', value: 'guest' },
]

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString()
    },
  },
]

export function AdvancedTableExample() {
  // State for server-side pagination
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  
  // Simulated data fetch (replace with actual API call)
  const { data, isLoading, pageCount } = useSimulatedData(page, pageSize)
  
  // Initialize table with server-side pagination
  const { table } = useDataTable({
    data: data || [],
    columns,
    pageCount,
    manualPagination: true,
    onPaginationChange: (pagination) => {
      setPage(pagination.pageIndex)
      setPageSize(pagination.pageSize)
    },
  })
  
  // Use the table filters hook for advanced filtering
  const filters = useTableFilters({ table })
  
  // Custom toolbar with advanced filters
  const toolbar = (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* Text search */}
        <Input
          placeholder='Search users...'
          value={filters.getTextFilter('name')}
          onChange={(e) => filters.setTextFilter('name', e.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        
        {/* Faceted filters */}
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title='Status'
          options={statusOptions}
        />
        <DataTableFacetedFilter
          column={table.getColumn('role')}
          title='Role'
          options={roleOptions}
        />
        
        {/* Reset filters */}
        {filters.isFiltered && (
          <Button
            variant='ghost'
            onClick={filters.resetAllFilters}
            className='h-8 px-2 lg:px-3'
          >
            Reset
          </Button>
        )}
      </div>
      
      {/* Action buttons */}
      <div className='flex items-center space-x-2'>
        <Button variant='outline' size='sm' className='h-8'>
          <Download className='mr-2 h-4 w-4' />
          Export
        </Button>
        <Button size='sm' className='h-8'>
          <Plus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </div>
    </div>
  )
  
  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      toolbar={toolbar}
      emptyState={
        <tr>
          <td colSpan={columns.length} className='h-24 text-center'>
            <div className='flex flex-col items-center justify-center'>
              <p className='text-lg font-semibold'>No users found</p>
              <p className='text-muted-foreground'>
                Try adjusting your filters or add a new user
              </p>
            </div>
          </td>
        </tr>
      }
    />
  )
}

// Simulated data hook (replace with actual API call)
function useSimulatedData(page: number, pageSize: number) {
  const [isLoading] = useState(false)
  
  // Simulate API call
  const data: User[] = Array.from({ length: pageSize }, (_, i) => ({
    id: `${page * pageSize + i}`,
    name: `User ${page * pageSize + i}`,
    email: `user${page * pageSize + i}@example.com`,
    status: ['active', 'inactive', 'pending'][i % 3] as User['status'],
    role: ['admin', 'user', 'guest'][i % 3] as User['role'],
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
  }))
  
  return {
    data,
    isLoading,
    pageCount: 10, // Total pages
  }
}