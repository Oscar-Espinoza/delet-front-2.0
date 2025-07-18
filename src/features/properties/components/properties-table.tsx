import { useState, useEffect } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { useProperties } from '../api'
import { PropertyFilters } from '../types'
import { columns } from './properties-columns'
import { PropertiesToolbar } from './properties-toolbar'

interface PropertiesTableProps {
  companyId?: string
}

export function PropertiesTable({ companyId }: PropertiesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    propertyType: false, // Hide propertyType column by default
    company: false, // Hide company column by default
  })
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Filters state
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    limit: 10,
    companiesIds: companyId ? [companyId] : undefined,
  })

  // Store last known page count to avoid showing "Page X of 1" during loading
  const [lastPageCount, setLastPageCount] = useState(1)

  // Query for properties
  const { data, isLoading } = useProperties(filters)
  const properties = data?.properties || []
  const pageCount = data?.totalPages || lastPageCount

  // Update last known page count when data loads
  useEffect(() => {
    if (data?.totalPages) {
      setLastPageCount(data.totalPages)
    }
  }, [data?.totalPages])

  // Update filters when pagination changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }))
  }, [pagination])

  // Update filters when sorting changes
  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0]
      setFilters((prev) => ({
        ...prev,
        sortBy: sort.id,
        sortOrder: sort.desc ? 'desc' : 'asc',
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        sortBy: undefined,
        sortOrder: undefined,
      }))
    }
  }, [sorting])

  // Update filters when column filters change
  useEffect(() => {
    const statusFilter = columnFilters.find((f) => f.id === 'status')
    const typeFilter = columnFilters.find((f) => f.id === 'propertyType')

    setFilters((prev) => ({
      ...prev,
      status: (statusFilter?.value as string[]) || undefined,
      type: (typeFilter?.value as string[]) || undefined,
      companiesIds: companyId ? [companyId] : undefined,
      page: 1,
    }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [columnFilters, companyId])

  const table = useReactTable({
    data: properties,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  // Filter handlers
  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <div className='space-y-4'>
      <PropertiesToolbar
        table={table}
        onSearchChange={handleSearchChange}
        searchValue={filters.search}
      />

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.className}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columns.length}>
                    <Skeleton className='h-12 w-full' />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
