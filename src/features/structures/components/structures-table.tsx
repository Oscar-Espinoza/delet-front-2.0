import { DataTable, useDataTable } from '@/components/data-table'
import { DataTableToolbar } from './data-table-toolbar'
import { columns } from './structures-columns'
import { Structure } from '../types'

interface StructuresTableProps {
  data: Structure[]
  isLoading?: boolean
}

export function StructuresTable({ data, isLoading }: StructuresTableProps) {
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