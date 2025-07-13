import { ColumnDef, RowData } from '@tanstack/react-table'
import { DataTable, useDataTable } from '@/components/data-table'
import { User } from '../data/schema'
import { DataTableToolbar } from './data-table-toolbar'

declare module '@tanstack/react-table' {
   
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string
  }
}

interface DataTableProps {
  columns: ColumnDef<User>[]
  data: User[]
  isLoading?: boolean
}

export function UsersTable({ columns, data = [], isLoading }: DataTableProps) {
  const { table } = useDataTable({
    data,
    columns,
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
