import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Eye, Trash2, Archive, RotateCw, Copy, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Property, PROPERTY_STATUS } from '../types'
import { usePropertiesContext } from '../context/use-properties-context'
import { useArchiveProperty, useRestoreProperty, useDuplicateProperty } from '../api'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const property = row.original as Property
  const { 
    setEditingProperty, 
    setIsEditDialogOpen, 
    setViewingProperty, 
    setIsViewDialogOpen,
    setDeletingProperty,
    setIsDeleteDialogOpen
  } = usePropertiesContext()
  
  const archiveMutation = useArchiveProperty()
  const restoreMutation = useRestoreProperty()
  const duplicateMutation = useDuplicateProperty()

  const handleEdit = () => {
    setEditingProperty(property)
    setIsEditDialogOpen(true)
  }

  const handleView = () => {
    setViewingProperty(property)
    setIsViewDialogOpen(true)
  }

  const handleDelete = () => {
    setDeletingProperty(property)
    setIsDeleteDialogOpen(true)
  }

  const handleArchive = () => {
    archiveMutation.mutate(property._id)
  }

  const handleRestore = () => {
    restoreMutation.mutate(property._id)
  }

  const handleDuplicate = () => {
    duplicateMutation.mutate(property._id)
  }

  const handleOpenRedirectUrl = () => {
    if (property.redirectUrl) {
      window.open(property.redirectUrl, '_blank')
    }
  }

  const isArchived = property.status === PROPERTY_STATUS.ARCHIVED

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className='mr-2 h-4 w-4' />
          Duplicate
        </DropdownMenuItem>
        {property.redirectUrl && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOpenRedirectUrl}>
              <Link className='mr-2 h-4 w-4' />
              Open URL
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        {isArchived ? (
          <DropdownMenuItem onClick={handleRestore}>
            <RotateCw className='mr-2 h-4 w-4' />
            Restore
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className='mr-2 h-4 w-4' />
            Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}