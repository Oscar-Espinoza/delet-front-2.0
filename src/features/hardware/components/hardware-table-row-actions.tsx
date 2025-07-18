import { Row } from '@tanstack/react-table'
import { IconDots, IconEdit, IconTrash, IconEye } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useHardwareContext } from '../contexts/hardware-context'
import type { Hardware } from '../types/hardware'

interface HardwareTableRowActionsProps {
  row: Row<Hardware>
}

export function HardwareTableRowActions({ row }: HardwareTableRowActionsProps) {
  const hardware = row.original
  const {
    setEditingHardware,
    setIsEditDialogOpen,
    setDeletingHardware,
    setIsDeleteDialogOpen,
  } = useHardwareContext()

  const handleEdit = () => {
    setEditingHardware(hardware)
    setIsEditDialogOpen(true)
  }

  const handleDelete = () => {
    setDeletingHardware(hardware)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <IconDots className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer'>
          <IconEye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer' onClick={handleEdit}>
          <IconEdit className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-destructive hover:text-destructive cursor-pointer'
          onClick={handleDelete}
        >
          <IconTrash className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
