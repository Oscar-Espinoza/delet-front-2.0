'use client'

import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { DataTable, useDataTable } from '@/components/data-table'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  pageCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
}

export function OrdersTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pageCount,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manualPagination: !!onPaginationChange,
    onPaginationChange: onPaginationChange as
      | ((pagination: PaginationState) => void)
      | undefined,
  })

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      toolbar={<DataTableToolbar table={table} />}
      showToolbar={true}
    />
  )
}
