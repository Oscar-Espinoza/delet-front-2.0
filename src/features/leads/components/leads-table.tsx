import { ColumnDef, RowData, PaginationState } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DataTable,
  useDataTable,
  DataTableViewOptions,
} from '@/components/data-table'
import { Lead } from '../types'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

interface DataTableProps {
  columns: ColumnDef<Lead>[]
  data: Lead[]
  isLoading?: boolean
  pageCount?: number
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: () => void
  onSearchClear?: () => void
}

export function LeadsTable({
  columns,
  data,
  isLoading,
  pageCount,
  onPaginationChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
}: DataTableProps) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    onPaginationChange: onPaginationChange as
      | ((pagination: PaginationState) => void)
      | undefined,
  })

  // Custom toolbar with search
  const customToolbar = (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filter leads...'
          value={searchValue ?? ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchSubmit?.()
            }
          }}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {searchValue && (
          <Button
            variant='ghost'
            onClick={onSearchClear}
            className='h-8 px-2 lg:px-3'
          >
            Clear
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      toolbar={customToolbar}
      showToolbar={true}
      emptyState={
        <tr>
          <td colSpan={columns.length} className='h-24 text-center'>
            No leads found.
          </td>
        </tr>
      }
    />
  )
}
