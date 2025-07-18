import { DataTable, useDataTable } from '@/components/data-table'
import { Kit } from '../types'
import { DataTableToolbar } from './data-table-toolbar'
import { columns } from './kits-columns'

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
