import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Hardware } from '../types/hardware'
import { HardwareTableRowActions } from './hardware-table-row-actions'
import { 
  IconRouter, 
  IconDeviceTablet, 
  IconCamera,
  IconLock,
  IconBox,
  IconKeyboard,
  IconBroadcast,
  IconRadar
} from '@tabler/icons-react'

const categoryIcons: Record<string, React.ElementType> = {
  router: IconRouter,
  tablet: IconDeviceTablet,
  camera: IconCamera,
  lock: IconLock,
  lockbox: IconBox,
  keypad: IconKeyboard,
  hub: IconBroadcast,
  sensor: IconRadar,
}

export const hardwareColumns: ColumnDef<Hardware>[] = [
  {
    id: 'select',
    size: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const category = row.original.category
      const Icon = category ? categoryIcons[category] : null
      
      return (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className="font-medium">{row.getValue('name') || 'Unnamed'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string | undefined
      if (!category) return '-'
      
      return (
        <Badge variant="outline" className="capitalize">
          {category}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'inventoryId',
    header: 'Inventory ID',
    cell: ({ row }) => row.getValue('inventoryId') || '-',
  },
  {
    accessorKey: 'model',
    header: 'Model',
    cell: ({ row }) => row.getValue('model') || '-',
  },
  {
    accessorKey: 'serial',
    header: 'Serial',
    cell: ({ row }) => row.getValue('serial') || '-',
  },
  {
    accessorKey: 'property',
    header: 'Property',
    cell: ({ row }) => {
      const property = row.original.property
      return property?.name || '-'
    },
  },
  {
    accessorKey: 'user',
    header: 'Assigned To',
    cell: ({ row }) => {
      const user = row.original.user
      return user?.name || user?.email || '-'
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant={status === 'active' ? 'default' : 'secondary'}
          className={cn(
            status === 'active' && 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
            status === 'disabled' && 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
          )}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'operationalStatus',
    header: 'Operational Status',
    cell: ({ row }) => {
      const status = row.getValue('operationalStatus') as string
      const battery = row.original.battery
      
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              status === 'online' && 'border-green-500 text-green-500',
              status === 'offline' && 'border-red-500 text-red-500',
              status === 'unknown' && 'border-gray-500 text-gray-500'
            )}
          >
            {status}
          </Badge>
          {battery && battery.level < 20 && (
            <Badge variant="destructive" className="text-xs">
              {battery.level}%
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    size: 50,
    cell: ({ row }) => <HardwareTableRowActions row={row} />,
  },
]