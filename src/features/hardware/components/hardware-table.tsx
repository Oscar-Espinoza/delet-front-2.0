import { DataTable, useDataTable } from '@/components/data-table'
import { hardwareColumns } from './hardware-columns'
import { HardwareTableToolbar } from './hardware-table-toolbar'
import type { Hardware } from '../types/hardware'
import { useHardwareContext } from '../contexts/hardware-context'

interface HardwareTableProps {
  data: Hardware[]
  isLoading?: boolean
}

export function HardwareTable({ data, isLoading }: HardwareTableProps) {
  const { setSelectedHardware } = useHardwareContext()

  const { table, rowSelection } = useDataTable({
    data,
    columns: hardwareColumns,
  })

  // Update selected hardware when row selection changes
  const selectedRows = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((key) => data[parseInt(key)])
    .filter(Boolean)
  
  if (selectedRows.length !== table.getSelectedRowModel().rows.length) {
    setSelectedHardware(selectedRows)
  }

  return (
    <DataTable
      table={table}
      columns={hardwareColumns}
      isLoading={isLoading}
      toolbar={<HardwareTableToolbar table={table} />}
      showToolbar={true}
    />
  )
}