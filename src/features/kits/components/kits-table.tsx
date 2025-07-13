import { DataTable, useDataTable } from '@/components/data-table'
import { DataTableToolbar } from './data-table-toolbar'
import { columns } from './kits-columns'
import { Kit } from '../types'

interface KitsTableProps {
  data: Kit[]
  isLoading?: boolean
}

export function KitsTable({ data, isLoading }: KitsTableProps) {
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