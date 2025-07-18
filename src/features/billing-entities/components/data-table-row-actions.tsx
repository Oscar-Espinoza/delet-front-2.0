import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useBillingEntitiesContext } from '../context/use-billing-entities-context'
import { BillingEntity } from '../types'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const billingEntity = row.original as BillingEntity
  const {
    setViewingEntity,
    setIsViewDialogOpen,
    setEditingEntity,
    setIsEditDialogOpen,
    setDeletingEntity,
    setIsDeleteDialogOpen,
  } = useBillingEntitiesContext()

  const handleView = () => {
    setViewingEntity(billingEntity)
    setIsViewDialogOpen(true)
  }

  const handleEdit = () => {
    setEditingEntity(billingEntity)
    setIsEditDialogOpen(true)
  }

  const handleDelete = () => {
    setDeletingEntity(billingEntity)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted h-8 w-8 p-0'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
