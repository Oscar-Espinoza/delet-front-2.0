import { ColumnDef, RowData } from '@tanstack/react-table'
import { DataTable, useDataTable } from '@/components/data-table'
import { BillingEntity } from '../types'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

interface DataTableProps {
  columns: ColumnDef<BillingEntity>[]
  data: BillingEntity[]
  isLoading?: boolean
}

export function BillingEntitiesTable({
  columns,
  data,
  isLoading,
}: DataTableProps) {
  const { table } = useDataTable({
    data,
    columns,
  })

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      searchColumn='entityName'
      searchPlaceholder='Filter billing entities...'
    />
  )
}
