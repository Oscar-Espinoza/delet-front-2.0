import { ColumnDef, RowData } from '@tanstack/react-table'
import { DataTable, useDataTable } from '@/components/data-table'
import { Company } from '../types'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

interface DataTableProps {
  columns: ColumnDef<Company>[]
  data: Company[]
  isLoading?: boolean
}

export function CompaniesTable({ columns, data, isLoading }: DataTableProps) {
  const { table } = useDataTable({
    data,
    columns,
  })

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      searchColumn='name'
      searchPlaceholder='Filter companies...'
    />
  )
}
