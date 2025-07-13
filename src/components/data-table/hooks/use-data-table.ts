import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanstackTable,
} from '@tanstack/react-table'

export interface UseDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  pageCount?: number
  defaultPerPage?: number
  manualPagination?: boolean
  onPaginationChange?: (pagination: PaginationState) => void
  initialSorting?: SortingState
  initialColumnFilters?: ColumnFiltersState
  initialColumnVisibility?: VisibilityState
}

export interface UseDataTableReturn<TData> {
  table: TanstackTable<TData>
  // Expose commonly used state setters
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>
  // Expose state values
  rowSelection: Record<string, boolean>
  columnFilters: ColumnFiltersState
  sorting: SortingState
  columnVisibility: VisibilityState
}

export function useDataTable<TData>({
  data,
  columns,
  pageCount,
  defaultPerPage = 10,
  manualPagination = false,
  onPaginationChange,
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
}: UseDataTableProps<TData>): UseDataTableReturn<TData> {
  // Table state
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters)
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  
  // Pagination state (only used for manual pagination)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPerPage,
  })

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(manualPagination && { pagination }),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(manualPagination && {
      onPaginationChange: (updater) => {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater
        setPagination(newPagination)
        onPaginationChange?.(newPagination)
      },
      manualPagination: true,
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return {
    table,
    setRowSelection,
    setColumnFilters,
    setSorting,
    setColumnVisibility,
    rowSelection,
    columnFilters,
    sorting,
    columnVisibility,
  }
}