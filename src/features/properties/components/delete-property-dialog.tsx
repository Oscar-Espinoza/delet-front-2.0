import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteProperty } from '../api'
import { Property, formatAddress } from '../types'

interface DeletePropertyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property
}

export function DeletePropertyDialog({
  open,
  onOpenChange,
  property,
}: DeletePropertyDialogProps) {
  const deleteMutation = useDeleteProperty()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(property._id)
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const address = formatAddress(property)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the property at{' '}
            <span className='font-semibold'>{address}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}